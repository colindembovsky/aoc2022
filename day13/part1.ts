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
        console.log(`Item ${index}`);
        this.isCorrectOrder = this.compareArrays(this.left, this.right) > 0;
        console.log(`Correct order: ${this.isCorrectOrder}`);
        console.log("");
    }

    compareItems(left: any, right: any): number {
        if (typeof left === "number" && typeof right === "number") {
            if (left < right) return 1;
            if (left > right) return -1;
            return 0;
        }
        let leftArr = Array.isArray(left) ? left : [left];
        let rightArr = Array.isArray(right) ? right : [right];
        return this.compareArrays(leftArr, rightArr);
    }

    compareArrays(leftArray: any[], rightArray: any[]): number {
        let max = Math.max(leftArray.length, rightArray.length);
        for (let i = 0; i < max; i++) {
            let left = leftArray[i];
            let right = rightArray[i];
            
            if (left === undefined) return 1;
            if (right === undefined) return -1;
            let result = this.compareItems(left, right);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
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
console.log(`indexes of correct pairs: ${pairs.filter(p => p.isCorrectOrder).map(p => p.index).join(', ')}`);
console.log(`Sum of correct pair indexes: ${pairs.filter(p => p.isCorrectOrder).reduce((a, b) => a + b.index, 0)}`);
