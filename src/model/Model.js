

export class Helper {
    /**
     * Converts a single letter to a number, ie A = 1, B = 2, etc.
     * @param {String} letter 
     * @returns {int} that represents the given letter
     */
    static surround8 = [[-1,-1],[-1,0],[-1,1],
                        [0,-1],        [0, 1],
                        [1,-1], [1,0], [1, 1]];
    // static const Direction = {
    //     UP,
    //     DOWN,
    //     LEFT,
    //     RIGHT,
    // }
    static letterToNumber(letter) {
        return String(letter).charCodeAt(0) - 64;
    }
    static getKey(row, col) {
        return `${row}${col}`;
    }
}
export default class Model {
    /**
     * Model constuctor
     * @param {JSON-encoded puzzle} info 
     */
    constructor(info) {
        this.initialize(info);
        this.moveCounter = 0;
        this.score = 0;
        this.victory = false;
    }
    initialize(info) {
        let size = parseInt(info.numRows);
        let ninjaInitCoord = new Coord(parseInt(info.ninjaRow), Helper.letterToNumber(info.ninjaColumn));
        this.puzzle = new Puzzle(new Board(info.initial, ninjaInitCoord), size);
    }
    
    // numMoves() {
    //     return this.moveCounter;
    // }

    updateScore(score) {
        this.score += score;
    }
    incMoves() {
        this.moveCounter++;
    }
    available(direction) {
        if(this.victory) return false;
        let ninjaCoord = this.puzzle.board.ninja.coord;
        if(direction === Direction.Up)
            return  ninjaCoord.row + direction.deltaR !== 0;
        if(direction === Direction.Down)
            return  ninjaCoord.row + 1 + direction.deltaR <= this.puzzle.size;
        if(direction === Direction.Left)
            return  ninjaCoord.col + direction.deltaC !== 0;
        if(direction === Direction.Right)
            return  ninjaCoord.col + 1 + direction.deltaC <= this.puzzle.size;
    }
    checkVictory() {
        this.victory = this.puzzle.board.pieces.size === 0;
        //console.log(`There are ${this.puzzle.board.pieces.size} pieces left`)
    }
    // copy() {
    //     let m = new Model();
    //     m.moveCounter = this.moveCounter;
    //     m.puzzle = this.puzzle.clone();
    //     m.score = this.score;
    //     m.victory = this.victory;
    //     return m;
    // }
}
// export const Down = new MoveType(1, 0, "down");
// export const Up = new MoveType(-1, 0, "up");
// export const Left = new MoveType(0, -1, "left");
// export const Right = new MoveType(0, 1, "right");
// export const NoMove = new MoveType(0, 0, "*");

export class MoveType {
    /**
     * MoveType constructor
     * @param {int} dr -1, 0, 1
     * @param {int} dc -1, 0, 1
     */
    constructor(dr, dc) {
        this.deltaR = dr;
        this.deltaC = dc;
    }

    // static parse(s) {
    //     if(s == "down" || s == "Down") return Down;
    //     if(s == "up" || s == "Up") return Up;
    //     if(s == "left" || s == "Left") return Left;
    //     if(s == "right" || s == "Right") return Right;
    //     return NoMove;
    // }
}

export const Direction = {
    Down: new MoveType(1, 0),
    Up: new MoveType(-1, 0),
    Left: new MoveType(0, -1),
    Right: new MoveType(0, 1),
    NoMove: new MoveType(0, 0)
}

export class Coord {
    /**
     * Coord constructor
     * @param {int} row 
     * @param {int} col 
     */
    constructor(row, col) {
        this.row = row;
        if(typeof col === "string") this.col = Helper.letterToNumber(col);
        else this.col = col;
    }
    getKey() {
        return `${this.row}${this.col}`;
    }
    getCoordTo(deltaR, deltaC, size) {
        let nextRow = this.row + deltaR;
        let nextCol = this.col + deltaC;
        if(nextRow === 0) {nextRow = size;}
        else if(nextRow > size) {nextRow = 1;}
        if(nextCol === 0) {nextCol = size;}
        else if(nextCol > size) {nextCol = 1;}
        return new Coord(nextRow,nextCol);
    }
    equals(other) {
        return this.row === other.row && this.col === other.col;
    }
    toString() {
        return `(${this.row},${this.col})`;
    }
}

export class Piece {
    /**
     * Piece constructor
     * @param {Coord} coord 
     * @param {String} color 
     */
    constructor(coord, color) {
        this.coord = coord;
        this.color = color;
    }

    getKey() {
        return this.coord.getKey();
    }
    toString() {
        return `piece at ${this.coord.row}, ${this.coord.col} is ${this.color}`;
    }
}

export class Board {
    constructor(boardInfo, initCoord) {
        this.pieces = new Map();
        this.initialize(boardInfo);
        this.ninja = new Piece(initCoord,"");
    }
    initialize(boardInfo, ninjaInit) {
        for(let i = 0; i < boardInfo.length; i++) {
            let piece = new Piece(new Coord(parseInt(boardInfo[i].row), 
                Helper.letterToNumber(boardInfo[i].column)),
                boardInfo[i].color);
            this.pieces.set(piece.coord.getKey(), piece);
        }
    }
    removeGroup(model, key) {
        let piece = this.pieces.get(key);
        let row = parseInt(key.charAt(0));
        let col = parseInt(key.charAt(1));
        let keys = [];
        keys[0] = key;
        for(let pair of Helper.surround8) {
            let k = Helper.getKey(row+pair[0],col+pair[1]);
            if(this.pieces.has(k) && this.pieces.get(k).color === piece.color)
                keys[keys.length] = k;
        }
        //remove keys now
        if(keys.length === 4) {
            for(let k of keys) {
                //console.log(`Delete ${k}`);
                this.pieces.delete(k);
            }
            model.updateScore(4);
            model.incMoves();
        }
        //console.log(`Deleted? ${!this.pieces.has(key)}`);
        model.checkVictory();
    }

    updatePiece(from, to) {
        //console.log(`piece at from${from} moves to${to}}`);

        this.pieces.get(from.getKey()).coord = to;
        this.pieces.set(to.getKey(),this.pieces.get(from.getKey()));
        this.pieces.delete(from.getKey());
    }

    movePiecesFrom(startCoord, direction, size) {
        let nextCoord = startCoord.getCoordTo(direction.deltaR, direction.deltaC, size);
        while(this.pieces.has(nextCoord.getKey())) {
            nextCoord = nextCoord.getCoordTo(direction.deltaR, direction.deltaC, size);
        }
        let emptyCoord = nextCoord;
        nextCoord = nextCoord.getCoordTo(-direction.deltaR, -direction.deltaC, size);
        //console.log(`piece at nextCoord${nextCoord}: ${this.pieces.get(nextCoord.getKey())}`);
        //console.log(`piece at emptyCoord${emptyCoord}: ${this.pieces.get(emptyCoord.getKey())}`);
        let piecesMoved = 0;
        while(!nextCoord.equals(startCoord)) {
            this.updatePiece(nextCoord, emptyCoord);
            piecesMoved++;
            emptyCoord = nextCoord;
            nextCoord = nextCoord.getCoordTo(-direction.deltaR, -direction.deltaC, size);
            //console.log(`piece at nextCoord${nextCoord}: ${this.pieces.get(nextCoord.getKey())}`);
            ///console.log(`piece at emptyCoord${emptyCoord}: ${this.pieces.get(emptyCoord.getKey())}`);
        }
        return piecesMoved;
    }

    moveNinja(model, direction) {
        let size = model.puzzle.size;
        if(direction === Direction.Left) {
            model.updateScore(this.movePiecesFrom(this.ninja.coord, direction, size));
            model.updateScore(this.movePiecesFrom(new Coord(this.ninja.coord.row+1,this.ninja.coord.col), direction, size));
        } else if(direction === Direction.Right) {
            model.updateScore(this.movePiecesFrom(new Coord(this.ninja.coord.row,this.ninja.coord.col+1), direction, size));
            model.updateScore(this.movePiecesFrom(new Coord(this.ninja.coord.row+1,this.ninja.coord.col+1), direction, size));
        } else if(direction === Direction.Up) {
            model.updateScore(this.movePiecesFrom(this.ninja.coord, direction, size));
            model.updateScore(this.movePiecesFrom(new Coord(this.ninja.coord.row,this.ninja.coord.col+1), direction, size));
        } else if(direction === Direction.Down) {
            model.updateScore(this.movePiecesFrom(new Coord(this.ninja.coord.row+1,this.ninja.coord.col), direction, size));
            model.updateScore(this.movePiecesFrom(new Coord(this.ninja.coord.row+1,this.ninja.coord.col+1), direction, size));
        }
        //moves ninja
        this.ninja.coord.row += direction.deltaR;
        this.ninja.coord.col += direction.deltaC;
        model.incMoves();
        
        /*
        while row, col+(direction.deltaC*i)
        for()
        */
    }
    // clone() {
    //     let b = new Board();
    //     b.pieces = new Map(this.pieces);
    //     b.ninja = this.ninja;
    //     return b;
    // }
}

export class Puzzle {
    constructor(board, size) {
        this.board = board;
        this.size = size;
    }

    // clone() {
    //     let p = new Puzzle();
    //     p.size = this.size;
    //     p.board = this.board.clone();
    //     return p;
    // }
}