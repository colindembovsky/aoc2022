import * as fs from "fs";

const ROOT_DIR="dayxx"

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile(`${ROOT_DIR}/test-input.txt`);
//let contents = readFile(`${ROOT_DIR}/input.txt`);
//console.log(contents);

console.log("==== PART 1 ====");

