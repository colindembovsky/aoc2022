class Column {
    constructor(public stack: string[]) {}

    public getTop(): string {
        return this.stack[this.stack.length - 1];
    }

    public pop(num: number): string[] {
        return this.stack.splice(this.stack.length - num, num).reverse();
    }

    public push(items: string[]): void {
        this.stack.push(...items);
    }
}

class Instruction {
    public moveNum: number;
    public fromCol: number;
    public toCol: number;

    constructor(public line: string) {
        const match = line.match(/^move (\d+) from (\d+) to (\d+)$/);
        if (match === null) {
            throw new Error(`Invalid instruction: ${line}`);
        }
        this.moveNum = parseInt(match[1]);
        this.fromCol = parseInt(match[2]) - 1;
        this.toCol = parseInt(match[3]) - 1;
    }
}

function parseColumns(lines: string[]): Column[] {
    let numLine = lines.pop();
    let max = numLine!.split("   ").reverse().map(s => parseInt(s))[0];
    lines.reverse();
    let columns: Column[] = [];
    
    for (let i = 0; i < max; i++) {
        columns[i] = new Column([]);
        lines.forEach(l => {
            // get 4 chars from i * 4
            let val = l.substring(4 * i, (4 * i) + 4).trim();
            if (val.trim() !== "") {
                const match = val.match(/^\[([A-Z])\]$/);
                if (match === null) {
                    throw new Error(`Invalid value: ${val}`);
                }
                columns[i].push([match[1]]);
            }
        });
    }

    return columns;
}

function parseInstructions(lines: string[]): Instruction[] {
    return lines.map(l => new Instruction(l));
}

function followInstructionsPart1(columns: Column[], instructions: Instruction[]): string {
    instructions.forEach(i => {
        let items = columns[i.fromCol].pop(i.moveNum);
        columns[i.toCol].push(items);
    });

    return columns.reduce((acc, col) => acc += col.getTop(), "");
}

export {
    Column,
    Instruction,
    parseColumns,
    parseInstructions,
    followInstructionsPart1
}