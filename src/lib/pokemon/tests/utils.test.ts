import { describe, expect, test } from "vitest";

import { isModeOf } from "../utils";

describe("isModeOf", () => {
  test("returns true for standard -mega and -gmax forms", () => {
    expect(isModeOf("charizard", "charizard-mega-x")).toBe(true);
    expect(isModeOf("charizard", "charizard-mega-y")).toBe(true);
    expect(isModeOf("charizard", "charizard-gmax")).toBe(true);
  });

  test("returns true for Darmanitan's Zen Modes", () => {
    expect(isModeOf("darmanitan-standard", "darmanitan-zen")).toBe(true);
    expect(isModeOf("darmanitan-galar-standard", "darmanitan-galar-zen")).toBe(
      true,
    );
    expect(isModeOf("darmanitan", "darmanitan-zen")).toBe(true);
  });

  test("returns true for Necrozma Ultra", () => {
    expect(isModeOf("necrozma-dusk", "necrozma-ultra")).toBe(true);
    expect(isModeOf("necrozma-dawn", "necrozma-ultra")).toBe(true);
    expect(isModeOf("necrozma", "necrozma-ultra")).toBe(false); // Base Necrozma can't Ultra Burst
  });

  test("returns true for Aegislash modes", () => {
    expect(isModeOf("aegislash-shield", "aegislash-blade")).toBe(true);
    expect(isModeOf("aegislash", "aegislash-blade")).toBe(true);
  });

  test("returns true for Meloetta forms", () => {
    expect(isModeOf("meloetta-aria", "meloetta-pirouette")).toBe(true);
  });

  test("returns true for Greninja-Ash transformation", () => {
    expect(isModeOf("greninja-battle-bond", "greninja-ash")).toBe(true);
    expect(isModeOf("greninja", "greninja-ash")).toBe(false);
  });

  test("returns true for Minior's core transformations", () => {
    expect(isModeOf("minior-red-meteor", "minior-red")).toBe(true);
    expect(isModeOf("minior-blue-meteor", "minior-blue")).toBe(true);
    expect(isModeOf("minior-green-meteor", "minior-violet")).toBe(false);
    expect(isModeOf("minior", "minior-red")).toBe(false); // Base form shouldn't trigger this
  });

  test("returns false for Kyurem fusions", () => {
    expect(isModeOf("kyurem", "kyurem-black")).toBe(false);
    expect(isModeOf("kyurem", "kyurem-white")).toBe(false);
    expect(isModeOf("kyurem-black", "kyurem-white")).toBe(false);
  });

  test("returns true for zygarde-complete if power-construct", () => {
    expect(isModeOf("zygarde-50-power-construct", "zygarde-complete")).toBe(
      true,
    );
    expect(isModeOf("zygarde-10-power-construct", "zygarde-complete")).toBe(
      true,
    );
    expect(isModeOf("zygarde-50", "zygarde-complete")).toBe(false);
    expect(isModeOf("zygarde-10", "zygarde-complete")).toBe(false);
  });

  test("returns false for unrelated forms", () => {
    expect(isModeOf("charizard", "venusaur-mega")).toBe(false);
    expect(isModeOf("pikachu", "pikachu-gmax")).toBe(true); // Pikachu does have a G-Max mode
    expect(isModeOf("charizard", "blastoise-mega")).toBe(false);
  });

  test("returns true for default mode-matching", () => {
    expect(isModeOf("rayquaza", "rayquaza-mega")).toBe(true);
    expect(isModeOf("blaziken", "blaziken-mega")).toBe(true);
    expect(isModeOf("mewtwo", "mewtwo-mega-x")).toBe(true);
    expect(isModeOf("mewtwo", "mewtwo-mega-y")).toBe(true);
  });

  test("handles malformed inputs gracefully", () => {
    expect(isModeOf("", "charizard-mega-x")).toBe(false);
    expect(isModeOf("charizard", "")).toBe(false);
    expect(isModeOf("", "")).toBe(false);
    expect(isModeOf("charizard", "charizard")).toBe(false); // Should not match itself
  });
});
