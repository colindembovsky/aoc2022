import * as fs from "fs";

const ROOT_DIR="day09";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class Knot {
    public follower: Knot | undefined;
    constructor(public x: number, public y: number, public id: number) {}

    equals(other: Knot) {
        return this.x === other.x && this.y === other.y;
    }
}

class Grid {
    public positionsTailVisited = new Set<string>();
    public headKnot: Knot;
    
    constructor(public instructions: string[], knotCount: number) {
        this.headKnot = new Knot(0, 0, 1);
        let curKnot = this.headKnot;
        for (let i = 1; i < knotCount; i++) {
            let knot = new Knot(0, 0, i + 1);
            curKnot.follower = knot;
            curKnot = knot;
        }
    }

    doMoves() {
        for (let line of this.instructions) {
            this.moveKnot(this.headKnot, line);
        }
        return this.positionsTailVisited.size;
    }

    moveKnot(knot: Knot, line: string) {
        let [dir, distStr] = line.split(" ");
        let dist = parseInt(distStr);
        for (let i = 0; i < dist; i++) {
            switch (dir) {
                case "U":
                    knot.y--;
                    break;
                case "D":
                    knot.y++;
                    break;
                case "L":
                    knot.x--;
                    break;
                case "R":
                    knot.x++;
                    break;
            }
            this.pullFollower(knot.follower!, knot.x, knot.y);
        }
    }
    
    pullFollower(knot: Knot, x: number, y: number) {
        let xDist = x - knot.x;
        let yDist = y - knot.y;

        if (!(Math.abs(xDist) < 2 && Math.abs(yDist) < 2)) {
            if (xDist > 0) {
                knot.x++;
            } else if (xDist < 0) {
                knot.x--;
            }
            if (yDist > 0) {
                knot.y++;
            } else if (yDist < 0) {
                knot.y--;
            }
        }

        if (knot.follower) {
            this.pullFollower(knot.follower, knot.x, knot.y);
        } else {
            this.positionsTailVisited.add(`${knot.x},${knot.y}`);
        }
    }
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let instructions = contents.split("\n");

console.log("==== PART 1 ====");
let grid = new Grid(instructions, 2);
console.log(grid.doMoves());

console.log("==== PART 2 ====");
let grid2 = new Grid(instructions, 10);
console.log(grid2.doMoves());
