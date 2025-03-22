import { writeEncounterJSONFile } from "@/lib/pokeapi/build-encounters";
import {
  redBlueLocationHandlers,
  redBlueLocationOrder,
} from "@/lib/pokeapi/games/red-blue";

function main() {
  Promise.all([
    writeEncounterJSONFile(
      { id: "red", name: "Pokémon Red" },
      redBlueLocationOrder,
      redBlueLocationHandlers,
    ),
    writeEncounterJSONFile(
      { id: "blue", name: "Pokémon Blue" },
      redBlueLocationOrder,
      redBlueLocationHandlers,
    ),
  ]);
}

main();
