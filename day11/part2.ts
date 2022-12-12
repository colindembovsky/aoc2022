import { testMonkeys, realMonkeys } from "./Monkey";

console.log("==== PART 2 ====");
let monkeys = testMonkeys;

for (let i = 0; i < 20; i++) {
    monkeys.forEach(monkey => {
        monkey.playRound();
    });
}
monkeys.sort((a, b) => b.inspectCount - a.inspectCount);
// get top 2 items
console.log(`Top 2 monkeys: ${monkeys[0].name} (${monkeys[0].inspectCount}) and ${monkeys[1].name} (${monkeys[1].inspectCount}): total ${monkeys[0].inspectCount * monkeys[1].inspectCount}`);
