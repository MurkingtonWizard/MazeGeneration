var BOXSIZE = 100;
const OFFSET = 2;
export class Square {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    contains(x, y) {
        return x >= this.x && x <= (this.x + this.size) &&
            y >= this.y && y <= (this.y + this.size);
    }
}
export function computePiece(piece) {
    //console.log(`Piece: ${piece.coord}`);
    return new Square(BOXSIZE * (piece.coord.col-1) + OFFSET,
        BOXSIZE * (piece.coord.row-1) + OFFSET,
        BOXSIZE - 2 * OFFSET);
}

export function drawPuzzle(ctx, puzzle) {
    //ctx.shadowColor = 'black';
    for(let piece of puzzle.board.pieces) {
        let square = computePiece(piece[1]);
        ctx.fillStyle = piece[1].color;
        //ctx.shadowBlur = 10;
        ctx.fillRect(square.x, square.y, square.size, square.size);
    }
}

export function drawGrid(ctx, puzzle) {
    ctx.lineWidth = OFFSET * 2;
    ctx.strokeStyle = "black";
    for(let i=0; i<puzzle.size+2; i++) {
        ctx.beginPath();
        ctx.moveTo(i*BOXSIZE,0);
        ctx.lineTo(i*BOXSIZE,BOXSIZE*puzzle.size);
        ctx.stroke();
        ctx.moveTo(0, i*BOXSIZE);
        ctx.lineTo(BOXSIZE*puzzle.size, i*BOXSIZE);
        ctx.stroke();
    }
}

export function drawNinja(ctx, puzzle) {
    //let image = document.getElementById('ninjase');
    ctx.fillStyle = "#22b14c";
    let square = computePiece(puzzle.board.ninja);
    //ctx.drawImage(image, square.x, square.y, square.size*2+OFFSET*2, square.size*2+OFFSET*2);
    ctx.fillRect(square.x, square.y, square.size*2+OFFSET*2, square.size*2+OFFSET*2);
}

export function redrawCanvas(model, canvasObj, appObj) {
    if(typeof canvasObj === "undefined") return;

    const ctx = canvasObj.getContext('2d');

    BOXSIZE = canvasObj.width/model.puzzle.size;
    //console.log(BOXSIZE);
    if(ctx == null) return;

    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasObj.width, canvasObj.height);
    if(model.puzzle) {
        drawPuzzle(ctx, model.puzzle);
        drawGrid(ctx, model.puzzle);
        drawNinja(ctx, model.puzzle);
    }

}