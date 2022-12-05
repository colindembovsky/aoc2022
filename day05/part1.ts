import * as fs from "fs";
import { parseColumns, parseInstructions, followInstructionsPart1 } from './columns';

const ROOT_DIR="day05";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

//let contents = readFile(`${ROOT_DIR}/test-input.txt`);
let contents = readFile(`${ROOT_DIR}/input.txt`);
console.log("==== PART 1 ====");

let [columLines, instructionLines] = contents.split("\n\n");
let cols = parseColumns(columLines.split("\n"));
let instructions = parseInstructions(instructionLines.split("\n"));
console.log(followInstructionsPart1(cols, instructions));

console.log("==== PART 2 ====");
contents = readFile(`${ROOT_DIR}/input.txt`);

