import * as fs from "fs";

const ROOT_DIR="day20";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let lines = contents.split("\n");

// make an array of numbers from the lines
let originalNumbers = lines.map(line => parseInt(line));
let numbers = originalNumbers.slice();

console.log("==== PART 1 ====");

for(let i = 0; i < originalNumbers.length; i++) {
    const num = originalNumbers[i];
    if (num === 0) {
        continue;
    }
    const j = numbers.indexOf(num);

    let newIndex = j + num;
    if (newIndex > numbers.length) {
        newIndex = newIndex % numbers.length + 1;
    }
    if (newIndex < 0) {
        if (-newIndex > numbers.length) {
            newIndex = -(newIndex % numbers.length);  /// issue here <---
        }
    }
    
    numbers.splice(j, 1);
    if (newIndex === 0 || newIndex === -numbers.length) {
        numbers.push(num);
    } else if (newIndex === numbers.length) {
        numbers.unshift(num);
    }
    else {
        numbers.splice(newIndex, 0, num);
    }
    //console.log(`num: ${num}: ${numbers.join(",")}`);
}
let zeroIndex = numbers.indexOf(0);
const num1 = numbers[(1000 + zeroIndex) % numbers.length];
const num2 = numbers[(2000 + zeroIndex) % numbers.length];
const num3 = numbers[(3000 + zeroIndex) % numbers.length];
console.log(`Result is ${num1 + num2 + num3}`);
//< 10667

console.log("==== PART 2 ====");
