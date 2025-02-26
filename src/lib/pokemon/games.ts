import { redAndBlueLocations } from "@/lib/pokemon/games/generation-i/locations";
import { generation1Pokedex } from "@/lib/pokemon/games/generation-i/pokedex";
import { PokemonGameData } from "@/lib/pokemon/types";

export enum PokemonGame {
  RED = "red",
  BLUE = "blue",
}

export const PokemonGames: Record<PokemonGame, PokemonGameData> = {
  [PokemonGame.RED]: {
    name: "Pokémon Red",
    pokedex: generation1Pokedex,
    locations: redAndBlueLocations,
  },
  [PokemonGame.BLUE]: {
    name: "Pokémon Blue",
    pokedex: generation1Pokedex,
    locations: redAndBlueLocations,
  },
};
