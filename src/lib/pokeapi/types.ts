export type GameLocation = {
  name: string;
  encounters: Map<string, Set<string>>;
};

export interface PokemonGame<T extends string> {
  id: string;
  name: string;
  locations: PokemonLocation<T>[];
}

export interface PokemonLocation<T extends string> {
  id: T;
  name: string;
  encounters: {
    [method: string]: string[];
  };
}

export type LocationTransformer<T extends string> = Partial<
  Record<T, () => PokemonLocation<T>>
>;
