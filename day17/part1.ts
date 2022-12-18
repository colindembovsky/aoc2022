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

let startRight = [5, 4, 4, 2, 3];

class Rock {
    left: number = 2
    right: number = startRight[this.shapeIndex];
    shape: number[][];
    offset = -1;

    constructor(public shapeIndex: number, initialMoves: string) {
        this.shape = shapes[shapeIndex];
        for (let move of initialMoves.split("")) {
            this.move(move);
        }
    }

    move(direction: string, grid?: number[][]) {
        // TODO: determine if shape can move in direction
        
        
        if (direction === "<" && this.left > 0) {
            this.left--;
            this.right--;
            this.shiftLeft();
        } else if (direction === ">" && this.right < 6) {
            this.left++;
            this.right++;
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
    grid: number[][];
    height = 0;
    ticks = 0;
    rockCount = 0;

    constructor(public moves: string) {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1]
        ];
    }

    rockFall(rocks: number) {
        this.rockCount = 0;
        while(this.rockCount < rocks) {
            this.startRock(this.rockCount);
            this.print();
            console.log("");
            console.log("");
        }
    }

    startRock(r: number) {
        // get the next 3 moves
        let mIndex = this.ticks % this.moves.length;
        let moves = this.moves.substring(mIndex, mIndex + 3);
        this.ticks += 3;

        let rock = new Rock(r % 5, moves);
        this.rockCount++;

        // move rock down
        do {
            rock.move(this.moves[this.ticks++ % this.moves.length], this.grid.slice(0, rock.offset + 1));
            rock.offset++;
        } while (this.canMoveDown(rock));

        // add rock to grid
        this.rockComesToRest(rock);
    }

    canMoveDown(rock: Rock) {
        // TODO: add logic to check entire shape
        let top = this.grid[0];
        let rockCompareRow = rock.shape[rock.shape.length - 1 - rock.offset];
        for (let i = 0; i < rockCompareRow.length; i++) {
            if (top[i] && rockCompareRow[i]) { return false };
        }
        return true;
    }

    rockComesToRest(rock: Rock) {
        let oldTop = [];
        for (let i = 0; i < rock.offset; i++) {
            oldTop.push(this.grid.pop());
        }
        oldTop.reverse();
        let newTop = [];
        rock.shape.reverse();
        for (let i = 0; i < rock.shape.length; i++) {
            let topRow: number[] = oldTop.pop() ?? [0, 0, 0, 0, 0, 0, 0];
            for (let j = 0; j < topRow.length; j++) {
                topRow[j] = rock.shape[i][j] || topRow[j];
            }
            newTop.push(topRow);
        }
        while(newTop.length > 0){
            this.grid.unshift(newTop.shift()!);
        }
    }

    print() {
        for (let row of this.grid) {
            console.log(`|${row.map(x => x === 0 ? "." : "#").join("")}|`);
        }
    }
}

let contents = readFile(`${ROOT_DIR}/easy-input.txt`);

console.log("==== PART 1 ====");
let chamber = new Chamber(contents);
chamber.rockFall(3);

//console.log("==== PART 2 ====");
