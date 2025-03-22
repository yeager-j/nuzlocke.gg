import { Name } from "pokedex-promise-v2";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getMockedPokeapiData,
  setupMockedPokeapi,
} from "../../pokeapi-test-utils";

import {
  getEncounterLocationsForGame,
  getEncountersAsObject,
  getEnglishName,
} from "@/lib/pokeapi/utils";

describe("getEncountersAsObject", () => {
  it("should convert a Map of Sets to an object with arrays", () => {
    const encounters = new Map<string, Set<string>>();
    encounters.set("grass", new Set(["pikachu", "bulbasaur"]));
    encounters.set("water", new Set(["magikarp", "squirtle"]));

    const result = getEncountersAsObject(encounters);

    expect(result).toEqual({
      grass: ["pikachu", "bulbasaur"],
      water: ["magikarp", "squirtle"],
    });
  });

  it("should handle empty maps", () => {
    const encounters = new Map<string, Set<string>>();

    const result = getEncountersAsObject(encounters);

    expect(result).toEqual({});
  });

  it("should handle empty sets", () => {
    const encounters = new Map<string, Set<string>>();
    encounters.set("grass", new Set());

    const result = getEncountersAsObject(encounters);

    expect(result).toEqual({ grass: [] });
  });
});

describe("getEnglishName", () => {
  it("should return the English name from an array of names", () => {
    const names: Name[] = [
      { name: "Kanto", language: { name: "ja", url: "" } },
      { name: "Kanto Region", language: { name: "en", url: "" } },
      { name: "Kanto", language: { name: "fr", url: "" } },
    ];

    const result = getEnglishName(names);

    expect(result).toBe("Kanto Region");
  });

  it("should throw an error if no English name is found", () => {
    const names: Name[] = [
      { name: "Kanto", language: { name: "ja", url: "" } },
      { name: "Kanto", language: { name: "fr", url: "" } },
    ];

    expect(() => getEnglishName(names)).toThrow("No english name found");
  });

  it("should handle an empty array", () => {
    const names: Name[] = [];

    expect(() => getEnglishName(names)).toThrow("No english name found");
  });
});

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

describe("getEncounterLocationsForGame", async () => {
  const {
    mockVersion,
    mockLocations,
    mockVersionGroup,
    mockKantoRegion,
    mockAreas,
  } = await getMockedPokeapiData();

  beforeEach(() => {
    vi.resetAllMocks();

    setupMockedPokeapi({
      mockVersion,
      mockLocations,
      mockVersionGroup,
      mockKantoRegion,
      mockAreas,
    });
  });

  it("should return a map of game locations with their encounters", async () => {
    const result = await getEncounterLocationsForGame("red");

    expect(result.size).toBe(4);
    expect(result.has("viridian-forest")).toBe(true);
    expect(result.has("kanto-route-1")).toBe(true);

    const viridianForest = result.get("viridian-forest");
    expect(viridianForest?.name).toBe("Viridian Forest");
    expect(viridianForest?.encounters.get("walk")?.has("pikachu")).toBe(true);
    expect(viridianForest?.encounters.get("walk")?.has("caterpie")).toBe(true);

    const mtMoon = result.get("kanto-route-1");
    expect(mtMoon?.name).toBe("Route 1");
    expect(mtMoon?.encounters.get("walk")?.has("pidgey")).toBe(true);
    expect(mtMoon?.encounters.get("walk")?.has("rattata")).toBe(true);
  });

  it("should handle multiple encounter methods for the same pokemon", async () => {
    const result = await getEncounterLocationsForGame("red");

    expect(result.size).toBe(4);

    const safariZone = result.get("pallet-town");
    expect(safariZone?.encounters.get("super-rod")?.has("poliwag")).toBe(true);
    expect(safariZone?.encounters.get("good-rod")?.has("poliwag")).toBe(true);
  });
});
