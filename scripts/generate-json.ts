import { writeJSONFile } from "@/lib/pokeapi/build-game";
import {
  redBlueLocationHandlers,
  redBlueLocationOrder,
} from "@/lib/pokeapi/games/red-blue";

function main() {
  Promise.all([
    writeJSONFile(
      { id: "red", name: "Pokémon Red" },
      redBlueLocationOrder,
      redBlueLocationHandlers,
    ),
    writeJSONFile(
      { id: "blue", name: "Pokémon Blue" },
      redBlueLocationOrder,
      redBlueLocationHandlers,
    ),
  ]);
}

main();
