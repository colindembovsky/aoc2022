import * as fs from "fs";

const ROOT_DIR="day08";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

class Forest {
    grid: number[][];

    constructor(contents: string) {
        this.grid = this.readGrid(contents);
    }

    readGrid(contents: string): number[][] {
        return contents.split("\n").map(line => line.split("").map(s => parseInt(s)));
    }

    getTreesRightOf(row: number, col: number) {
        let treeRow = this.grid[row];
        return treeRow.slice(col + 1);
    }

    getTreesLeftOf(row: number, col: number) {
        let treeRow = this.grid[row];
        return treeRow.slice(0, col);
    }

    getTreesAbove(row: number, col: number) {
        let trees: number[] = [];
        for (let i = 0; i < row; i++) {
            trees.push(this.grid[i][col]);
        }
        return trees;
    }

    getTreesBelow(row: number, col: number) {
        let trees: number[] = [];
        for (let i = row + 1; i < this.grid.length; i++) {
            trees.push(this.grid[i][col]);
        }
        return trees;
    }

    isTreeVisible(tree: number, looking: number[]) {
        // get the max of the looking array
        let max = Math.max(...looking);
        // if the tree is greater than the max, it's visible
        return tree > max;
    }

    getVisibleTrees(): number {
        // edges
        let visibleCount = (this.grid[0].length + this.grid.length - 2) * 2;
        for (let row = 1; row < this.grid.length - 1; row++) {
            for (let col = 1; col < this.grid[row].length - 1; col++) {
                let tree = this.grid[row][col];
                let isVisible = this.isTreeVisible(tree, this.getTreesRightOf(row, col)) ||
                    this.isTreeVisible(tree, this.getTreesLeftOf(row, col)) ||
                    this.isTreeVisible(tree, this.getTreesAbove(row, col)) ||
                    this.isTreeVisible(tree, this.getTreesBelow(row, col));
                visibleCount += isVisible ? 1 : 0;
            }
        }
        return visibleCount;
    }

    
}

console.log("==== PART 1 ====");
let contents = readFile(`${ROOT_DIR}/input.txt`);
let forest = new Forest(contents);
console.log(forest.getVisibleTrees());

console.log("==== PART 2 ====");


