import { group } from "console";
import * as fs from "fs";

const ROOT_DIR="day12";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class Grid {
    public points: Point[][];
    public length: number = -1;
    public width: number = -1;
    public distanceMap: Map<string, number> = new Map<string, number>();

    constructor(public map: string[]) {
        this.points = [];
        for (let row = 0; row < map.length; row++) {
            let line = map[row];
            let points: Point[] = [];
            line.split("").forEach((height, col) => points.push(new Point(height, row, col, this)));
            this.points.push(points);
        }
        this.length = this.points.length;
        this.width = this.points[0].length;
    }

    getPoint(row: number, col: number): Point {
        if (row >= 0 && row < this.points.length && col >= 0 && col < this.points[row].length) {
            return this.points[row][col];
        }
        throw new Error(`Invalid point: ${row}, ${col}`);
    }

    getPointWithValue(val: string) {
        let startCol = 0;
        let startRow = 0
        for (; startRow < this.length; startRow++) {
            startCol = this.map[startRow].indexOf(val);
            if (startCol >= 0) {
               break;
            }
        }
        return this.getPoint(startRow, startCol);
    }

    getStart() {
        return this.getPointWithValue("S");
    }

    getEnd() {
        return this.getPointWithValue("E");
    }

    traverse() {
        let start = this.getStart();
        let queue: Point[] = [start];
        let visited: Set<string> = new Set<string>();
        let distance = 0;
        while (queue.length > 0) {
            let nextQueue: Point[] = [];
            for (let point of queue) {
                if (visited.has(point.index)) continue;
                visited.add(point.index);
                let curDistance = this.distanceMap.get(point.index) ?? Infinity;
                this.distanceMap.set(point.index, Math.min(distance, curDistance));

                let up = point.up();
                if (up) nextQueue.push(up);
                let down = point.down();
                if (down) nextQueue.push(down);
                let left = point.left();
                if (left) nextQueue.push(left);
                let right = point.right();
                if (right) nextQueue.push(right);
            }
            queue = nextQueue;
            distance++;
        }

        let end = this.getEnd();
        return this.distanceMap.get(end.index);
    }
}

class Point {
    public index: string;
    constructor(public height: string, public row: number, public col: number, private grid: Grid) {
        this.index = `${row}-${col}`;
    }

    moveTo(row: number, col: number): Point | undefined {
        let p = this.grid.getPoint(row, col);
        return p.height === "E" && (this.height === "z" || this.height === "y") || 
            this.height === "S" ||
            Math.abs(p.height.charCodeAt(0) - this.height.charCodeAt(0)) <= 1 ? p : undefined;
    }
    
    up(): Point | undefined {
        if (this.row > 0) {
            return this.moveTo(this.row - 1, this.col);
        }
        return undefined;
    }

    down(): Point | undefined {
        if (this.row < this.grid.length - 1) {
            return this.moveTo(this.row + 1, this.col);
        }
        return undefined;
    }

    left(): Point | undefined {
        if (this.col > 0) {
            return this.moveTo(this.row, this.col - 1);
        }
        return undefined;
    }

    right(): Point | undefined {
        if (this.col < this.grid.width - 1) {
            return this.moveTo(this.row, this.col + 1);
        }
        return undefined;
    }
}

let contents = readFile(`${ROOT_DIR}/easy-input.txt`);
let grid = new Grid(contents.split("\n"));

console.log("==== PART 1 ====");
console.log(`Min distance to end is ${grid.traverse()} steps`);


console.log("==== PART 2 ====");
//contents = readFile(`${ROOT_DIR}/input.txt`);

