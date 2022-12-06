import * as fs from "fs";

const ROOT_DIR="day06";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}
let contents = readFile(`${ROOT_DIR}/input.txt`);
let lines = contents.split("\n");

function getPacketStart(line: string, conseq: number): number {
    // find the first 4 char segment where all 4 chars are different
    let i = 0;
    while (i < line.length - conseq) {
        let seg = line.substring(i, i + conseq);
        let segSet = new Set(seg);
        if (segSet.size === conseq) {
            return i + conseq;
        }
        i++;
    }
    return -1;
}

console.log("==== PART 1 ====");
lines.forEach(line => console.log(getPacketStart(line, 4)));

console.log("==== PART 2 ====");
lines.forEach(line => console.log(getPacketStart(line, 14)));
