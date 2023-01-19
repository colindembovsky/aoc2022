import * as fs from "fs";

const ROOT_DIR="day20";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let lines = contents.split("\n");

class Node {
    left: Node | undefined = undefined;
    right: Node | undefined = undefined;
    constructor(public value: number) {}
}

console.log("==== PART 1 ====");

// make an array of numbers from the lines
let numbers = lines.map(line => new Node(parseInt(line)));
for (let i = 0; i < numbers.length; i++) {
    numbers[i].left  = numbers[(i - 1) % numbers.length];
    numbers[i].right = numbers[(i + 1) % numbers.length];
}
numbers[0].left = numbers[numbers.length - 1];
const cycle = numbers.length - 1;

function printNums() {
    let k = numbers[0];
    let n = "";
    for (let i = 0; i < numbers.length; i++) {
        n += k.value + ", ";
        k = k.right!;
    }
    console.log(n);
}

let zeroNode = undefined;

for(let node of numbers) {
    if (node.value === 0) {
        zeroNode = node;
        continue;
    }
    console.log(`move k: ${node.value}`);
    let target = node;
    if (node.value > 0) {
        for (let i = 0; i < node.value % cycle; i++) {
            target = target.right!;
        }
    } else {
        for (let i = 0; i < (-node.value + 1) % cycle; i++) {
            target = target.left!;
        }
    }

    if (node === target) {
        continue;
    }

    // remove n from the list
    node.right!.left = node.left;
    node.left!.right = node.right;

    // insert n after target
    target.right!.left = node;
    node.right = target.right;
    target.right = node;
    node.left = target;
}

let coordinate = 0;
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 1000; j++) {
        zeroNode = zeroNode!.right!;
    }
    coordinate += zeroNode!.value;
}
console.log(coordinate);

console.log("==== PART 2 ====");
