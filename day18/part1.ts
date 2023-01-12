import * as fs from "fs";

const ROOT_DIR="day18";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class Point {
    constructor(public x: number, public y: number, public z: number) {}

    plus(other: Point): Point {
        return new Point(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    minus(other: Point): Point {
        return new Point(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    equals(other: Point): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }
}

class Vector extends Point {
    static up = new Vector(new Point(0, 0, 1));
    static down = new Vector(new Point(0, 0, -1));
    static left = new Vector(new Point(-1, 0, 0));
    static right = new Vector(new Point(1, 0, 0));
    static forward = new Vector(new Point(0, 1, 0))
    static back = new Vector(new Point(0, -1, 0));

    constructor(direction: Point) {
        super(direction.x, direction.y, direction.z);
    }

    isOpposite(other: Vector): boolean {
        return this.x === -other.x && this.y === -other.y && this.z === -other.z;
    }

    getOpposite(): Vector {
        return new Vector(new Point(-this.x, -this.y, -this.z));
    }
}

class Face {
    constructor(public point: Point, public facing: Vector) {}
}

class Cube {
    static makeFromFace(oppositeFace: Face) {
        if (oppositeFace.facing.equals(Vector.left) ||
            oppositeFace.facing.equals(Vector.forward) ||
            oppositeFace.facing.equals(Vector.down)) {
            return new Cube(`${oppositeFace.point.x},${oppositeFace.point.y},${oppositeFace.point.z}`);
        }
        if (oppositeFace.facing.equals(Vector.right)) {
            return new Cube(`${oppositeFace.point.x - 1},${oppositeFace.point.y},${oppositeFace.point.z}`);
        }
        if (oppositeFace.facing.equals(Vector.up)) {
            return new Cube(`${oppositeFace.point.x},${oppositeFace.point.y},${oppositeFace.point.z - 1}`);
        }
        if (oppositeFace.facing.equals(Vector.back)) {
            return new Cube(`${oppositeFace.point.x},${oppositeFace.point.y - 1},${oppositeFace.point.z}`);
        }
        throw new Error("Invalid face");
    }

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
        this.faceRight = new Face(this.point.plus(Vector.right), Vector.right);
        this.faceTop = new Face(this.point.plus(Vector.up), Vector.up);
        this.faceBack = new Face(this.point.plus(Vector.back), Vector.back);
        
        this.faces = [this.faceLeft, this.faceRight, this.faceTop, this.faceBottom, this.faceFront, this.faceBack];
    }

    getNeighbors(): Cube[] {
        return [
            new Cube(`${this.point.x - 1},${this.point.y},${this.point.z}`),
            new Cube(`${this.point.x + 1},${this.point.y},${this.point.z}`),
            new Cube(`${this.point.x},${this.point.y - 1},${this.point.z}`),
            new Cube(`${this.point.x},${this.point.y + 1},${this.point.z}`),
            new Cube(`${this.point.x},${this.point.y},${this.point.z - 1}`),
            new Cube(`${this.point.x},${this.point.y},${this.point.z + 1}`)
        ];
    }
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let lines = contents.split("\n");
let cubes = lines.map(line => new Cube(line));

console.log("==== PART 1 ====");
let outsideFaces = cubes.map(cube => cube.faces).reduce((a, b) => a.concat(b));
for (let i = 0; i < outsideFaces.length; i++) {
    let face = outsideFaces[i];
    let oppositeFace = outsideFaces.find(f => f.point.equals(face.point) && f.facing.isOpposite(face.facing));
    if (oppositeFace) {
        outsideFaces.splice(outsideFaces.indexOf(oppositeFace), 1);
        outsideFaces.splice(outsideFaces.indexOf(face), 1);
        i--;
    }
}
console.log(outsideFaces.length);

console.log("==== PART 2 ====");

let minX = Math.min(...cubes.map(cube => cube.point.x));
let minY = Math.min(...cubes.map(cube => cube.point.y));
let minZ = Math.min(...cubes.map(cube => cube.point.z));
let maxX = Math.max(...cubes.map(cube => cube.point.x));
let maxY = Math.max(...cubes.map(cube => cube.point.y));
let maxZ = Math.max(...cubes.map(cube => cube.point.z));
let minCube = new Cube(`${minX},${minY},${minZ}`);

let visited = new Set<string>();
let surfaces = new Set<string>();
let filledAir = new Set<string>();

let queue = new Array<string>();
queue.push(minCube.name);
while(queue.length > 0) {
    let cube = new Cube(queue.pop()!);
    if (visited.has(cube.name)) {
        continue;
    }
    visited.add(cube.name);

    if (cube.point.x < minX - 2 || cube.point.x > maxX + 2 ||
        cube.point.y < minY - 2 || cube.point.y > maxY + 2 ||
        cube.point.z < minZ - 2 || cube.point.z > maxZ + 2) {
        continue;
    }

    let neighbors = cube.getNeighbors();
    let airNeighbors = neighbors.filter(c => !cubes.some(cb => cb.name === c.name));
    let cubeNeighbors = neighbors.filter(c => cubes.some(cb => cb.name === c.name));

    if (cubeNeighbors.length > 0) {
        cubeNeighbors.map(c => c.name).forEach(c => surfaces.add(c));
        filledAir.add(cube.name);
    }

    queue.push(...airNeighbors.map(c => c.name));
}

let outerSurface = 0;
for(let lava of surfaces) {
    let lavaCube = new Cube(lava);
    outerSurface += lavaCube.getNeighbors().filter(c => !cubes.some(cb => cb.name === c.name)).filter(c => filledAir.has(c.name)).length;
}
console.log(`Outer surface: ${outerSurface}`);