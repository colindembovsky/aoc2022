import * as fs from "fs";

const ROOT_DIR="day13";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

function parseLine(line: string): number[] {
    // read line into json array
    let json = JSON.parse(line);
    return json;
}

class SignalPair {
    isCorrectOrder: boolean = false;
    constructor(public left: any[], public right: any[], public index: number) {
        this.isCorrectOrder = this.compare(this.left, 0, this.right, 0);
    }

    compare(leftArray: any[], leftIndex: number, rightArray: any[], rightIndex: number): boolean {
        if (leftIndex >= leftArray.length) return true;
        if (rightIndex >= rightArray.length) return false;
        
        let left = leftArray[leftIndex];
        let right = rightArray[rightIndex];
        
        if (typeof left === "number" && typeof right === "number") {
            if (left < right) return true;
            if (left > right) return false;
            return this.compare(leftArray, leftIndex + 1, rightArray, rightIndex + 1);
        } else if (typeof left === "object" && typeof right === "object") {
            if (this.compare(left, 0, right, 0)) {
                return this.compare(leftArray, leftIndex + 1, rightArray, rightIndex + 1);
            }
        } else if (typeof left === "object" && typeof right === "number") {
            if (this.compare(left, 0, [right], 0)) {
                return this.compare(leftArray, leftIndex + 1, rightArray, rightIndex + 1);
            }
        } else if (typeof left === "number" && typeof right === "object") {
            if (this.compare([left], 0, right, 0)) {
                return this.compare(leftArray, leftIndex + 1, rightArray, rightIndex + 1);
            }
        }
        return false;
    }
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let linePairs = contents.split("\n\n");
let index = 1;
let pairs = linePairs.map(p => {
    let lines = p.split("\n");
    return new SignalPair(JSON.parse(lines[0]), JSON.parse(lines[1]), index++);
});

console.log("==== PART 1 ====");
console.log(`There are ${pairs.filter(p => p.isCorrectOrder).length} in correct order.`);
console.log(`Sum of correct pair indexes: ${pairs.filter(p => p.isCorrectOrder).reduce((a, b) => a + b.index, 0)}`);

console.log("==== PART 2 ====");

