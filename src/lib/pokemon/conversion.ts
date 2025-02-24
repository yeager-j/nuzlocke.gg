import Pokedex, { EvolutionChain, Pokemon } from "pokedex-promise-v2";

import {
  PokemonForm,
  PokemonMode,
  PokemonSpecies,
  PokemonType,
} from "@lib/pokemon/types";
import {
  convertCringeStatsToBasedStats,
  isLikelyMode,
  isModeOf,
} from "@lib/pokemon/utils";

/**
 * Retrieves the immediate evolution targets for a specific species from an evolution chain.
 *
 * @param {EvolutionChain} evolutionChain - The evolution chain object that contains the hierarchical structure of evolutions.
 * @param {string} targetSpecies - The name of the species for which to find the evolution targets.
 * @return {string[]} An array of species names that are the direct evolutions of the specified species. Returns an empty array if no matches are found.
 */
function getEvolutionTargets(
  evolutionChain: EvolutionChain,
  targetSpecies: string,
): string[] {
  // Helper recursive function to search the chain.
  function search(node: EvolutionChain["chain"]): string[] {
    // Compare species names case-insensitively.
    if (node.species.name.toLowerCase() === targetSpecies.toLowerCase()) {
      // Return the names of species in the evolves_to array.
      return node.evolves_to.map((child) => child.species.name);
    }
    // Otherwise, search each branch recursively.
    for (let child of node.evolves_to) {
      const result = search(child);
      if (result.length > 0) {
        return result;
      }
    }
    return [];
  }

  // Start the search at the root of the chain.
  return search(evolutionChain.chain);
}

/**
 * Converts a Pokémon species into a detailed structure containing its forms, evolutionary stages, and other metadata.
 *
 * @param {Pokedex} P - An instance of a Pokedex client used to fetch Pokémon data.
 * @param {string} speciesName - The name of the Pokémon species to convert.
 * @return {Promise<PokemonSpecies>} A promise resolving to a detailed representation of the Pokémon species, including forms, evolution details, and associated data.
 */
export async function pokemonConversion(
  P: Pokedex,
  speciesName: string,
): Promise<PokemonSpecies> {
  // 1) Fetch the species data and evolution chain (once).
  const pokemonSpecies = await P.getPokemonSpeciesByName(speciesName);
  const evolutionChain: EvolutionChain = await P.getResource(
    pokemonSpecies.evolution_chain.url,
  );

  // 2) Extract core info (English name, National Dex #).
  const name =
    pokemonSpecies.names.find((n) => n.language.name === "en")?.name ||
    speciesName;
  const nationalDexNumber =
    pokemonSpecies.pokedex_numbers.find((n) => n.pokedex.name === "national")
      ?.entry_number || 0;

  // 3) Fetch each variety's data. Then split them into "base forms" vs. "modes".
  const allVarieties: Pokemon[] = [];
  for (const v of pokemonSpecies.varieties) {
    allVarieties.push(await P.getPokemonByName(v.pokemon.name));
  }

  const baseFormVarieties: Pokemon[] = [];
  const modeVarieties: Pokemon[] = [];

  allVarieties.forEach((variety) => {
    // If it doesn't have a front default sprite, it's probably unobtainable in reality
    if (!variety.sprites.front_default) {
      console.warn(`Skipping ${variety.name} due to lack of sprite...`);
      return;
    }

    if (isLikelyMode(variety.name)) {
      modeVarieties.push(variety);
    } else {
      baseFormVarieties.push(variety);
    }
  });

  // 4) Build up the final "forms" array.
  //    For each base form, we'll create a new PokemonForm with:
  //    - The base "mode" itself
  //    - Any additional modes that match via isModeOf()
  const evolvesInto = getEvolutionTargets(evolutionChain, name);
  const evolvesFrom = pokemonSpecies.evolves_from_species?.name ?? "";

  const forms: PokemonForm[] = baseFormVarieties.map((baseVariety) => {
    // Base mode
    const baseMode: PokemonMode = {
      modeName: baseVariety.name,
      isDefault: baseVariety.is_default,
      sprite: baseVariety.sprites.front_default!,
      types: baseVariety.types.map((t) => t.type.name) as PokemonType[],
      baseStats: convertCringeStatsToBasedStats(baseVariety.stats),
      abilities: baseVariety.abilities.map((a) => a.ability.name),
    };

    // Additional modes
    const relatedModes: PokemonMode[] = modeVarieties
      .filter((mode) => isModeOf(baseVariety.name, mode.name))
      .map((mode) => ({
        modeName: mode.name,
        isDefault: mode.is_default,
        sprite: mode.sprites.front_default!,
        types: mode.types.map((t) => t.type.name) as PokemonType[],
        baseStats: convertCringeStatsToBasedStats(mode.stats),
        abilities: mode.abilities.map((a) => a.ability.name),
      }));

    // Combine base mode + extra modes
    const modes = [baseMode, ...relatedModes];

    return {
      formName: baseVariety.name,
      movePool: baseVariety.moves.map((m) => m.move.name),
      evolvesInto,
      evolvesFrom,
      modes,
    };
  });

  // 5) If there's only one base form and no modes, that's still fine—it's the same structure.
  return {
    name,
    nationalDexNumber,
    forms,
  };
}
