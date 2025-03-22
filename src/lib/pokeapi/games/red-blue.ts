import { GameLocation, LocationTransformer } from "@/lib/pokeapi/types";
import { getEncountersAsObject } from "@/lib/pokeapi/utils";

export const redBlueLocationOrder = [
  "starter",
  "pallet-town",
  "kanto-route-1",
  "viridian-city",
  "kanto-route-22",
  "kanto-route-2",
  "viridian-forest",
  "kanto-route-3",
  "kanto-route-4",
  "mt-moon",
  "cerulean-city",
  "kanto-route-24",
  "kanto-route-25",
  "kanto-route-5",
  "kanto-route-6",
  "vermilion-city",
  "kanto-route-11",
  "digletts-cave",
  "kanto-route-9",
  "kanto-route-10",
  "rock-tunnel",
  "pokemon-tower",
  "kanto-route-12",
  "kanto-route-8",
  "kanto-route-7",
  "celadon-city",
  "saffron-city",
  "kanto-route-16",
  "kanto-route-17",
  "kanto-route-18",
  "fuchsia-city",
  "kanto-safari-zone",
  "kanto-route-15",
  "kanto-route-14",
  "kanto-route-13",
  "power-plant",
  "kanto-sea-route-19",
  "kanto-sea-route-20",
  "seafoam-islands",
  "cinnabar-island",
  "pokemon-mansion",
  "kanto-sea-route-21",
  "kanto-route-23",
  "kanto-victory-road",
  "cerulean-cave",
] as const;

export type RedBlueLocation = (typeof redBlueLocationOrder)[number];

export const redBlueLocationHandlers = (
  gameLocations: Map<string, GameLocation>,
): LocationTransformer<RedBlueLocation> => ({
  starter: () => ({
    id: "starter",
    name: "Starter",
    encounters: {
      gift: Array.from(
        gameLocations.get("pallet-town")?.encounters.get("gift")?.values() ??
          [],
      ),
    },
  }),

  "pallet-town": () => {
    const locationData = gameLocations.get("pallet-town");
    if (!locationData) {
      throw new Error("Unable to find location: pallet-town");
    }

    const encounters = getEncountersAsObject(locationData.encounters);
    delete encounters.gift;

    return {
      id: "pallet-town",
      name: "Pallet Town",
      encounters,
    };
  },

  "kanto-victory-road": () => {
    const vr1 = gameLocations.get("kanto-victory-road-1")?.encounters;
    const vr2 = gameLocations.get("kanto-victory-road-2")?.encounters;

    if (!vr1 || !vr2) {
      throw new Error("Missing entries for Kanto Victory Road");
    }

    return {
      id: "kanto-victory-road",
      name: "Kanto Victory Road",
      encounters: getEncountersAsObject(
        new Map([...vr1.entries(), ...vr2.entries()]),
      ),
    };
  },
});
