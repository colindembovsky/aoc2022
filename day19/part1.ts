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
        return  min                               * 100000000 +
            this.materials[MaterialType.ORE]      * 10000000 +
            this.materials[MaterialType.CLAY]     * 1000000 +
            this.materials[MaterialType.OBSIDIAN] * 100000 +
            this.materials[MaterialType.GEODE]    * 10000 +
            this.robots[MaterialType.ORE]         * 1000 +
            this.robots[MaterialType.CLAY]        * 100 +
            this.robots[MaterialType.OBSIDIAN]    * 10 +
            this.robots[MaterialType.GEODE];
    }
}

class BluePrint {
    id: number = 0;

    oreRobotCost: number = 0;
    clayRobotCost: number = 0;
    obsidianRobotCost: number[] = [0, 0];
    geodeRobotCost: number[] = [0, 0];

    stateCache: Map<number, number> = new Map();
    stateCache2: Map<number, number> = new Map();
    stateCache3: Map<number, number> = new Map();
    stateCache4: Map<number, number> = new Map();
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
        return this.calcMaxGeodes(24) * this.id;
    }

    calcMaxGeodes(mins: number) {
        return this.mine(mins, new State());
    }

    mine(minutesLeft: number, state: State) {
        if (minutesLeft === 0) return 0;

        let key = state.getKey(minutesLeft);
        if (this.stateCache.has(key)) {
            //console.log(`cache hit for ${key}`);
            this.cacheHits++;
            return this.stateCache.get(key)!;
        } else if (this.stateCache2.has(key)) {
            //console.log(`cache hit for ${key}`);
            this.cacheHits++;
            return this.stateCache2.get(key)!;
        } else if (this.stateCache3.has(key)) {
            //console.log(`cache hit for ${key}`);
            this.cacheHits++;
            return this.stateCache3.get(key)!;
        } else if (this.stateCache4.has(key)) {
            //console.log(`cache hit for ${key}`);
            this.cacheHits++;
            return this.stateCache4.get(key)!;
        }
        
        let statesFromHere = this.getNextPossibleStates(state, minutesLeft);
        state.mine();
        statesFromHere.push(state);
        
        let maxGeodes = state.materials[MaterialType.GEODE];
        statesFromHere.forEach(nextState => {
            let maxNextGeodes = this.mine(minutesLeft - 1, nextState);
            maxGeodes = Math.max(maxGeodes, maxNextGeodes);
        });

        if (this.stateCache.size % 500000 === 0 && this.stateCache2.size % 500000 === 0 && this.stateCache3.size % 500000 === 0 &&
            this.stateCache4.size % 500000 === 0) {
            console.log(`cache size: ${this.stateCache.size + this.stateCache2.size + + this.stateCache3.size + this.stateCache4.size}`);
        }
        if (this.stateCache.size < 16500000) {
            this.stateCache.set(key, maxGeodes);
        } else if (this.stateCache2.size < 16500000) {
            this.stateCache2.set(key, maxGeodes);
        } else if (this.stateCache3.size < 16500000) {
            this.stateCache3.set(key, maxGeodes);
        } else {
            this.stateCache4.set(key, maxGeodes);
        }
        return maxGeodes;
    }

    getNextPossibleStates(state: State, minutesLeft: number) {
        let nextStates = [];

        if (state.materials[MaterialType.ORE] >= this.geodeRobotCost[0] && 
            state.materials[MaterialType.OBSIDIAN] >= this.geodeRobotCost[1]) 
        {
            let newState = new State(state.robots.slice(), state.materials.slice());
            newState.materials[MaterialType.ORE] -= this.geodeRobotCost[0];
            newState.materials[MaterialType.OBSIDIAN] -= this.geodeRobotCost[1];
            newState.mine();
            newState.robots[MaterialType.GEODE] += 1;
            nextStates.push(newState);
        } 
        else {
            // work out max useful ore, clay and obsidian
            const buyObsidianRobot = state.materials[MaterialType.OBSIDIAN] < minutesLeft * this.geodeRobotCost[1];
            const buyClayRobot = state.materials[MaterialType.CLAY] < minutesLeft * this.obsidianRobotCost[1];
            const buyOreRobot = state.materials[MaterialType.ORE] < Math.max(minutesLeft * this.obsidianRobotCost[0], 
                minutesLeft * this.geodeRobotCost[0]);
            
            if (buyObsidianRobot && 
                state.materials[MaterialType.ORE] >= this.obsidianRobotCost[0] && 
                state.materials[MaterialType.CLAY] >= this.obsidianRobotCost[1]) 
            {
                let newState = new State(state.robots.slice(), state.materials.slice());
                newState.materials[MaterialType.ORE] -= this.obsidianRobotCost[0];
                newState.materials[MaterialType.CLAY] -= this.obsidianRobotCost[1];
                newState.mine();
                newState.robots[MaterialType.OBSIDIAN] += 1;
                nextStates.push(newState);
            }

            if (buyClayRobot && state.materials[MaterialType.ORE] >= this.clayRobotCost) 
            {
                let newState = new State(state.robots.slice(), state.materials.slice());
                newState.materials[MaterialType.ORE] -= this.clayRobotCost;
                newState.mine();
                newState.robots[MaterialType.CLAY] += 1;
                nextStates.push(newState);
            }

            if (buyOreRobot && state.materials[MaterialType.ORE] >= this.oreRobotCost) {
                let newState = new State(state.robots.slice(), state.materials.slice());
                newState.materials[MaterialType.ORE] -= this.oreRobotCost;
                newState.mine();
                newState.robots[MaterialType.ORE] += 1;
                nextStates.push(newState);
            }
        }
        
        return nextStates;
    }
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let lines = contents.split("\n");
let blueprints = lines.map(line => new BluePrint(line));

console.log("==== PART 1 ====");
let totalQuality = 0;
for (let i = 0; i < blueprints.length; i++) {
    let q = blueprints[i].calcQuality();
    console.log(`Blueprint ${blueprints[i].id} has quality ${q}`);
    totalQuality += q;
    delete blueprints[i];
};
console.log(`Total quality: ${totalQuality}`);

console.log("==== PART 2 ====");
blueprints = lines.slice(0, 3).map(line => new BluePrint(line));
let totalGeodes = 1;
for (let i = 0; i < blueprints.length; i++) {
    let g = blueprints[i].calcMaxGeodes(32);
    console.log(`Blueprint ${blueprints[i].id} produces ${g} geodes`);
    totalGeodes *= g;
    delete blueprints[i];
};
console.log(`Total geodes: ${totalGeodes}`);