import * as fs from "fs";

const ROOT_DIR="day10";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class Op {
    constructor(public name: string, public val: number, public X: number) {}
    getChar(pos: number) {
        let rowPos = pos % 40;
        return this.X - 1 <= rowPos && rowPos <= this.X + 1 ? "#" : ".";
    }
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let initialOperations = contents.split("\n");

let operations: Op[] = [];
let xAcc = 1;
initialOperations.forEach(op => {
    let [opName, opValue] = op.split(" ");
    if (opName === "addx") {
        operations.push(new Op("===", 0, xAcc));
        let addVal = parseInt(opValue);
        xAcc += addVal;
        operations.push(new Op(opName, addVal, xAcc));
    } else if (opName === "noop") {
        operations.push(new Op(opName, 0, xAcc));
    }
});

console.log("==== PART 1 ====");
operations.forEach((op, i) => {
    console.log(`Cycle ${i + 1}: ${op.name} ${op.val} (register X: ${op.X})`);
});
console.log("----");

let cycles = [20, 60, 100, 140, 180, 220];
let total = 0;
cycles.forEach(cycle => {
    let op = operations[cycle - 2];
    console.log(`Cycle ${cycle}: ${op.name} ${op.val} (register X: ${op.X})`);
    total += op.X * cycle;
});
console.log(`Total: ${total}`);

console.log("==== PART 2 ====");

let screen = "";
operations.unshift(new Op("===", 0, 0));
for (let i = 0; i < operations.length - 1; i++) {
    screen += operations[i].getChar(i);
}
// split screen into lines of length 40
let lines = screen.match(/.{1,40}/g);
lines!.forEach(line => console.log(line));