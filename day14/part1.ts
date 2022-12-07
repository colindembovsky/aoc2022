import * as fs from "fs";

const ROOT_DIR="day14";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile(`${ROOT_DIR}/easy-input.txt`);



console.log("==== PART 1 ====");


console.log("==== PART 2 ====");
contents = readFile(`${ROOT_DIR}/input.txt`);

