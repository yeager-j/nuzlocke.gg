/**
 * Represents a location within a game where an encounter can take place. `encounters` uses a Map and Set here to avoid
 * duplicate entries.
 *
 * This type is used to construct the location map of a game. It will be transformed into a JSON-compatible format (`PokemonGameLocation`).
 */
export type GameLocation = {
  name: string;
  encounters: Map<string, Set<string>>;
};

/**
 * The top-level structure that describes a Pokémon Game used in outputting JSON.
 */
export interface PokemonGame<T extends string> {
  id: string;
  name: string;
  locations: PokemonGameLocation<T>[];
}

/**
 * Represents a location within a game where an encounter can take place. Here, `encounters` is an object instead of a Map
 * so that it is compatible with JSON. This type is used in outputting a game's encounter JSON file.
 */
export interface PokemonGameLocation<T extends string> {
  id: T;
  name: string;
  encounters: {
    [method: string]: string[];
  };
}

/**
 * This type describes a map of locations to transformer functions. This type allows locations to have their data overriden
 * to handle edge-cases, such as Starters.
 */
export type LocationTransformer<T extends string> = Partial<
  Record<T, () => PokemonGameLocation<T>>
>;
