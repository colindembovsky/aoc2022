import * as fs from "fs";

const ROOT_DIR="day19";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

enum MaterialType {
    ORE = 0,
    CLAY = 1,
    OBSIDIAN = 2,
    GEODE = 3,
};

class State {
    constructor(public robots = [1, 0, 0, 0], public materials = [0, 0, 0, 0]) {}

    mine() {
        for (let i = 0; i < this.robots.length; i++) {
            this.materials[i] += this.robots[i];
        }
    }

    getKey(min: number) {
        return `${min}${this.robots.join("")}${this.materials.join("")}`;
    }
}

class BluePrint {
    id: number = 0;

    oreRobotCost: number = 0;
    clayRobotCost: number = 0;
    obsidianRobotCost: number[] = [0, 0];
    geodeRobotCost: number[] = [0, 0];

    stateCache: Map<string, number> = new Map();
    cacheHits: number = 0;

    constructor(public blueprint: string) {
        // parse string using regex with format: "Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian."
        let regex = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./;
        let matches = regex.exec(this.blueprint);
        if (matches === null) {
            throw new Error("Invalid blueprint string");
        }

        this.id = parseInt(matches[1]);
        this.oreRobotCost = parseInt(matches[2]);
        this.clayRobotCost = parseInt(matches[3]);
        this.obsidianRobotCost[0] = parseInt(matches[4]);
        this.obsidianRobotCost[1] = parseInt(matches[5]);
        this.geodeRobotCost[0] = parseInt(matches[6]);
        this.geodeRobotCost[1] = parseInt(matches[7]);
    }

    calcQuality() {
        let maxGeodes = this.mine(24, new State());
        console.log(`cache hits: ${this.cacheHits}`);
        console.log(`cache size: ${this.stateCache.size}`);
        return maxGeodes * this.id;
    }

    mine(minutesLeft: number, state: State) {
        if (minutesLeft === 0) return 0;

        let key = state.getKey(minutesLeft);
        if (this.stateCache.has(key)) {
            //console.log(`cache hit for ${key}`);
            this.cacheHits++;
            return this.stateCache.get(key)!;
        }
        
        let statesFromHere = this.getNextPossibleStates(state);
        state.mine();
        statesFromHere.push(state);
        
        let maxGeodes = state.materials[MaterialType.GEODE];
        statesFromHere.forEach(nextState => {
            let maxNextGeodes = this.mine(minutesLeft - 1, nextState);
            maxGeodes = Math.max(maxGeodes, maxNextGeodes);
        });

        if (this.stateCache.size % 500000 === 0) {
            console.log(`cache size: ${this.stateCache.size}`);
        }
        this.stateCache.set(key, maxGeodes);
        return maxGeodes;
    }

    getNextPossibleStates(state: State) {
        let nextStates = [];
        if (state.materials[MaterialType.ORE] >= this.geodeRobotCost[0] && 
            state.materials[MaterialType.OBSIDIAN] >= this.geodeRobotCost[1]) {
            let newState = new State(state.robots.slice(), state.materials.slice());
            newState.materials[MaterialType.ORE] -= this.geodeRobotCost[0];
            newState.materials[MaterialType.OBSIDIAN] -= this.geodeRobotCost[1];
            newState.mine();
            newState.robots[MaterialType.GEODE] += 1;
            nextStates.push(newState);
        }
        if (state.materials[MaterialType.ORE] >= this.obsidianRobotCost[0] && 
            state.materials[MaterialType.CLAY] >= this.obsidianRobotCost[1]) {
            let newState = new State(state.robots.slice(), state.materials.slice());
            newState.materials[MaterialType.ORE] -= this.obsidianRobotCost[0];
            newState.materials[MaterialType.CLAY] -= this.obsidianRobotCost[1];
            newState.mine();
            newState.robots[MaterialType.OBSIDIAN] += 1;
            nextStates.push(newState);
        }
        if (state.materials[MaterialType.ORE] >= this.clayRobotCost) {
            let newState = new State(state.robots.slice(), state.materials.slice());
            newState.materials[MaterialType.ORE] -= this.clayRobotCost;
            newState.mine();
            newState.robots[MaterialType.CLAY] += 1;
            nextStates.push(newState);
        }
        if (state.materials[MaterialType.ORE] >= this.oreRobotCost) {
            let newState = new State(state.robots.slice(), state.materials.slice());
            newState.materials[MaterialType.ORE] -= this.oreRobotCost;
            newState.mine();
            newState.robots[MaterialType.ORE] += 1;
            nextStates.push(newState);
        }
        
        return nextStates;
    }
}

let contents = readFile(`${ROOT_DIR}/easy-input.txt`);
let lines = contents.split("\n");
let blueprints = lines.map(line => new BluePrint(line));

console.log("==== PART 1 ====");
let totalQuality = 0;
blueprints.forEach(blueprint => {
    let q = blueprint.calcQuality();
    console.log(`Blueprint ${blueprint.id} has quality ${q}`);
    totalQuality += q;
});
console.log(`Total quality: ${totalQuality}`);

console.log("==== PART 2 ====");

