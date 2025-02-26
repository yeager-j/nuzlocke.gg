import path from "path";
import { StatElement } from "pokedex-promise-v2";

import { Stats } from "@/lib/pokemon/types";

export const DATA_PATH = path.join(__dirname, "../../data");

const modeKeywords = [
  "mega",
  "gmax",
  "zen",
  "blade",
  "primal",
  "eternamax",
  "ultra",
  "pirouette",
  "busted",
  "school",
  "complete",
  "hangry",
  "hero",
  "sunny",
  "rainy",
  "snowy",
  "ash",
  "gulping",
  "gorging",
  "noice",
  "terastal",
  "stellar",
];

/**
 * Determines whether the given name is likely a Mode of a Pokémon or entity. I have defined a Mode as an in-battle
 * transformation. Examples include Mega Evolutions, Gigantimax, Ultra Burst, Primal Reversion, etc.
 *
 * If the given name is not a Mode, it is a Form, which is an out-of-battle transformation, such as a regional variant.
 *
 * @param {string} name - The name to check for Mode keywords.
 * @return {boolean} Returns true if the name contains patterns indicating it is likely a Mode; otherwise, false.
 */
export function isLikelyMode(name: string): boolean {
  // Minior is a special case. Annoying.
  if (name.includes("minior")) {
    if (!name.includes("meteor")) {
      return true;
    }
  }

  // Common patterns for in-battle transformations
  return modeKeywords.some((keyword) =>
    name.split("-").some((part) => part === keyword),
  );
}

/**
 * Converts an array of StatElement objects into a structured Stats object
 * containing specific stat properties such as hp, attack, defense, specialAttack,
 * specialDefense, and speed.
 *
 * @param {StatElement[]} stats - Array of StatElement objects representing various stats, each containing a stat name and its base value.
 * @return {Stats} An object containing the converted stats with specific properties: hp, attack, defense, specialAttack, specialDefense, and speed.
 */
export function convertCringeStatsToBasedStats(stats: StatElement[]): Stats {
  const hp = stats.find((s) => s.stat.name === "hp")!.base_stat;
  const attack = stats.find((s) => s.stat.name === "attack")!.base_stat;
  const defense = stats.find((s) => s.stat.name === "defense")!.base_stat;
  const specialAttack = stats.find(
    (s) => s.stat.name === "special-attack",
  )!.base_stat;
  const specialDefense = stats.find(
    (s) => s.stat.name === "special-defense",
  )!.base_stat;
  const speed = stats.find((s) => s.stat.name === "speed")!.base_stat;

  return {
    hp,
    attack,
    defense,
    specialAttack,
    specialDefense,
    speed,
  };
}

/**
 * Determines if the specified mode name is a variation or transformation mode of the given base form name.
 *
 * @param {string} baseFormName - The name of the base form to compare against.
 * @param {string} modeName - The name of the mode to check if it corresponds to a variation of the base form.
 * @return {boolean} Returns true if the mode name is a valid transformation or mode of the given base form name, otherwise false.
 */
export function isModeOf(baseFormName: string, modeName: string): boolean {
  if (baseFormName.includes("darmanitan") && modeName.includes("zen")) {
    return (
      baseFormName.replace("-standard", "") === modeName.replace("-zen", "")
    );
  }

  if (modeName === "necrozma-ultra") {
    return baseFormName === "necrozma-dusk" || baseFormName === "necrozma-dawn";
  }

  if (baseFormName.includes("aegislash") && modeName.includes("aegislash")) {
    return true;
  }

  if (baseFormName.includes("meloetta") && modeName.includes("meloetta")) {
    return true;
  }

  if (baseFormName.includes("palafin") && modeName.includes("palafin")) {
    return true;
  }

  if (baseFormName.includes("morpeko") && modeName.includes("morpeko")) {
    return true;
  }

  if (baseFormName.includes("eiscue") && modeName.includes("eiscue")) {
    return true;
  }

  if (baseFormName.includes("cramorant") && modeName.includes("cramorant")) {
    return true;
  }

  if (baseFormName.includes("wishiwashi") && modeName.includes("wishiwashi")) {
    return true;
  }

  if (modeName === "zygarde-complete") {
    return (
      baseFormName.startsWith("zygarde") &&
      baseFormName.includes("power-construct")
    );
  }

  if (modeName === "greninja-ash") {
    return baseFormName === "greninja-battle-bond";
  }

  if (baseFormName.includes("minior")) {
    return baseFormName.startsWith(modeName);
  }

  if (modeName.startsWith("kyurem-")) {
    return false;
  }

  return modeName.startsWith(`${baseFormName}-`);
}

export async function rest(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Constructs a JSDoc-style comment block for the given input comment string.
 * The comment is formatted to ensure each line does not exceed the specified maximum width.
 *
 * @param {string} comment The comment text to be formatted into a JSDoc block.
 * @param {number} [maxWidth=120] The desired maximum width for each line in the formatted JSDoc comment block, including reserved characters for formatting. Default is 120.
 * @return {string} A formatted JSDoc comment block containing the input comment text.
 */
export function commentConstruct(
  comment: string,
  maxWidth: number = 120,
): string {
  // Reserve 3 characters for ' * ' at the beginning of each line
  const contentWidth = maxWidth - 3;

  // Split the comment into words
  const words = comment.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  // Build lines within max width
  words.forEach((word) => {
    // Check if adding this word would exceed the line width
    if (
      currentLine.length + word.length + 1 > contentWidth &&
      currentLine.length > 0
    ) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
    }
  });

  // Add the last line if it has content
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Format into JSDoc comment
  return `/**\n${lines.map((line) => ` * ${line}`).join("\n")}\n */`;
}

/**
 * Constructs a TypeScript type definition as a string, using the provided type name and array of items.
 *
 * @param typeName - The name of the TypeScript type being constructed.
 * @param items - An array of strings representing the allowed values of the type.
 * @return A string representing the constructed TypeScript type definition.
 */
export function typescriptTypeConstruct(
  typeName: string,
  items: string[],
): string {
  const types = items.map((item) => `"${item}"`).join("\n| ");

  return `export type ${typeName} = ${types};`;
}
