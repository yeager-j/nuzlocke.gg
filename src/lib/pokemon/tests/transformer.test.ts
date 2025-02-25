import { pokemonConversion } from "@/lib/pokemon/conversion";
import Pokedex from "pokedex-promise-v2";
import { describe, expect, test } from "vitest";

describe("Pokemon Transformer", () => {
  const P = new Pokedex();

  test("correctly transforms Zygarde", async () => {
    const pokemon = await pokemonConversion(P, "zygarde");

    expect(pokemon).toMatchSnapshot();
  });

  test("correctly transforms Darmanitan", async () => {
    const pokemon = await pokemonConversion(P, "darmanitan");

    expect(pokemon).toMatchSnapshot();
  });

  test("correctly transforms Minior", async () => {
    const pokemon = await pokemonConversion(P, "minior");

    expect(pokemon).toMatchSnapshot();
  });

  test("correctly transforms Necrozma", async () => {
    const pokemon = await pokemonConversion(P, "necrozma");

    expect(pokemon).toMatchSnapshot();
  });

  test("correctly transforms Aegislash", async () => {
    const pokemon = await pokemonConversion(P, "aegislash");

    expect(pokemon).toMatchSnapshot();
  });

  test("correctly transforms Pikachu", async () => {
    const pokemon = await pokemonConversion(P, "pikachu");

    expect(pokemon).toMatchSnapshot();
  });
});
