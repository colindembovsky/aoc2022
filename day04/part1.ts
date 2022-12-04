import * as fs from "fs";

const ROOT_DIR="day04";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class ElfRange {
    public min: number;
    public max: number;
    
    constructor(line: string) {
        let [min, max] = line.split("-");
        this.min = parseInt(min);
        this.max = parseInt(max);
    }
}

class Pair {
    public elf1: ElfRange;
    public elf2: ElfRange;

    constructor(public line: string) {
        let [e1, e2] = line.split(",");
        this.elf1 = new ElfRange(e1);
        this.elf2 = new ElfRange(e2);
    }

    public rangeIsContained(a: ElfRange, b: ElfRange): boolean {
        return a.min >= b.min && a.max <= b.max;
    }

    public eitherRangeIsContained(): boolean {
        return this.rangeIsContained(this.elf1, this.elf2) || this.rangeIsContained(this.elf2, this.elf1);
    }

    public pairsOverlap(): boolean {
        return this.elf1.max >= this.elf2.min && this.elf2.max >= this.elf1.min;
    }
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let lines = contents.split("\n");
let pairs = lines.map(l => new Pair(l));

console.log("==== PART 1 ====");
let contained = pairs.filter(p => p.eitherRangeIsContained());
console.log(`Contained: ${contained.length}`);

console.log("==== PART 2 ====");
let overlaps = pairs.filter(p => p.pairsOverlap());
console.log(`Overlaps: ${overlaps.length}`);
