import { PokemonGame } from "@/lib/pokemon/games";
import { EncounterMethods } from "@/lib/pokemon/games/common";
import { GameLocation } from "@/lib/pokemon/types";

export const redAndBlueLocations: GameLocation[] = [
  {
    id: "starter",
    name: "Starter",
    order: 0,
    encounters: [
      {
        method: EncounterMethods.GIFT,
        pokemonForm: "bulbasaur",
      },
      {
        method: EncounterMethods.GIFT,
        pokemonForm: "charmander",
      },
      {
        method: EncounterMethods.GIFT,
        pokemonForm: "squirtle",
      },
    ],
  },
  {
    id: "pallet-town",
    name: "Pallet Town",
    order: 1,
    encounters: [
      {
        method: EncounterMethods.FISHING,
        pokemonForm: "magikarp",
      },
      {
        method: EncounterMethods.FISHING,
        pokemonForm: "goldeen",
      },
      {
        method: EncounterMethods.FISHING,
        pokemonForm: "poliwag",
      },
      {
        method: EncounterMethods.FISHING,
        pokemonForm: "tentacool",
      },
    ],
  },
  {
    id: "route-1",
    name: "Route 1",
    order: 2,
    encounters: [
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "pidgey",
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "rattata",
      },
    ],
  },
  {
    id: "viridian-city",
    name: "Viridian City",
    order: 3,
    encounters: [
      {
        method: EncounterMethods.FISHING,
        pokemonForm: "magikarp",
      },
      {
        method: EncounterMethods.FISHING,
        pokemonForm: "goldeen",
      },
      {
        method: EncounterMethods.FISHING,
        pokemonForm: "poliwag",
      },
      {
        method: EncounterMethods.FISHING,
        pokemonForm: "tentacool",
      },
    ],
  },
  {
    id: "route-22",
    name: "Route 22",
    order: 4,
    encounters: [
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "rattata",
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "nidoran-f",
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "nidoran-m",
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "spearow",
      },
      {
        method: EncounterMethods.FISHING,
        pokemonForm: "magikarp",
      },
      {
        method: EncounterMethods.FISHING,
        pokemonForm: "goldeen",
      },
      {
        method: EncounterMethods.FISHING,
        pokemonForm: "poliwag",
      },
    ],
  },
  {
    id: "route-2",
    name: "Route 2",
    order: 5,
    encounters: [
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "pidgey",
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "rattata",
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "caterpie",
        versionExclusive: PokemonGame.BLUE,
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "weedle",
        versionExclusive: PokemonGame.RED,
      },
      {
        method: EncounterMethods.TRADE,
        pokemonForm: "mr-mime",
      },
    ],
  },
  {
    id: "route-3",
    name: "Route 3",
    order: 6,
    encounters: [
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "pidgey",
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "spearow",
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "jigglypuff",
      },
    ],
  },
  {
    id: "mt-moon",
    name: "Mt. Moon",
    order: 7,
    encounters: [
      {
        method: EncounterMethods.CAVE,
        pokemonForm: "zubat",
      },
      {
        method: EncounterMethods.CAVE,
        pokemonForm: "geodude",
      },
      {
        method: EncounterMethods.CAVE,
        pokemonForm: "clefairy",
      },
      {
        method: EncounterMethods.CAVE,
        pokemonForm: "paras",
      },
    ],
  },
  {
    id: "route-4",
    name: "Route 4",
    order: 8,
    encounters: [
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "rattata",
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "spearow",
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "ekans",
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "ekans",
        versionExclusive: PokemonGame.RED,
      },
      {
        method: EncounterMethods.TALL_GRASS,
        pokemonForm: "sandshrew",
        versionExclusive: PokemonGame.BLUE,
      },
      {
        method: EncounterMethods.GIFT,
        pokemonForm: "magikarp",
      },
    ],
  },
];
