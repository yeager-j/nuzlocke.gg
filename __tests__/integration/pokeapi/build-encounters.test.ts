import path from "path";
import { vol } from "memfs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setupMockedPokeAPI } from "../../pokeapi-test-utils";

import { writeEncounterJSONFile } from "@/lib/pokeapi/build-encounters";
import { LocationTransformer, PokemonGame } from "@/lib/pokeapi/types";
import { getJSONOutputPath } from "@/lib/pokeapi/utils";

vi.mock("@/lib/pokeapi/api", () => {
  return {
    pokeapi: {
      getVersionByName: vi.fn(),
      getVersionGroupByName: vi.fn(),
      getRegionByName: vi.fn(),
      getLocationByName: vi.fn(),
      getLocationAreaByName: vi.fn(),
    },
  };
});

vi.mock("fs/promises");

describe("writeJSONFile", async () => {
  beforeEach(async () => {
    vol.reset();

    await setupMockedPokeAPI();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should write a JSON file with the correct game data", async () => {
    const locationOrder = [
      "pallet-town",
      "kanto-route-1",
      "viridian-city",
      "viridian-forest",
    ] as const;

    type TestLocation = (typeof locationOrder)[number];

    const game: Pick<PokemonGame<TestLocation>, "id" | "name"> = {
      id: "red",
      name: "Pokémon Red",
    };

    const transformer = (): LocationTransformer<TestLocation> => {
      return {};
    };

    await writeEncounterJSONFile(game, locationOrder, transformer);

    const gameData = vol.readFileSync(
      path.join(getJSONOutputPath("red"), "encounters.json"),
      "utf-8",
    );

    expect(gameData.toString()).toMatchSnapshot();
  });

  it("should apply custom location transformers when provided", async () => {
    const locationOrder = [
      "pallet-town",
      "kanto-route-1",
      "viridian-city",
      "viridian-forest",
    ] as const;

    type TestLocation = (typeof locationOrder)[number];

    const game: Pick<PokemonGame<TestLocation>, "id" | "name"> = {
      id: "red",
      name: "Pokémon Red",
    };

    const transformer = (): LocationTransformer<TestLocation> => {
      return {
        "viridian-forest": () => ({
          id: "viridian-forest",
          name: "Viridian Forest",
          encounters: {
            walk: ["pikachu", "caterpie", "weedle", "kakuna", "metapod"],
            special: ["bulbasaur"],
          },
        }),
      };
    };

    await writeEncounterJSONFile(game, locationOrder, transformer);

    const gameData = vol.readFileSync(
      path.join(getJSONOutputPath("red"), "encounters.json"),
      "utf-8",
    );

    expect(gameData.toString()).toMatchSnapshot();
  });
});
