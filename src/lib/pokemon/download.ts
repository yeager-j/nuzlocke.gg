import fs from "fs/promises";
import path from "path";
import Pokedex from "pokedex-promise-v2";

import { pokemonConversion } from "@lib/pokemon/conversion";
import { DATA_PATH, rest } from "@lib/pokemon/utils";

/**
 * Downloads Pokémon data from PokeAPI, processes them, and saves each Pokémon's data as a JSON file.
 * Each file is stored in the specified directory and named using the Pokémon's name.
 *
 * The method fetches a list of Pokémon, retrieves detailed data for each, and writes the data to a file.
 * Introduces a delay between API requests to prevent overwhelming the API server.
 *
 * This function is generally only ran once so we have an offline copy of PokeAPI's data. We will only ever need to
 * re-run this if we change the structure of the data. We use the downloaded data to seed our sqlite database on
 * app deployment.
 *
 * @return {Promise<void>} A promise that resolves when all Pokémon data has been successfully downloaded and saved.
 */
async function download(): Promise<void> {
  const P = new Pokedex();

  const pokemonNames = await P.getPokemonsList({ limit: 151 }).then((res) =>
    res.results.map((p) => p.name),
  );

  for (const pokemonName of pokemonNames) {
    console.log(`Downloading ${pokemonName}...`);
    const pokemon = await pokemonConversion(P, pokemonName);
    await fs.writeFile(
      path.join(
        DATA_PATH,
        `pokemon/${pokemon.nationalDexNumber}-${pokemon.name}.json`,
      ),
      JSON.stringify(pokemon, null, 4),
    );

    // Let's give PokeAPI a break
    await rest(1000);
  }

  console.log("Done!");
}

download();
