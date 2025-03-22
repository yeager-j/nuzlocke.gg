import path from "path";
import { Name } from "pokedex-promise-v2";

import { pokeapi } from "@/lib/pokeapi/api";

export type GameLocation = {
  name: string;
  encounters: Map<string, Set<string>>;
};

export const LOCATION_OUTPUT_PATH = path.join(process.cwd(), "public/games");

/**
 * Converts the encounters map of a game location into a plain object.
 *
 * @param {Map} encounters - A Map where keys are encounter types and values are Sets of encounter details.
 * @return {Object} A plain object where keys match the encounter types and values are arrays of encounter details.
 */
export function getEncountersAsObject(encounters: GameLocation["encounters"]): {
  [K: string]: string[];
} {
  return Object.fromEntries(
    Array.from(encounters.entries()).map(([key, valueSet]) => [
      key,
      Array.from(valueSet),
    ]),
  );
}

/**
 * Retrieves the English name from an array of name objects.
 *
 * @param {Name[]} names - An array of name objects, each containing a language property and a name property.
 * @return {string} The English name found in the input array.
 * @throws {Error} If no English name is found in the input array.
 */
export function getEnglishName(names: Name[]): string {
  const engName = names.find((n) => n.language.name === "en");

  if (!engName) {
    throw new Error("No english name found");
  }

  return engName.name;
}

/**
 * Retrieves encounter locations and details for a specified game.
 *
 * @param {string} game - The name of the game for which to retrieve encounter locations, e.g. "red", "platinum", "ultra-sun".
 * @return {Promise<Map<string, GameLocation>>} A Promise that resolves to a map of location names
 * to detailed encounter locations, including encounter methods and Pokémon details.
 */
export async function getEncounterLocationsForGame(
  game: string,
): Promise<Map<string, GameLocation>> {
  const version = await pokeapi.getVersionByName(game);

  const versionGroup = await pokeapi.getVersionGroupByName(
    version.version_group.name,
  );

  const regions = await pokeapi.getRegionByName(
    versionGroup.regions.map((r) => r.name),
  );

  const locations = await Promise.all(
    regions
      .flatMap((r) => r.locations)
      .map((l) => pokeapi.getLocationByName(l.name)),
  );

  const gameLocations = new Map(
    locations.map((location) => [
      location.name,
      {
        name: getEnglishName(location.names),
        encounters: new Map(),
      },
    ]),
  );

  const locationAreas = await Promise.all(
    locations
      .flatMap((l) => l.areas)
      .map((a) => pokeapi.getLocationAreaByName(a.name)),
  );

  locationAreas.forEach((area) => {
    const location = gameLocations.get(area.location.name);
    if (!location) return;

    area.pokemon_encounters
      .flatMap((encounter) => {
        const gameVersion = encounter.version_details.find(
          (v) => v.version.name === game,
        );
        if (!gameVersion) return [];

        const pokemonName = encounter.pokemon.name;

        return gameVersion.encounter_details.map((detail) => ({
          method: detail.method.name,
          pokemon: pokemonName,
        }));
      })
      .forEach(({ method, pokemon }) => {
        const pokemonSet = location.encounters.get(method) || new Set();
        pokemonSet.add(pokemon);
        location.encounters.set(method, pokemonSet);
      });
  });

  return gameLocations;
}
