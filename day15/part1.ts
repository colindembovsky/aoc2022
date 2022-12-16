import * as fs from "fs";

const ROOT_DIR="day15";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class Point {
    index: string;
    constructor(public x: number, public y: number) {
        this.index = `${x},${y}`;
    }

    manhattanDistance(other: Point): number {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }
}

class Sensor {
    location: Point;
    closestBeacon: Point;
    manhattanToClosestBeacon: number;

    constructor(info: string) {
        // parse regex for 'Sensor at x=2, y=18: closest beacon is at x=-2, y=15'
        const regex = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;
        const match = regex.exec(info);
        if (match) {
            this.location = new Point(parseInt(match[1]), parseInt(match[2]));
            this.closestBeacon = new Point(parseInt(match[3]), parseInt(match[4]));
            this.manhattanToClosestBeacon = this.location.manhattanDistance(this.closestBeacon);
        } else {
            throw new Error(`Could not parse sensor info: ${info}`);
        }
    }

    // get all the points that are within the manhattan distance from the sensor
    getPointsWithinManhattanDistance(): Point[] {
        const points: Point[] = [];
        const startX = this.location.x - this.manhattanToClosestBeacon;
        const endX = this.location.x + this.manhattanToClosestBeacon;
        const startY = this.location.y - this.manhattanToClosestBeacon;
        const endY = this.location.y + this.manhattanToClosestBeacon;
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const point = new Point(x, y);
                if (point.manhattanDistance(this.location) <= this.manhattanToClosestBeacon) {
                    points.push(point);
                }
            }
        }
        return points;
    }

    addPointsWithinManhattanDistanceOnHLine(lineY: number, set: Set<string>, minX: number = -Infinity, maxX: number = Infinity) {
        const startX = Math.max(minX, this.location.x - this.manhattanToClosestBeacon);
        const endX = Math.min(maxX, this.location.x + this.manhattanToClosestBeacon);
        for (let x = startX; x <= endX; x++) {
            const point = new Point(x, lineY);
            if (point.manhattanDistance(this.location) <= this.manhattanToClosestBeacon) {
                set.add(point.index);
            }
        }
    }

    addPointsWithinManhattanDistanceOnVLine(lineX: number, set: Set<string>, minY: number = -Infinity, maxY: number = Infinity) {
        const startY = Math.max(minY, this.location.y - this.manhattanToClosestBeacon);
        const endY = Math.min(maxY, this.location.y + this.manhattanToClosestBeacon);
        for (let y = startY; y <= endY; y++) {
            const point = new Point(lineX, y);
            if (point.manhattanDistance(this.location) <= this.manhattanToClosestBeacon) {
                set.add(point.index);
            }
        }
    }

    getPointsOutsideManhattanDistance(): Set<string> {
        const points = new Set<string>();
        const startX = this.location.x - this.manhattanToClosestBeacon - 1;
        const endX = this.location.x + this.manhattanToClosestBeacon + 1;
        for (let c = 0; c <= this.manhattanToClosestBeacon; c++) {
            let p1 = new Point(startX + c, this.location.y + c);
            let p2 = new Point(startX + c, this.location.y - c);
            let p3 = new Point(endX - c, this.location.y + c);
            let p4 = new Point(endX - c, this.location.y - c);
            if (this.pointIsValid(p1)) points.add(p1.index);
            if (this.pointIsValid(p2)) points.add(p2.index);
            if (this.pointIsValid(p3)) points.add(p3.index);
            if (this.pointIsValid(p4)) points.add(p4.index);
        }
        return points;
    }

    pointIsValid(point: Point): boolean {
        if (point.x >= 0 && point.y >= 0 && point.x <= MAX && point.y <= MAX) {
            let valid = true;
            sensors.forEach(sensor => {
                if (sensor.isWithinManhattanDistance(point)) {
                    valid = false;
                }
            });
            return valid;
        }
        return false;
    }

    isWithinManhattanDistance(point: Point): boolean {
        return point.manhattanDistance(this.location) <= this.manhattanToClosestBeacon;
    }
}

let easy = false;

let halfwayLine = easy ? 10 : 2000000;
let MAX = easy ? 20 : 4000000;

let manhattanPointsHorizontalSet = new Set<string>();
let manhattanPointsVerticalSet = new Set<string>();
let contents = readFile(`${ROOT_DIR}/${easy ? "easy-" : ""}input.txt`);

let sensors: Sensor[] = contents.split("\n").map(line => new Sensor(line));

console.log("==== PART 1 ====");

sensors.forEach(sensor => {
    sensor.addPointsWithinManhattanDistanceOnHLine(halfwayLine, manhattanPointsHorizontalSet);
});
let beacons = new Set<string>();
sensors.forEach(sensor => beacons.add(sensor.closestBeacon.index));

// get the difference of sets
let pointsNotBeacons = new Set([...manhattanPointsHorizontalSet].filter(x => !beacons.has(x)));
console.log([...pointsNotBeacons].length);

console.log("==== PART 2 ====");

// get the points that are outside the manhattan distance
let pointsOutsideManhattanDistance = new Set<string>();
sensors.forEach(sensor => {
    sensor.getPointsOutsideManhattanDistance().forEach(point => {
        let p = new Point(parseInt(point.split(",")[0]), parseInt(point.split(",")[1]));
        if (p.x >= 0 && p.x <= MAX && p.y >= 0 && p.y <= MAX) {
            pointsOutsideManhattanDistance.add(point);
        }
    });
});

// get first element of pointsOutsideManhattanDistance
let p = [...pointsOutsideManhattanDistance][0];
let pX = parseInt(p.split(",")[0]);
let pY = parseInt(p.split(",")[1]);
let res = pX * 4000000 + pY;
console.log(res);