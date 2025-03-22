import fs from "fs/promises";
import path from "path";

import { LocationTransformer, PokemonGame } from "@/lib/pokeapi/types";
import {
  GameLocation,
  getEncounterLocationsForGame,
  getEncountersAsObject,
  LOCATION_OUTPUT_PATH,
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
export async function buildGameData<T extends string>(
  game: Pick<PokemonGame<T>, "id" | "name">,
  locationOrder: readonly T[],
  gameLocations: Map<string, GameLocation>,
  transformer: (
    gameLocations: Map<string, GameLocation>,
  ) => LocationTransformer<T>,
): Promise<PokemonGame<T>> {
  const gameData: PokemonGame<T> = {
    ...game,
    locations: [],
  };

  const locationHandlers = transformer(gameLocations);

  locationOrder.forEach((location) => {
    if (location in locationHandlers) {
      const locationHandler = locationHandlers[location];

      if (locationHandler) {
        gameData.locations.push(locationHandler());
      }
    } else {
      const locationData = gameLocations.get(location);
      if (!locationData) {
        throw new Error(`Unable to find location: ${location}`);
      }

      gameData.locations.push({
        id: location,
        name: locationData.name,
        encounters: getEncountersAsObject(locationData.encounters),
      });
    }
  });

  return gameData;
}

/**
 * Writes a JSON file for a specific Pokémon game with its processed location data.
 *
 * @param {Pick<PokemonGame<T>, "id" | "name">} game - An object containing the game's `id` and `name`.
 * @param {readonly T[]} locationOrder - An ordered list of location identifiers used to structure the game locations.
 * @param {(gameLocations: Map<string, GameLocation>) => LocationTransformer<T>} transformer - A function that transforms the game locations into a specific format.
 */
export async function writeJSONFile<T extends string>(
  game: Pick<PokemonGame<T>, "id" | "name">,
  locationOrder: readonly T[],
  transformer: (
    gameLocations: Map<string, GameLocation>,
  ) => LocationTransformer<T>,
) {
  const gameLocations = await getEncounterLocationsForGame(game.id);

  const gameData = await buildGameData(
    game,
    locationOrder,
    gameLocations,
    transformer,
  );

  await fs.mkdir(LOCATION_OUTPUT_PATH, {
    recursive: true,
  });

  await fs.writeFile(
    path.join(LOCATION_OUTPUT_PATH, `${game.id}.json`),
    JSON.stringify(gameData, null, 2),
  );
}
