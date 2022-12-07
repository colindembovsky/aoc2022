import * as fs from "fs";

const ROOT_DIR="day07";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile(`${ROOT_DIR}/input.txt`);

class File {
    constructor(public name: string, public size: number) {
    }
}

class Directory {
    dirs: Directory[] = [];
    files: File[] = [];
    constructor(public name: string, public parent?: Directory) {
    }

    getSize(): number {
        let size = 0;
        for (let child of this.dirs) {
            size += child.getSize();
        }
        for (let file of this.files) {
            size += file.size;
        }
        return size;
    }

    getDirsWithTotalSizeAtMost(size: number): Directory[] {
        let dirs: Directory[] = [];
        if (this.getSize() <= size) {
            dirs.push(this);
        }
        for (let child of this.dirs) {
            dirs = dirs.concat(child.getDirsWithTotalSizeAtMost(size));
        }
        return dirs;
    }

    getAllDirsBySize(): Set<{dir: string, size: number}> {
        let dirs: Set<{dir: string, size: number}> = new Set();
        let size = 0;
        for (let file of this.files) {
            size += file.size;
        }
        for (let child of this.dirs) {
            let subDirs = child.getAllDirsBySize();
            subDirs.forEach(d => {
                dirs.add(d)
            });
            size += child.getSize();
        }
        
        dirs.add({dir: this.name, size});
        return dirs;
    }
}

function parseInstructions(lines: string[]): Directory {
    let root = new Directory("/");
    let currentDir = root;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        //console.log(`Line ${i}: ${line}`);
        if (line === "$ cd /") {
            currentDir = root;
        } else if (line === "$ cd ..") {
            currentDir = currentDir.parent!;
            //console.log(`Going up to ${currentDir.name}`);
        } else if (line.startsWith("$ cd ")) {
            let dirName = line.substring(5);
            currentDir = currentDir.dirs.find(d => d.name === dirName)!;
        } else if (line === "$ ls") {
            do {
                let cLine = lines[++i];
                if (cLine.startsWith("dir ")) {
                    let subDir = new Directory(cLine.substring(4), currentDir);
                    currentDir.dirs.push(subDir);
                } else {
                    let [sizeStr, name] = cLine.split(" ");
                    let size = parseInt(sizeStr);
                    currentDir.files.push(new File(name, size));
                }
            } while (!(i >= lines.length - 1 || lines[i + 1].startsWith("$ ")))
        }
    }
    return root;
}

console.log("==== PART 1 ====");
let root = parseInstructions(contents.split("\n"));
let bigDirs = root.getDirsWithTotalSizeAtMost(100000);
console.log(`Total bigDir size: ${bigDirs.map(d => d.getSize()).reduce((a, b) => a + b, 0)}`);

console.log("==== PART 2 ====");
let inspectDirs = Array.from(root.getAllDirsBySize());
inspectDirs.sort((a, b) => b.size - a.size);
inspectDirs.forEach(d => console.log(`${d.dir}: ${d.size}`));
let rootSize = inspectDirs.shift()!.size;
console.log(`Total size: ${rootSize}`);
let unused = 70000000 - rootSize;
console.log(`unused: ${unused}`);
let toFree = 30000000 - unused;
console.log(`toFree: ${toFree}`);
let candidateSize = inspectDirs.filter(d => d.size > toFree).sort((a, b) => a.size - b.size)[0].size;
console.log(`spaceToFree: ${candidateSize}`);
