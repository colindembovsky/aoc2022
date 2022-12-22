import * as fs from "fs";

const ROOT_DIR="day18";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class Point {
    constructor(public x: number, public y: number, public z: number) {}

    getPointPlusX(): Point {
        return new Point(this.x + 1, this.y, this.z);
    }

    getPointPlusY(): Point {
        return new Point(this.x, this.y + 1, this.z);
    }

    getPointPlusZ(): Point {
        return new Point(this.x, this.y, this.z + 1);
    }

    getPointMinusX(): Point {
        return new Point(this.x - 1, this.y, this.z);
    }

    getPointMinusY(): Point {
        return new Point(this.x, this.y - 1, this.z);
    }

    getPointMinusZ(): Point {
        return new Point(this.x, this.y, this.z - 1);
    }

    equals(other: Point): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }
}

class Vector {
    static up = new Vector(new Point(0, 0, 0), new Point(0, 0, 1));
    static down = new Vector(new Point(0, 0, 0), new Point(0, 0, -1));
    static left = new Vector(new Point(0, 0, 0), new Point(-1, 0, 0));
    static right = new Vector(new Point(0, 0, 0), new Point(1, 0, 0));
    static forward = new Vector(new Point(0, 0, 0), new Point(0, 1, 0));
    static back = new Vector(new Point(0, 0, 0), new Point(0, -1, 0));

    constructor(public origin: Point, public direction: Point) {}

    isOpposite(other: Vector): boolean {
        return this.origin.equals(other.origin) && 
            this.direction.x === -other.direction.x && 
            this.direction.y === -other.direction.y && 
            this.direction.z === -other.direction.z;
    }
}

class Face {
    constructor(public point: Point, public facing: Vector) {}
}

class Cube {
    point: Point;
    faceLeft: Face;
    faceRight: Face;
    faceTop: Face;
    faceBottom: Face;
    faceFront: Face;
    faceBack: Face;
    faces: Face[];
    
    constructor(public name: string) {
        let [x,y,z] = name.split(",").map(Number);
        this.point = new Point(x, y, z);
        this.faceLeft = new Face(this.point, Vector.left);
        this.faceBottom = new Face(this.point, Vector.down);
        this.faceFront = new Face(this.point, Vector.forward);
        this.faceRight = new Face(this.point.getPointPlusX(), Vector.right);
        this.faceTop = new Face(this.point.getPointPlusZ(), Vector.up);
        this.faceBack = new Face(this.point.getPointPlusY(), Vector.back);
        
        this.faces = [this.faceLeft, this.faceRight, this.faceTop, this.faceBottom, this.faceFront, this.faceBack];
    }

    hasAdjacentFaces(other: Cube): boolean {
        return this.point.equals(other.point) ||
            this.point.getPointPlusX().equals(other.point) ||
            this.point.getPointPlusY().equals(other.point) ||
            this.point.getPointPlusZ().equals(other.point) ||
            this.point.getPointMinusX().equals(other.point) ||
            this.point.getPointMinusY().equals(other.point) ||
            this.point.getPointMinusZ().equals(other.point);
    }
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let lines = contents.split("\n");
let cubes = lines.map(line => new Cube(line));

console.log("==== PART 1 ====");
let allFaces = cubes.map(cube => cube.faces).reduce((a, b) => a.concat(b));
// remove all faces where point is the same and facing is opposite
for (let i = 0; i < allFaces.length; i++) {
    let face = allFaces[i];
    let oppositeFace = allFaces.find(f => f.point.equals(face.point) && f.facing.isOpposite(face.facing));
    if (oppositeFace) {
        allFaces.splice(allFaces.indexOf(oppositeFace), 1);
        allFaces.splice(allFaces.indexOf(face), 1);
        i--;
    }
}
console.log(allFaces.length);

console.log("==== PART 2 ====");