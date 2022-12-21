import * as fs from "fs";

const ROOT_DIR="day17";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let shapes = [
    [
        [0, 0, 1, 1, 1, 1, 0],
    ],
    [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
    ],
    [
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
    ]
];

class Rock {
    shape: number[][];
    offset = -1;

    constructor(public shapeIndex: number) {
        // make a deep copy of shapes[shapeIndex]
        this.shape = shapes[shapeIndex].map(row => row.slice());
    }

    move(direction: string) {
        if (direction === "<") {
            this.shiftLeft();
        } else if (direction === ">") {
            this.shiftRight();
        }
    }

    shiftLeft() {
        for (let row of this.shape) {
            row.shift();
            row.push(0);
        }
    }

    shiftRight() {
        for (let row of this.shape) {
            row.pop();
            row.unshift(0);
        }
    }
}

class FloorCacheItem {
    constructor(public curHeight = 0, public curRockCount = 0, public heightDiff = 0, public rockCountDiff = 0) {}
}

class Chamber {
    chamber: number[][];
    ticks = 0;
    rockCount = 0;
    heightOffset = 0;
    cache: Map<string, string> = new Map();
    floorCache: Map<number, FloorCacheItem> = new Map();

    constructor(public moves: string, public targetRockCount: number, public cacheRowCount: number) {
        this.chamber = [
            [1, 1, 1, 1, 1, 1, 1]
        ];
    }

    getHeight() {
        return this.chamber.length + this.heightOffset - 1;
    }
    
    rockFall() {
        this.rockCount = 0;
        while(this.rockCount < this.targetRockCount) {
            this.startRock(this.rockCount);
            //this.print();
            //console.log(this.rockCount);
        }
    }

    getKey(rockIndex: number) {
        let index = "";
        for (let i = 0; i < Math.min(this.cacheRowCount, this.chamber.length - 1); i++) {
            index += this.chamber[i].join("");
        }
        return `${rockIndex}-${index}-${this.ticks % this.moves.length}`;
    }

    setCache(key: string, r: number, elapsedTicks: number, heightDiff: number) {
        let val = this.chamber.slice(0, Math.min(this.cacheRowCount, this.chamber.length - 1)).map(row => row.join("")).join(",");
        val = `${elapsedTicks}|${heightDiff}|${val}`;
        this.cache.set(key, val);
        this.resetFloor();
    }
    
    resetFloor() {
        // make a new floor out of any row that is all 1s
        if (this.chamber.length > this.cacheRowCount) {
            let highestFloor = this.chamber.findIndex(row => row.every(c => c === 1));
            if (highestFloor < this.chamber.length - 1) {
                this.heightOffset += this.chamber.length - highestFloor - 1;
                this.chamber = this.chamber.slice(0, highestFloor + 1);
                // wait for the pattern to stabilize, then fast-forward
                if (this.getHeight() > 20000) {
                    let tickIndex = this.ticks % this.moves.length;
                    let floorCacheItem = this.floorCache.get(tickIndex);
                    if (floorCacheItem) {
                        if (floorCacheItem.heightDiff === 0) {
                            floorCacheItem.heightDiff = this.getHeight() - floorCacheItem.curHeight;
                            floorCacheItem.rockCountDiff = this.rockCount - floorCacheItem.curRockCount;

                            // fast forward to the end
                            let iterations = Math.floor((this.targetRockCount - this.rockCount) / floorCacheItem.rockCountDiff);
                            this.rockCount += floorCacheItem.rockCountDiff * iterations;
                            this.heightOffset += floorCacheItem.heightDiff * iterations;
                            //console.log(`Fast forward: height = ${this.getHeight()}, count = ${this.rockCount}, iterations = ${iterations}`);
                        }
                    } else {
                        this.floorCache.set(tickIndex, new FloorCacheItem(this.getHeight(), this.rockCount));
                    }
                }
            }
        }
    }

    startRock(r: number) {
        let rock = new Rock(r % 5);
        this.rockCount++;
        let key = this.getKey(r % 5);

        if (this.cache.has(key)) {
            let [elapsedTicks, heightDiffStr, rows] = this.cache.get(key)!.split("|");
            this.ticks += parseInt(elapsedTicks);
            
            let heightDiff = parseInt(heightDiffStr);
            let topRows = rows.split(",").map(row => row.split("").map(c => parseInt(c)));
            // replace the top rows with the cached rows
            this.chamber.splice(0, topRows.length - heightDiff, ...topRows);
            this.resetFloor();
            return;
        }

        let ticksBefore = this.ticks;
        let heightBefore = this.chamber.length;
        // add 3 empty rows
        for (let i = 0; i < 3; i++) {
            this.chamber.unshift([0, 0, 0, 0, 0, 0, 0]);
        }

        // move rock down
        do {
            this.moveRockFromJets(rock);
            rock.offset++;
        } while (this.rockCanFall(rock));

        // add rock to grid
        this.rockComesToRest(rock);
        this.setCache(key, r, this.ticks - ticksBefore, this.chamber.length - heightBefore);
    }

    moveRockFromJets(rock: Rock) {
        let jet = this.moves[this.ticks++ % this.moves.length]
        if (this.rockCanMove(rock, jet)) {
            rock.move(jet);
        }
    }

    rockCanMove(rock: Rock, direction: string) {
        for (let i = 0; i < rock.shape.length; i++) {
            let rockRow = rock.shape[i];
            let chamberRow = [0, 0, 0, 0, 0, 0, 0];
            if (rock.offset - rock.shape.length + i + 1 >= 0) { 
                chamberRow = this.chamber[rock.offset - rock.shape.length + i + 1];
            }

            let rockLeft = rockRow.indexOf(1);
            let rockRight = rockRow.lastIndexOf(1);

            // check walls
            if (direction === "<") {
                if (rockLeft === 0) return false;
                if (chamberRow[rockLeft - 1]) return false;
            }
            if (direction === ">") {
                if (rockRight === 6) return false;
                if (chamberRow[rockRight + 1]) return false;
            } 
        }
        return true;
    }

    rockCanFall(rock: Rock) {
        for (let i = 0; i < rock.shape.length; i++) {
            let rockRow = rock.shape[rock.shape.length - i - 1];
            let chamberRow = [0, 0, 0, 0, 0, 0, 0];
            if (rock.offset - i >= 0) { 
                chamberRow = this.chamber[rock.offset - i];
            }
            for (let j = 0; j < rockRow.length; j++) {
                if (rockRow[j] && chamberRow[j]) {
                    return false;
                }
            }
        }
        return true;
    }

    rockComesToRest(rock: Rock) {
        let bottomRow = rock.offset;
        for (let i = rock.shape.length - 1; i >= 0; i--) {
            this.mergeRow(rock.shape[i], bottomRow - (rock.shape.length - i));
        }

        // delete empty rows
        for (let i = 0; i < this.chamber.length; i++) {
            if (this.chamber[i].every(x => x === 0)) {
                this.chamber.splice(i, 1);
                i--;
            }
        }
    }

    mergeRow(rockRow: number[], offset: number) {
        while (offset < 0) { 
            this.chamber.unshift(rockRow) 
            offset++;
        };
        for (let i = 0; i < rockRow.length; i++) {
            this.chamber[offset][i] ||= rockRow[i];
        }
    }

    print() {
        for (let i = 0; i <= this.chamber.length - 1; i++) {
            console.log(`|${this.chamber[i].map(x => x === 0 ? "." : "#").join("")}|`);
        }
        console.log("");
        console.log("");
    }
}

let contents = readFile(`${ROOT_DIR}/input.txt`);

console.log("==== PART 1 ====");
let chamber = new Chamber(contents, 2022, 50);
chamber.rockFall();
console.log(`Rock height: ${chamber.getHeight()}`);

console.log("==== PART 2 ====");
chamber = new Chamber(contents, 1000000000000, 100);
chamber.rockFall();
console.log(`Rock height: ${chamber.getHeight()}`);