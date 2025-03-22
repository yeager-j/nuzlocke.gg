import path from "path";
import { vol } from "memfs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getMockedPokeapiData,
  setupMockedPokeapi,
} from "../../pokeapi-test-utils";

import { writeJSONFile } from "@/lib/pokeapi/build-game";
import { LocationTransformer, PokemonGame } from "@/lib/pokeapi/types";
import { LOCATION_OUTPUT_PATH } from "@/lib/pokeapi/utils";

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
  const {
    mockVersion,
    mockLocations,
    mockVersionGroup,
    mockKantoRegion,
    mockAreas,
  } = await getMockedPokeapiData();

  beforeEach(() => {
    vol.reset();

    setupMockedPokeapi({
      mockVersion,
      mockLocations,
      mockVersionGroup,
      mockKantoRegion,
      mockAreas,
    });
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

    await writeJSONFile(game, locationOrder, transformer);

    const gameData = vol.readFileSync(
      path.join(LOCATION_OUTPUT_PATH, "red.json"),
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

    await writeJSONFile(game, locationOrder, transformer);

    const gameData = vol.readFileSync(
      path.join(LOCATION_OUTPUT_PATH, "red.json"),
      "utf-8",
    );

    expect(gameData.toString()).toMatchSnapshot();
  });
});
