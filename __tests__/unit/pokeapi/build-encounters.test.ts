import { beforeEach, describe, expect, it } from "vitest";

import { buildEncounterGameData } from "@/lib/pokeapi/build-encounters";
import {
  GameLocation,
  LocationTransformer,
  PokemonGame,
} from "@/lib/pokeapi/types";

describe("buildGameData", () => {
  type TestLocation = "viridian-forest" | "mt-moon" | "cerulean-city";

  let gameLocations: Map<string, GameLocation>;

  beforeEach(() => {
    gameLocations = new Map<string, GameLocation>();

    gameLocations.set("viridian-forest", {
      name: "Viridian Forest",
      encounters: new Map([
        ["walk", new Set(["pikachu", "caterpie", "weedle"])],
      ]),
    });

    gameLocations.set("mt-moon", {
      name: "Mt. Moon",
      encounters: new Map([
        ["walk", new Set(["zubat", "geodude", "clefairy"])],
        ["rock-smash", new Set(["geodude"])],
      ]),
    });

    gameLocations.set("cerulean-city", {
      name: "Cerulean City",
      encounters: new Map([["fishing", new Set(["magikarp", "poliwag"])]]),
    });
  });

  it("should build game data with standard locations", async () => {
    const game: Pick<PokemonGame<TestLocation>, "id" | "name"> = {
      id: "red",
      name: "Pokémon Red",
    };

    const locationOrder: TestLocation[] = [
      "viridian-forest",
      "mt-moon",
      "cerulean-city",
    ];

    const transformer = (): LocationTransformer<TestLocation> => {
      return {};
    };

    const result = await buildEncounterGameData(
      game,
      locationOrder,
      gameLocations,
      transformer,
    );

    expect(result).toEqual({
      id: "red",
      name: "Pokémon Red",
      locations: [
        {
          id: "viridian-forest",
          name: "Viridian Forest",
          encounters: { walk: ["pikachu", "caterpie", "weedle"] },
        },
        {
          id: "mt-moon",
          name: "Mt. Moon",
          encounters: {
            walk: ["zubat", "geodude", "clefairy"],
            "rock-smash": ["geodude"],
          },
        },
        {
          id: "cerulean-city",
          name: "Cerulean City",
          encounters: { fishing: ["magikarp", "poliwag"] },
        },
      ],
    });
  });

  it("should use custom location transformers when provided", async () => {
    const game: Pick<PokemonGame<TestLocation>, "id" | "name"> = {
      id: "red",
      name: "Pokémon Red",
    };

    const locationOrder: TestLocation[] = [
      "viridian-forest",
      "mt-moon",
      "cerulean-city",
    ];

    const transformer = (): LocationTransformer<TestLocation> => {
      return {
        "mt-moon": () => ({
          id: "mt-moon",
          name: "Mt. Moon Cave System",
          encounters: {
            walk: ["zubat", "geodude", "clefairy", "paras"],
            "rock-smash": ["geodude", "onix"],
          },
        }),
      };
    };

    const result = await buildEncounterGameData(
      game,
      locationOrder,
      gameLocations,
      transformer,
    );

    expect(result.locations[1]).toEqual({
      id: "mt-moon",
      name: "Mt. Moon Cave System",
      encounters: {
        walk: ["zubat", "geodude", "clefairy", "paras"],
        "rock-smash": ["geodude", "onix"],
      },
    });
  });

  it("should handle a mix of standard and custom location transformers", async () => {
    const game: Pick<PokemonGame<TestLocation>, "id" | "name"> = {
      id: "red",
      name: "Pokémon Red",
    };

    const locationOrder: TestLocation[] = [
      "viridian-forest",
      "mt-moon",
      "cerulean-city",
    ];

    const transformer = (): LocationTransformer<TestLocation> => {
      return {
        "cerulean-city": () => ({
          id: "cerulean-city",
          name: "Cerulean City",
          encounters: {
            fishing: ["magikarp", "poliwag", "goldeen"],
            surf: ["psyduck", "slowpoke"],
          },
        }),
      };
    };

    const result = await buildEncounterGameData(
      game,
      locationOrder,
      gameLocations,
      transformer,
    );

    expect(result.locations[0].id).toEqual("viridian-forest"); // Standard
    expect(result.locations[1].id).toEqual("mt-moon"); // Standard
    expect(result.locations[2].id).toEqual("cerulean-city"); // Custom
    expect(result.locations[2].encounters).toEqual({
      fishing: ["magikarp", "poliwag", "goldeen"],
      surf: ["psyduck", "slowpoke"],
    });
  });

  it("should throw an error when a location is not found", async () => {
    const game: Pick<PokemonGame<TestLocation>, "id" | "name"> = {
      id: "red",
      name: "Pokémon Red",
    };

    const locationOrder = [
      "viridian-forest",
      "mt-moon",
      "lavender-town",
    ] as TestLocation[];

    const transformer = (): LocationTransformer<TestLocation> => {
      return {};
    };

    await expect(async () => {
      await buildEncounterGameData(
        game,
        locationOrder,
        gameLocations,
        transformer,
      );
    }).rejects.toThrow("Unable to find location: lavender-town");
  });
});
