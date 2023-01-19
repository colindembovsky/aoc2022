import * as fs from "fs";

const ROOT_DIR="day21";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class Monkey {
    name: string;
    num: number | undefined = undefined;
    op: string | undefined = undefined;
    monkeyAName: string | undefined = undefined;
    monkeyBName: string | undefined = undefined;
    monkeyA: Monkey | undefined = undefined;
    monkeyB: Monkey | undefined = undefined;

    constructor(public line: string) {
        let parts = line.split(":");
        this.name = parts[0];
        let opParts = parts[1].trim().split(" ");
        if (opParts.length === 1) {
            this.num = parseInt(opParts[0]);
        } else {
            this.monkeyAName = opParts[0];
            this.op = opParts[1];
            this.monkeyBName = opParts[2];
        }
    }

    connect(monkeys: Monkey[]) {
        if (this.monkeyAName !== undefined) {
            this.monkeyA = monkeys.find(m => m.name === this.monkeyAName)!;
        }
        if (this.monkeyBName !== undefined) {
            this.monkeyB = monkeys.find(m => m.name === this.monkeyBName)!;
        }
    }

    shout(): number {
        if (this.num !== undefined) {
            return this.num;
        }
        
        let a = this.monkeyA?.shout()!;
        let b = this.monkeyB?.shout()!;

        if (this.op === "+") return a + b;
        if (this.op === "-") return a - b;
        if (this.op === "*") return a * b;
        if (this.op === "/") return a / b;
        throw Error(`Unknown op ${this.op}`);
    }
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let lines = contents.split("\n");

console.log("==== PART 1 ====");
let monkeys = lines.map(line => new Monkey(line));
monkeys.forEach(m => m.connect(monkeys));
let root = monkeys.find(m => m.name === "root")!;
console.log(root.shout());

console.log("==== PART 2 ====");