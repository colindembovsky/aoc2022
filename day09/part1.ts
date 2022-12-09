import * as fs from "fs";

const ROOT_DIR="day09";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class Pos {
    constructor(public x: number, public y: number) {}

    equals(other: Pos) {
        return this.x === other.x && this.y === other.y;
    }
}

class Grid {
    public positionsTailVisited = new Set<string>();
    public headPos = new Pos(0, 0);
    public tailPos = new Pos(0, 0);
    
    constructor(public instructions: string[]) {
    }

    doMoves() {
        for (let line of this.instructions) {
            this.moveHead(line);
        }
        return this.positionsTailVisited.size;
    }

    moveHead(line: string) {
        let [dir, distStr] = line.split(" ");
        let dist = parseInt(distStr);
        for (let i = 0; i < dist; i++) {
            switch (dir) {
                case "U":
                    this.headPos.y--;
                    break;
                case "D":
                    this.headPos.y++;
                    break;
                case "L":
                    this.headPos.x--;
                    break;
                case "R":
                    this.headPos.x++;
                    break;
            }
            this.moveTailTowardsHead();
        }
    }
    
    moveTailTowardsHead() {
        // work out the distance in every direction
        let xDist = this.headPos.x - this.tailPos.x;
        let yDist = this.headPos.y - this.tailPos.y;

        if (!(Math.abs(xDist) < 2 && Math.abs(yDist) < 2)) {
            if (xDist > 0) {
                this.tailPos.x++;
            } else if (xDist < 0) {
                this.tailPos.x--;
            }
            if (yDist > 0) {
                this.tailPos.y++;
            } else if (yDist < 0) {
                this.tailPos.y--;
            }
        }

        this.positionsTailVisited.add(`${this.tailPos.x},${this.tailPos.y}`);
    }
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let instructions = contents.split("\n");

console.log("==== PART 1 ====");
let grid = new Grid(instructions);
console.log(grid.doMoves());

//console.log("==== PART 2 ====");
//contents = readFile(`${ROOT_DIR}/input.txt`);

