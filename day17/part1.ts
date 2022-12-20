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
        this.shape = shapes[shapeIndex];
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

class Chamber {
    chamber: number[][];
    height = 0;
    ticks = 0;
    rockCount = 0;

    constructor(public moves: string) {
        this.chamber = [
            [1, 1, 1, 1, 1, 1, 1]
        ];
    }

    rockFall(rocks: number) {
        this.rockCount = 0;
        while(this.rockCount < rocks) {
            this.startRock(this.rockCount);
            this.print();
        }
    }

    startRock(r: number) {
        let rock = new Rock(r % 5);
        this.rockCount++;

        // add 3 empty rows
        for (let i = 0; i < 3; i++) {
            this.chamber.unshift([0, 0, 0, 0, 0, 0, 0]);
        }
        this.print();

        // move rock down
        do {
            this.moveRockFromJets(rock);
            rock.offset++;
        } while (this.rockCanFall(rock));

        // add rock to grid
        this.rockComesToRest(rock);
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
            if (rock.offset + i >= this.chamber.length) { 
                chamberRow = this.chamber[rock.offset + i];
            }

            let rockLeft = rockRow.indexOf(1);
            let rockRight = rockRow.lastIndexOf(1);

            let wallLeft = chamberRow.indexOf(1);
            let wallRight = chamberRow.lastIndexOf(1);
            if (wallLeft === -1) { wallLeft = 0; }
            if (wallRight === -1) { wallRight = 6; }
    
            // check walls
            if (direction === "<" && rockLeft <= wallLeft) { return false; }
            if (direction === ">" && rockRight >= wallRight) { return false; }
        }
        return true;
    }

    rockCanFall(rock: Rock) {
        for (let i = 0; i < rock.shape.length; i++) {
            let rockRow = rock.shape[i];
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
        if (this.chamber.length - offset < 0) { this.chamber.unshift(rockRow) };
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

let contents = readFile(`${ROOT_DIR}/easy-input.txt`);

console.log("==== PART 1 ====");
let chamber = new Chamber(contents);
chamber.rockFall(2);

//console.log("==== PART 2 ====");
