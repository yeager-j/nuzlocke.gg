import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

import { PokemonSpecies } from "@lib/pokemon/types";
import { DATA_PATH } from "@lib/pokemon/utils";

const prisma = new PrismaClient();

/**
 * Seeds initial Pokémon data into the database using provided Pokémon names and additional data.
 * Handles creation of species, forms, and modes while deferring evolution relationship updates.
 *
 * @param {string[]} pokemonList - An array of Pokémon names to seed data for.
 * @return {Promise<{formName: string, evolvesFrom?: string}[]>} A list of form evolution updates to be applied later.
 */
export async function seedInitialPokemonData(
  pokemonList: string[],
): Promise<{ formName: string; evolvesFrom?: string }[]> {
  console.log("Seeding initial Pokemon data...");
  const formEvolutionUpdates: { formName: string; evolvesFrom?: string }[] = [];

  for (const pokemonName of pokemonList) {
    console.log(`Seeding ${pokemonName}...`);
    const pokemon = await getPokemonFromFile(pokemonName);

    // Upsert species
    await prisma.species.upsert({
      where: { nationalDexNumber: pokemon.nationalDexNumber },
      update: {},
      create: {
        nationalDexNumber: pokemon.nationalDexNumber,
        name: pokemon.name,
      },
    });

    for (const form of pokemon.forms) {
      console.log(`Seeding ${pokemon.name} form ${form.formName}...`);
      // Create form without the evolution relation.
      const savedForm = await prisma.form.create({
        data: {
          speciesId: pokemon.nationalDexNumber,
          formName: form.formName,
          movePool: JSON.stringify(form.movePool),
          // Skip evolving relation here.
        },
      });

      // Collect evolution info for the second phase.
      if (form.evolvesFrom) {
        console.log(`${form.formName} evolves from ${form.evolvesFrom}...`);
        formEvolutionUpdates.push({
          formName: savedForm.formName,
          evolvesFrom: form.evolvesFrom,
        });
      }

      // Create associated modes.
      for (const mode of form.modes) {
        console.log(
          `Seeding ${pokemonName} form ${form.formName} mode ${mode.modeName}...`,
        );
        await prisma.mode.create({
          data: {
            formName: savedForm.formName, // or use formId: savedForm.id if preferred
            modeName: mode.modeName,
            sprite: mode.sprite,
            isDefault: mode.isDefault,
            types: JSON.stringify(mode.types),
            baseStats: JSON.stringify(mode.baseStats),
            abilities: JSON.stringify(mode.abilities),
          },
        });
      }
    }
  }

  return formEvolutionUpdates;
}

/**
 * Updates the evolution relationships between forms in the database.
 *
 * @param {Array} formEvolutionUpdates - An array of objects representing form evolution updates. Each object should contain:
 *   @param {string} formEvolutionUpdates[].formName - The name of the form to be updated.
 *   @param {string} [formEvolutionUpdates[].evolvesFrom] - The name of the form it evolves from, if applicable.
 * @return {Promise<void>} A promise that resolves when the updates are completed.
 */
export async function updateEvolutionRelations(
  formEvolutionUpdates: { formName: string; evolvesFrom?: string }[],
): Promise<void> {
  for (const { formName, evolvesFrom } of formEvolutionUpdates) {
    if (evolvesFrom) {
      console.log(`Updating ${formName} evolves from ${evolvesFrom}...`);

      if (
        !(await prisma.form.findFirst({
          where: { formName: evolvesFrom },
        }))
      ) {
        console.warn(
          `Skipping ${formName} due to missing evolvesFrom ${evolvesFrom}`,
        );
        continue;
      }

      await prisma.form.update({
        where: { formName },
        data: {
          evolvesFromFormName: evolvesFrom,
        },
      });
    }
  }
}

/**
 * Reads a Pokémon data file and retrieves its details.
 *
 * @param {string} pokemonFile - The filename of the Pokémon whose data will be read.
 * @return {Promise<PokemonSpecies>} A promise that resolves to the Pokémon species data parsed from the file.
 */
async function getPokemonFromFile(
  pokemonFile: string,
): Promise<PokemonSpecies> {
  const filePath = path.join(DATA_PATH, `pokemon/${pokemonFile}`);
  const fileContents = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContents);
}

/**
 * Seeds the database with initial Pokémon data and updates evolution relations.
 *
 * This method reads Pokémon data from the filesystem, processes it in National Dex order,
 * and stores initial Pokémon information in the database. Once the initial data seeding
 * is completed, it updates the evolution relations for Pokémon entries.
 *
 * @return {Promise<void>} A promise that resolves when the database seeding and evolution updates are completed.
 */
export async function seedDatabase(): Promise<void> {
  const pokemonList = await fs.readdir(path.join(DATA_PATH, "pokemon"));

  // I can't even begin to fathom why this only works when you seed them in National Dex order
  const evolutionUpdates = await seedInitialPokemonData(
    pokemonList.sort((a, b) => {
      const [dexNumA] = a.split("-");
      const [dexNumB] = b.split("-");

      return parseInt(dexNumA) - parseInt(dexNumB);
    }),
  );

  // Phase 2: Update evolution relations once all forms exist.
  await updateEvolutionRelations(evolutionUpdates);
}
