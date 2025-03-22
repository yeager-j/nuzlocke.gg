import { vi } from "vitest";

import { pokeapi } from "@/lib/pokeapi/api";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type PromiseReturnType<T extends (...args: unknown[]) => unknown> =
  UnwrapPromise<ReturnType<T>>;

export async function getMockedPokeapiData() {
  const mockVersion = await import("./__fixtures__/pokeapi/versions/red.json");
  const mockVersionGroup = await import(
    "./__fixtures__/pokeapi/version-groups/red-blue.json"
  );
  const mockKantoRegion = await import(
    "./__fixtures__/pokeapi/regions/kanto.json"
  );
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
    mockKantoRegion,
    mockLocations,
    mockAreas,
  };
}

export function setupMockedPokeapi(
  mocks: PromiseReturnType<typeof getMockedPokeapiData>,
) {
  // Mock API responses
  vi.mocked(pokeapi.getVersionByName).mockResolvedValue(mocks.mockVersion);
  vi.mocked(pokeapi.getVersionGroupByName).mockResolvedValue(
    mocks.mockVersionGroup,
  );
  vi.mocked(pokeapi.getRegionByName).mockResolvedValue([mocks.mockKantoRegion]);

  // Mock locations
  vi.mocked(pokeapi.getLocationByName).mockImplementation((name) => {
    const locationName = (
      Array.isArray(name) ? name[0] : name
    ) as keyof typeof mocks.mockLocations;
    return Promise.resolve(mocks.mockLocations[locationName]);
  });

  // Mock location areas
  vi.mocked(pokeapi.getLocationAreaByName).mockImplementation((name) => {
    const areaName = (
      Array.isArray(name) ? name[0] : name
    ) as keyof typeof mocks.mockAreas;
    return Promise.resolve(mocks.mockAreas[areaName]);
  });
}
