import * as fs from "fs";

const ROOT_DIR="day22";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile(`${ROOT_DIR}/input.txt`);
let mapLines = contents.split("\n");
let instructions = mapLines.pop()!;
mapLines.pop();  // remove the blank line

let curRow = 0;
let curCol = 0;
let curDir = "r";  // "l", "u", "d"
let curInstructionIndex = 0;

function turnLeft() {
    if (curDir === "r") {
        curDir = "u";
    } else if (curDir === "u") {
        curDir = "l";
    } else if (curDir === "l") {
        curDir = "d";
    } else {
        curDir = "r";
    }
}

function turnRight() {
    if (curDir === "r") {
        curDir = "d";
    } else if (curDir === "d") {
        curDir = "l";
    } else if (curDir === "l") {
        curDir = "u";
    } else {
        curDir = "r";
    }
}

function moveForward(count: number) {
    if (curDir === "r") {
        for(let m = 0; m < count; m++) {
            // deal with wrap around
            if (curCol === mapLines[curRow].length - 1) {
                let tmpCurCol = 0;
                while(mapLines[curRow][tmpCurCol] === " ") {
                    tmpCurCol++;
                }
                // wrap to wall
                if (mapLines[curRow][tmpCurCol] === "#") {
                    return;
                } else {
                    curCol = tmpCurCol;
                    continue;
                }
            }
            
            if (mapLines[curRow][curCol + 1] === "#") {
                return;
            } else if (mapLines[curRow][curCol + 1] === ".") {
                curCol++;
            }
        }
        return;
    }

    if (curDir === "l") {
        for(let m = 0; m < count; m++) {
            // deal with wrap around
            if (curCol === 0) {
                let tmpCurCol = mapLines[curRow].length - 1;
                // wrap to wall
                if (mapLines[curRow][tmpCurCol] === "#") {
                    return;
                } else {
                    curCol = tmpCurCol;
                    continue;
                }
            }
            
            if (mapLines[curRow][curCol - 1] === "#") {
                return;
            } else if (mapLines[curRow][curCol - 1] === ".") {
                curCol--;
            }
        }
        return;
    }

    if (curDir === "d") {
        for(let m = 0; m < count; m++) {
            // deal with wrap around
            if (curRow === mapLines.length - 1 || mapLines[curRow + 1][curCol] === " " || mapLines[curRow + 1].length < curCol) {
                let tmpCurRow = 0;
                while(mapLines[tmpCurRow].length < curCol - 1 && (mapLines[tmpCurRow].length < curCol || mapLines[tmpCurRow][curCol] === " ")) {
                    tmpCurRow++;
                }
                // wrap to wall
                if (mapLines[tmpCurRow][curCol] === "#") {
                    return;
                } else {
                    curRow = tmpCurRow;
                    continue;
                }
            }
            
            if (mapLines[curRow + 1][curCol] === "#") {
                return;
            } else if (mapLines[curRow + 1][curCol] === ".") {
                curRow++;
            }
        }
        return;
    }

    if (curDir === "u") {
        for(let m = 0; m < count; m++) {
            // deal with wrap around
            if (curRow === 0 || mapLines[curRow - 1].length < curCol || mapLines[curRow - 1][curCol] === " ") {
                let tmpCurRow = mapLines.length - 1;
                while(mapLines[tmpCurRow].length > 0 && (mapLines[tmpCurRow].length < curCol || mapLines[tmpCurRow][curCol] === " ")) {
                    tmpCurRow--;
                }
                // wrap to wall
                if (mapLines[tmpCurRow][curCol] === "#") {
                    return;
                } else {
                    curRow = tmpCurRow;
                    continue;
                }
            }
            
            if (mapLines[curRow - 1][curCol] === "#") {
                return;
            } else if (mapLines[curRow - 1][curCol] === ".") {
                curRow--;
            }
        }
        return;
    }
}

// move to the start
while(mapLines[curRow][curCol] === " ") {
    curCol++;
}

while(curInstructionIndex < instructions.length) {
    console.log(`${curRow}, ${curCol} (${curDir})`);

    let instructionChar = instructions[curInstructionIndex];
    if (instructionChar === "L") {
        console.log("turning left");
        turnLeft();
    } else if (instructionChar === "R") {
        console.log("turning right");
        turnRight();
    } else {
        let countString = instructionChar;
        while(curInstructionIndex < instructions.length && 
            instructions[curInstructionIndex + 1] !== "R" &&
            instructions[curInstructionIndex + 1] !== "L") {
            countString += instructions[++curInstructionIndex];
        }
        moveForward(parseInt(countString));
    }
    curInstructionIndex++;
}

console.log("==== PART 1 ====");
let row = curRow + 1;
let col = curCol + 1;
let facing = 0;
if (curDir === "d") facing = 1;
if (curDir === "l") facing = 2;
if (curDir === "u") facing = 3;

let password = row * 1000 + (col * 4) + facing;
console.log(password);
// 14228 < x < 162116