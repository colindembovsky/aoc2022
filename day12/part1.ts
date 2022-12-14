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
    public end: Point;
    
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
        this.end = this.getEnd();
    }

    getPoint(row: number, col: number): Point {
        if (row >= 0 && row < this.points.length && col >= 0 && col < this.points[row].length) {
            return this.points[row][col];
        }
        throw new Error(`Invalid point: ${row}, ${col}`);
    }

    getPointWithValue(val: string) {
        for (let startRow = 0; startRow < this.length; startRow++) {
            for(let startCol = 0; startCol < this.width; startCol++) {
                let p = this.getPoint(startRow, startCol);
                if (p.height === val) {
                    return p;
                }
            }
        }
        throw new Error(`No point with value ${val}`);
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
        let distanceMap = new Map<string, number>();
        let visited: Set<string> = new Set<string>();
        let distance = 0;
        while (queue.length > 0) {
            let nextQueue: Point[] = [];
            for (let point of queue) {
                distanceMap.set(point.index, distance);
                if (visited.has(point.index)) continue;
                visited.add(point.index);

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
            //console.log(`Distance: ${distance}, Queue: ${queue.length}`);
        }

        return distanceMap.get(this.end.index);
    }

    getAllStarts() {
        let points: Point[] = [];
        for (let row = 0; row < this.length; row++) {
            for (let col = 0; col < this.width; col++) {
                let point = this.getPoint(row, col);
                if (point.height === "a") {
                    points.push(point);
                }
            }
        }
        points.unshift(this.getStart());
        return points;
    }

    swapStart(p: Point) {
        this.getStart().height = "a";
        this.points[p.row][p.col].height = "S";
    }
}

class Point {
    public index: string;
    constructor(public height: string, public row: number, public col: number, private grid: Grid) {
        this.index = `${row}-${col}`;
    }

    moveTo(row: number, col: number): Point | undefined {
        let p = this.grid.getPoint(row, col);
        return (p.height === "E" && (this.height === "y" || this.height === "z")) || 
            (this.height === "S" && (p.height === "a" || p.height === "b")) ||
            p.height.charCodeAt(0) - this.height.charCodeAt(0) <= 1 ? p : undefined;
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

let contents = readFile(`${ROOT_DIR}/input.txt`);
let grid = new Grid(contents.split("\n"));

console.log("==== PART 1 ====");
console.log(`Min steps to end is ${grid.traverse()} steps`);

console.log("==== PART 2 ====");
let startPoints = grid.getAllStarts();
let minDistance = Number.MAX_SAFE_INTEGER;
for (let p of startPoints) {
    grid.swapStart(p);
    let distance = grid.traverse();
    if (distance && distance < minDistance) {
        minDistance = distance!;
    }
}
console.log(`Min steps from all starts is ${minDistance} steps`);