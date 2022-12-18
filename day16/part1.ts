import * as fs from "fs";

const ROOT_DIR="day16";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class Tunnel {
    name: string;
    flowRate: number;
    tunnels: string[];

    constructor(public line: string, public volcano: Volcano) {
        let regex = /Valve ([A-Z]{2}) has flow rate=([0-9]+); tunnel[s]? lead[s]? to valve[s]? (.*)/;
        let match = regex.exec(line);
        if (match) {
            this.name = match[1];
            this.flowRate = parseInt(match[2]);
            this.tunnels = match[3].split(",").map(tunnel => tunnel.trim());
        } else {
            throw new Error(`Unable to parse line: ${line}`);
        }
    }

    getTunnelsFromHere(): Tunnel[] {
        return this.tunnels.map(tunnelName => this.volcano.getTunnel(tunnelName));
    }
}

class Volcano {
    tunnels: Tunnel[];
    totalOpenableValves: number;
    solvedTunnels = new Map<string, number>();
    count = 0;

    constructor(public lines: string[]) {
        this.tunnels = lines.map(line => new Tunnel(line, this));
        this.totalOpenableValves = this.tunnels.filter(tunnel => tunnel.flowRate > 0).length;
    }

    getTunnel(name: string): Tunnel {
        return this.tunnels.find(tunnel => tunnel.name === name)!;
    }

    calculateMaxFlowFromHereAndNow(current: Tunnel, openValves: string[], time: number) {
        if (time === 0 || openValves.length === this.totalOpenableValves) return 0;
        this.count++;

        let key = `${current.name}${time}${openValves.join("")}`;
        if (this.solvedTunnels.has(key)) {
            //return this.solvedTunnels.get(key)!;
        }

        let totalFlowFromHereAndNow = 0;
        // open the current valve if it's not open already
        if (!openValves.includes(current.name) && current.flowRate > 0) {
            openValves.push(current.name);
            openValves.sort();
            totalFlowFromHereAndNow = ((time - 1) * current.flowRate) + this.calculateMaxFlowFromHereAndNow(current, openValves, time - 1);
        } 
        // move to next tunnel
        for (let tunnel of current.getTunnelsFromHere()) {
            let nextFlow = this.calculateMaxFlowFromHereAndNow(tunnel, openValves, time - 1);
            totalFlowFromHereAndNow = Math.max(totalFlowFromHereAndNow, nextFlow);
        }
        
        this.solvedTunnels.set(key, totalFlowFromHereAndNow);
        console.log(`${key} = ${totalFlowFromHereAndNow}`);
        return totalFlowFromHereAndNow;
    }
}

let contents = readFile(`${ROOT_DIR}/easy-input.txt`);
console.log("==== PART 1 ====");
let volcano = new Volcano(contents.split("\n"));
let maxPressure = volcano.calculateMaxFlowFromHereAndNow(volcano.getTunnel("AA"), [], 30);
console.log(`Max pressure: ${maxPressure}`);
console.log(`Count: ${volcano.count}`);

//console.log("==== PART 2 ====");
//contents = readFile(`${ROOT_DIR}/input.txt`);

