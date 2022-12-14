export class Monkey {
    public trueMonkey: Monkey | undefined = undefined;
    public falseMonkey: Monkey | undefined = undefined;
    public inspectCount = 0;

    constructor(
        public name: string, 
        public items: number[], 
        private op: (x: number) => number, 
        private testDiv: number, 
        private maxDivisor: number = Number.MAX_SAFE_INTEGER) {
    }

    playRound(worryManager: number) {
        while(this.items.length > 0) {
            this.inspectCount++;
            let worry = Math.floor(this.op(this.items.shift()!) / worryManager) % this.maxDivisor;
            if (worry % this.testDiv === 0) {
                this.trueMonkey!.items.push(worry);
            } else {
                this.falseMonkey!.items.push(worry);
            }
        };
    }
}

// part 1
let maxDivisor = 23 * 19 * 13 * 17;
let testMonkey0 = new Monkey("monkey 0", [79, 98],          (x: number) => x * 19,  23, maxDivisor);
let testMonkey1 = new Monkey("monkey 1", [54, 65, 75, 74],  (x: number) => x + 6,   19, maxDivisor);
let testMonkey2 = new Monkey("monkey 2", [79, 60, 97],      (x: number) => x * x,   13, maxDivisor);
let testMonkey3 = new Monkey("monkey 3", [74],              (x: number) => x + 3,   17, maxDivisor);

testMonkey0.trueMonkey  = testMonkey2;
testMonkey0.falseMonkey = testMonkey3;

testMonkey1.trueMonkey  = testMonkey2;
testMonkey1.falseMonkey = testMonkey0;

testMonkey2.trueMonkey  = testMonkey1;
testMonkey2.falseMonkey = testMonkey3;

testMonkey3.trueMonkey  = testMonkey0;
testMonkey3.falseMonkey = testMonkey1;

let testMonkeys = [testMonkey0, testMonkey1, testMonkey2, testMonkey3];

// part 2
maxDivisor = 13 * 7 * 19 * 2 * 5 * 3 * 11 * 17;
let realMonkey0 = new Monkey("monkey 0", [52, 60, 85, 69, 75, 75],            (x: number) => x * 17,  13, maxDivisor);
let realMonkey1 = new Monkey("monkey 1", [96, 82, 61, 99, 82, 84, 85],        (x: number) => x + 8,   7 , maxDivisor);
let realMonkey2 = new Monkey("monkey 2", [95, 79],                            (x: number) => x + 6,   19, maxDivisor);
let realMonkey3 = new Monkey("monkey 3", [88, 50, 82, 65, 77],                (x: number) => x * 19,  2 , maxDivisor);
let realMonkey4 = new Monkey("monkey 4", [66, 90, 59, 90, 87, 63, 53, 88],    (x: number) => x + 7,   5 , maxDivisor);
let realMonkey5 = new Monkey("monkey 5", [92, 75, 62],                        (x: number) => x * x,   3 , maxDivisor);
let realMonkey6 = new Monkey("monkey 6", [94, 86, 76, 67],                    (x: number) => x + 1,   11, maxDivisor);
let realMonkey7 = new Monkey("monkey 7", [57],                                (x: number) => x + 2,   17, maxDivisor);

realMonkey0.trueMonkey  = realMonkey6;
realMonkey0.falseMonkey = realMonkey7;

realMonkey1.trueMonkey  = realMonkey0;
realMonkey1.falseMonkey = realMonkey7;

realMonkey2.trueMonkey  = realMonkey5;
realMonkey2.falseMonkey = realMonkey3;

realMonkey3.trueMonkey  = realMonkey4;
realMonkey3.falseMonkey = realMonkey1;

realMonkey4.trueMonkey  = realMonkey1;
realMonkey4.falseMonkey = realMonkey0;

realMonkey5.trueMonkey  = realMonkey3;
realMonkey5.falseMonkey = realMonkey4;

realMonkey6.trueMonkey  = realMonkey5;
realMonkey6.falseMonkey = realMonkey2;

realMonkey7.trueMonkey  = realMonkey6;
realMonkey7.falseMonkey = realMonkey2;

let realMonkeys = [realMonkey0, realMonkey1, realMonkey2, realMonkey3, realMonkey4, realMonkey5, realMonkey6, realMonkey7];

export {
    testMonkeys,
    realMonkeys
}