export type PokemonType =
  | "Normal"
  | "Fire"
  | "Water"
  | "Electric"
  | "Grass"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Dark"
  | "Steel"
  | "Fairy";

export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

// Evolution Information
export interface PokemonEvolution {
  evolvesTo: string;
  trigger: "level-up" | "item" | "trade" | "happiness" | "move" | "location";
  level?: number;
  item?: string;
  condition?: string;
}

// Battle Mode (for Pokémon with temporary in-battle transformations)
export interface PokemonMode {
  modeName: string;
  sprite: string;
  isDefault: boolean;
  types: PokemonType[];
  baseStats: Stats;
  abilities: string[];
}

// Pokémon Form (for regional variants or other permanent changes)
export interface PokemonForm {
  formName: string;
  movePool: string[];
  evolvesInto: string[];
  evolvesFrom: string;
  modes: PokemonMode[];
}

// Pokémon Species (Top Level)
export interface PokemonSpecies {
  nationalDexNumber: number;
  name: string;
  forms: PokemonForm[];
}
