export default class Model {
    /**
     * Model constuctor
     * @param {JSON-encoded puzzle} info 
     */
    constructor(size) {
        this.size = size;
        this.initialize(size);
    }
    initialize(size) {
        this.maze = new Maze(size);
    }
    generate() {
        this.maze.generate(this.size);
    }
}
export class Tree {
    constructor() {
        this.parent = null;
    }
    root() {
        return this.parent ? this.parent.root() : this;
    }
    connected(tree) {
        return this.root() === tree.root();
    }
    connect(tree) {
        tree.root().parent = this;
    }
}
// Set up constants to aid with describing the passage directions
const N = 1, S = 2, E = 4, W = 8;
const DX = { E: 1, W: -1, N: 0, S: 0 };
const DY = { E: 0, W: 0, N: -1, S: 1 };
const OPPOSITE = { E: W, W: E, N: S, S: N };
export class Maze {
    constructor(size) {
        this.grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
        this.sets = Array.from({ length: size }, () => Array.from({ length: size }, () => new Tree()));

        // Build the list of edges
        this.edges = [];
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (y > 0) this.edges.push([x, y, N]);
                if (x > 0) this.edges.push([x, y, W]);
            }
        }

        this.edges.sort(() => Math.random() - 0.5);
    }
    generate() {
        while (this.edges.length > 0) {
            this.step();
        }
    }
    getDirection(direction) {
        switch(direction) {
            case 1:
                return 'N';
            case 2:
                return 'S';
            case 4:
                return 'E';
            case 8:
                return 'W';
            default:
                return;
        }
    }
    step() {
        if(this.edges.length === 0) return;
        let [x, y, direction] = this.edges.pop();
        direction = this.getDirection(direction);
        const nx = x + DX[direction];
        const ny = y + DY[direction];

        const set1 = this.sets[y][x];
        const set2 = this.sets[ny][nx];
        
        if (!set1.connected(set2)) {
            set1.connect(set2);
            this.grid[y][x] |= direction;
            this.grid[ny][nx] |= OPPOSITE[direction];
        }
    }
}