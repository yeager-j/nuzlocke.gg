import at from "lodash-es/at";
import {
  Location,
  LocationArea,
  Region,
  Version,
  VersionGroup,
} from "pokedex-promise-v2";
import { vi } from "vitest";

import { pokeapi } from "@/lib/pokeapi/api";

interface MockPokeAPIData {
  mockVersion: Version;
  mockVersionGroup: VersionGroup;
  mockRegion: Region;
  mockLocations: {
    [key: string]: Location;
  };
  mockAreas: {
    [key: string]: LocationArea;
  };
}

export async function getMockedPokeAPIData(): Promise<MockPokeAPIData> {
  const mockVersion = await import("./__fixtures__/pokeapi/versions/red.json");
  const mockVersionGroup = await import(
    "./__fixtures__/pokeapi/version-groups/red-blue.json"
  );
  const mockRegion = await import("./__fixtures__/pokeapi/regions/kanto.json");
  const mockLocations = {
    "pallet-town": await import(
      "./__fixtures__/pokeapi/locations/pallet-town.json"
    ),
    "viridian-city": await import(
      "./__fixtures__/pokeapi/locations/viridian-city.json"
    ),
    "viridian-forest": await import(
      "./__fixtures__/pokeapi/locations/viridian-forest.json"
    ),
    "kanto-route-1": await import(
      "./__fixtures__/pokeapi/locations/kanto-route-1.json"
    ),
  };
  const mockAreas = {
    "pallet-town-area": await import(
      "./__fixtures__/pokeapi/areas/pallet-town-area.json"
    ),
    "viridian-city-area": await import(
      "./__fixtures__/pokeapi/areas/viridian-city-area.json"
    ),
    "viridian-forest-area": await import(
      "./__fixtures__/pokeapi/areas/viridian-forest-area.json"
    ),
    "kanto-route-1-area": await import(
      "./__fixtures__/pokeapi/areas/kanto-route-1-area.json"
    ),
  };

  return {
    mockVersion,
    mockVersionGroup,
    mockRegion,
    mockLocations,
    mockAreas,
  };
}

function resolveItemOrArray<T>(
  obj: { [key: string]: T },
  keys: string | number | (string | number)[],
): Promise<T | T[]> {
  if (Array.isArray(keys)) {
    return Promise.resolve(at(obj, keys));
  }

  const item = obj[keys];

  if (!item) {
    return Promise.reject(`Invalid key (${keys}) from object!`);
  }

  return Promise.resolve(item);
}

export async function setupMockedPokeAPI() {
  const mocks = await getMockedPokeAPIData();

  // Mock API responses
  vi.mocked(pokeapi.getVersionByName).mockResolvedValue(mocks.mockVersion);
  vi.mocked(pokeapi.getVersionGroupByName).mockResolvedValue(
    mocks.mockVersionGroup,
  );
  vi.mocked(pokeapi.getRegionByName).mockResolvedValue([mocks.mockRegion]);

  // Mock locations
  vi.mocked(pokeapi.getLocationByName).mockImplementation((name) => {
    return resolveItemOrArray(mocks.mockLocations, name);
  });

  // Mock location areas
  vi.mocked(pokeapi.getLocationAreaByName).mockImplementation((name) => {
    return resolveItemOrArray(mocks.mockAreas, name);
  });
}
