import fs from "fs/promises";
import path from "path";

import {
  GameLocation,
  LocationTransformer,
  PokemonGame,
  PokemonGameLocation,
} from "@/lib/pokeapi/types";
import {
  applyLocationTransformation,
  getEncounterLocationsForGame,
  getEncountersAsObject,
  getJSONOutputPath,
} from "@/lib/pokeapi/utils";

/**
 * Assembles game data for a Pokémon game by processing location data and applying a custom transformer function.
 *
 * @param game An object containing the id and name of the Pokémon game.
 * @param locationOrder An array of location identifiers specifying the order of locations.
 * @param gameLocations A map of location ids to their corresponding GameLocation objects.
 * @param transformer A function that accepts the gameLocations map and returns a LocationTransformer specific to the game.
 * @return A Promise that resolves to a complete Pokémon game object, including all processed locations.
 */
export async function buildEncounterGameData<T extends string>(
  game: Pick<PokemonGame<T>, "id" | "name">,
  locationOrder: readonly T[],
  gameLocations: Map<string, GameLocation>,
  transformer: (
    gameLocations: Map<string, GameLocation>,
  ) => LocationTransformer<T>,
): Promise<PokemonGame<T>> {
  const locationHandlers = transformer(gameLocations);

  return {
    ...game,
    locations: locationOrder.reduce((acc, prev) => {
      if (prev in locationHandlers) {
        const transformedLocation = applyLocationTransformation(
          prev,
          locationHandlers,
        );

        return [...acc, transformedLocation];
      }

      const locationData = gameLocations.get(prev);

      if (!locationData) {
        throw new Error(`Unable to find location: ${prev}`);
      }

      const pokemonLocation = {
        id: prev,
        name: locationData.name,
        encounters: getEncountersAsObject(locationData.encounters),
      };

      return [...acc, pokemonLocation];
    }, [] as PokemonGameLocation<T>[]),
  };
}

/**
 * Writes a JSON file for a specific Pokémon game with its processed location data.
 *
 * @param {Pick<PokemonGame<T>, "id" | "name">} game - An object containing the game's `id` and `name`.
 * @param {readonly T[]} locationOrder - An ordered list of location identifiers used to structure the game locations.
 * @param {(gameLocations: Map<string, GameLocation>) => LocationTransformer<T>} transformer - A function that transforms the game locations into a specific format.
 */
export async function writeEncounterJSONFile<T extends string>(
  game: Pick<PokemonGame<T>, "id" | "name">,
  locationOrder: readonly T[],
  transformer: (
    gameLocations: Map<string, GameLocation>,
  ) => LocationTransformer<T>,
) {
  const gameLocations = await getEncounterLocationsForGame(game.id);

  const gameData = await buildEncounterGameData(
    game,
    locationOrder,
    gameLocations,
    transformer,
  );

  await fs.mkdir(getJSONOutputPath(game.id), {
    recursive: true,
  });

  await fs.writeFile(
    path.join(getJSONOutputPath(game.id), `encounters.json`),
    JSON.stringify(gameData, null, 2),
  );
}
