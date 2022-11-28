import * as fs from "fs";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile("test-input.txt");
//let contents = readFile("input.txt");
//console.log(contents);

console.log("==== PART 2 ====");

