import * as fs from "fs";
import { parseColumns, parseInstructions, followInstructionsPart1, followInstructionsPart2 } from './columns';

const ROOT_DIR="day05";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let [columLines, instructionLines] = contents.split("\n\n");
let instructions = parseInstructions(instructionLines.split("\n"));

console.log("==== PART 1 ====");
let cols = parseColumns(columLines.split("\n"));
console.log(followInstructionsPart1(cols, instructions));

console.log("==== PART 2 ====");
cols = parseColumns(columLines.split("\n"));
console.log(followInstructionsPart2(cols, instructions));