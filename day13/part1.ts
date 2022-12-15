import * as fs from "fs";

const ROOT_DIR="day13";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

function compareItems(left: any, right: any): number {
    if (typeof left === "number" && typeof right === "number") {
        if (left < right) return 1;
        if (left > right) return -1;
        return 0;
    }
    let leftArr = Array.isArray(left) ? left : [left];
    let rightArr = Array.isArray(right) ? right : [right];
    return compareArrays(leftArr, rightArr);
}

function compareArrays(leftArray: any[], rightArray: any[]): number {
    let max = Math.max(leftArray.length, rightArray.length);
    for (let i = 0; i < max; i++) {
        let left = leftArray[i];
        let right = rightArray[i];
        
        if (left === undefined) return 1;
        if (right === undefined) return -1;
        let result = compareItems(left, right);
        if (result !== 0) {
            return result;
        }
    }
    return 0;
}

class SignalPair {
    isCorrectOrder: boolean = false;
    constructor(public left: any[], public right: any[], public index: number = 0) {
        this.isCorrectOrder = compareArrays(this.left, this.right) > 0;
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
console.log(`Sum of correct pair indexes: ${pairs.filter(p => p.isCorrectOrder).reduce((a, b) => a + b.index, 0)}`);

console.log("==== PART 2 ====");
let allItems = contents.split("\n").filter(p => p.length > 0).map(p => JSON.parse(p));
let item2 = [[2]];
let item6 =  [[6]];
allItems.push(item2);
allItems.push(item6);
allItems.sort((a, b) => compareItems(b, a));
let index2 = allItems.indexOf(item2) + 1;
let index6 = allItems.indexOf(item6) + 1;
console.log(`Decoder key: ${index2 * index6}`);