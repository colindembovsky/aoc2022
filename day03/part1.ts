import * as fs from "fs";

const ROOT_DIR="day03";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class Sack {
    private compartment1: string;
    private compartment2: string;
    constructor(line: string) {
        // compartment1 is the first half of the chars
        this.compartment1 = line.substring(0, line.length / 2);
        // compartment2 is the second half of the chars
        this.compartment2 = line.substring(line.length / 2);
    }

    // function to calculate the common letters between the compartments
    public getCommonLetters(): string {
        // convert each compartment to set
        let set1 = new Set(this.compartment1.split(""));
        let set2 = new Set(this.compartment2.split(""));
        // get the intersection of the two sets
        let intersection = new Set([...set1].filter(x => set2.has(x)));
        // convert the intersection back to a string
        return Array.from(intersection).join("");
    }

    public getScore(): number {
        // get ascii value of first letter
        let commonVal = this.getCommonLetters()[0].charCodeAt(0);
        let offset = commonVal >= 96 ? 96 : 64 - 26;
        return commonVal - offset;
    }
}

console.log("==== PART 1 ====");
//let contents = readFile(`${ROOT_DIR}/test-input.txt`);
let contents = readFile(`${ROOT_DIR}/input.txt`);

// create an empty array of Sacks
let sacks: Sack[] = [];
contents.split("\n").forEach(line => {
    let sack = new Sack(line);
    sacks.push(sack);
    //let score = sack.getScore();
    //console.log(`Sack: ${line} has common letter ${sack.getCommonLetters()} with score ${score}`);
});
console.log(`Final score: ${sacks.reduce((a, b) => a + b.getScore(), 0)}`);

//console.log("==== PART 2 ====");
//contents = readFile(`${ROOT_DIR}/input.txt`);

