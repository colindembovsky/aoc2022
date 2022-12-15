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

    addPointsWithinManhattanDistanceOnLine(lineY: number, set: Set<string>) {
        const startX = this.location.x - this.manhattanToClosestBeacon;
        const endX = this.location.x + this.manhattanToClosestBeacon;
        for (let x = startX; x <= endX; x++) {
            const point = new Point(x, lineY);
            if (point.manhattanDistance(this.location) <= this.manhattanToClosestBeacon) {
                set.add(point.index);
            }
        }
    }
}

let contents = readFile(`${ROOT_DIR}/easy-input.txt`);
let lineY = 10;

// let contents = readFile(`${ROOT_DIR}/input.txt`);
// let lineY = 2000000;
// console.log("be patient - this takes a while...");

let sensors: Sensor[] = contents.split("\n").map(line => new Sensor(line));

console.log("==== PART 1 ====");
let manhattanPointsSet = new Set<string>();
sensors.forEach(sensor => {
    sensor.addPointsWithinManhattanDistanceOnLine(lineY, manhattanPointsSet);
});
let beacons = new Set<string>();
sensors.forEach(sensor => beacons.add(sensor.closestBeacon.index));

// get the difference of sets
let pointsNotBeacons = new Set([...manhattanPointsSet].filter(x => !beacons.has(x)));
console.log([...pointsNotBeacons].length);

//console.log("==== PART 2 ====");

