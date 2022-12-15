import * as fs from "fs";

const ROOT_DIR="day14";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}


let lines: Line[] = [];
let caveMap = new Map<string, string>();

class Point {
    index: string;
    constructor(public x: number, public y: number) {
        this.index = `${x}-${y}`;
    }

    downPoint(): Point {
        return new Point(this.x, this.y + 1);
    }

    downLeftPoint(): Point {
        return new Point(this.x - 1, this.y + 1);
    }

    downRightPoint(): Point {
        return new Point(this.x + 1, this.y + 1);
    }

    canMoveTo(pos: Point): boolean {
        if (caveMap.has(pos.index)) {
            return caveMap.get(pos.index) === ".";
        }
        for (let line of lines) {
            if (line.pointIsOnLine(pos)) {
                caveMap.set(pos.index, "#");
                return false;
            }
        }
        return true;
    }

    nextPoint(): Point | undefined {
        let downPoint = this.downPoint();
        if (this.canMoveTo(downPoint)) {
            return downPoint;
        }
        let downLeftPoint = this.downLeftPoint();
        if (this.canMoveTo(downLeftPoint)) {
            return downLeftPoint;
        }
        let downRightPoint = this.downRightPoint();
        if (this.canMoveTo(downRightPoint)) {
            return downRightPoint;
        }
        return undefined;
    }
}

class Line {
    constructor(public start: Point, public end: Point) { }

    pointIsOnLine(point: Point): boolean {
        let thisStartY = Math.min(this.start.y, this.end.y);
        let thisEndY = Math.max(this.start.y, this.end.y);
        if (point.y < thisStartY || point.y > thisEndY) {
            return false;
        }
        let thisStartX = Math.min(this.start.x, this.end.x);
        let thisEndX = Math.max(this.start.x, this.end.x);
        if (point.x < thisStartX || point.x > thisEndX) {
            return false;
        }
        return true;
    }
}

function parseLines(line: string) {
    let lines: Line[] = [];
    let points = line.split(" -> ");
    for (let i = 0; i < points.length - 1; i++) {
        let point1 = points[i];
        let point2 = points[i + 1];
        let point1Parts = point1.split(",");
        let point2Parts = point2.split(",");
        lines.push(new Line(new Point(parseInt(point1Parts[0]), parseInt(point1Parts[1])), new Point(parseInt(point2Parts[0]), parseInt(point2Parts[1]))));
    }
    return lines;
}

function printCave(start: Point, end: Point) {
    for (let y = start.y; y <= end.y; y++) {
        let line = "";
        for (let x = start.x; x <= end.x; x++) {
            let point = new Point(x, y);
            if (caveMap.has(point.index)) {
                line += caveMap.get(point.index);
            } else {
                line += ".";
            }
        }
        console.log(line);
    }
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let lineStrings = contents.split("\n");

for (let line of lineStrings) {
    lines = lines.concat(parseLines(line));
}
let startPoint = new Point(500, 0);
let fullPoints = [startPoint.downPoint(), startPoint.downLeftPoint(), startPoint.downRightPoint()];
let highestY = lines.sort((a, b) => b.start.y - a.start.y)[0].start.y;

console.log("==== PART 1 ====");
let finished = false;
let grainCount = -1;
while (!finished) {
    grainCount++;
    let grain = new Point(startPoint.x, startPoint.y);
    while (true) {
        let newPos = grain.nextPoint();
        if (newPos === undefined) {
            caveMap.set(grain.index, "o");
            break;
        }
        if (newPos.y > highestY) {
            finished = true;
            break;
        }
        grain = newPos;
    }
}
console.log(`Grain Count: ${grainCount}`);

console.log("==== PART 2 ====");
console.log("Be patient, this takes a while...");
let xSorted = lines.sort((a, b) => a.start.x - b.start.x);
let floorLine = new Line(new Point(xSorted[0].start.x - 10000, highestY + 2), new Point(xSorted[lines.length - 1].start.x + 10000, highestY + 2));
lines.push(floorLine);

caveMap.clear();
finished = false;
grainCount = 1;
while (!finished) {
    grainCount++;
    let grain = new Point(startPoint.x, startPoint.y);
    while (true) {
        let newPos = grain.nextPoint();
        if (newPos === undefined) {
            caveMap.set(grain.index, "o");
            finished = fullPoints.every(p => caveMap.get(p.index) === "o");
            break;
        }
        grain = newPos;
    }
}
console.log(`Grain Count: ${grainCount}`);