import { computePiece } from '../boundary/Boundary.js';
import { Direction } from '../model/Model.js';

export function moveNinja(model, direction) {
    if(direction === Direction.NoMove) return;
    
    model.puzzle.board.moveNinja(model, direction);
}

export function removeGroup(model, canvas, event) {
    const canvasRect = canvas.getBoundingClientRect();

    let clickKey = null;
    //console.log(`x,y: ${event.clientX - canvasRect.left}, ${event.clientY - canvasRect.top}`);
    for(let [key, piece] of model.puzzle.board.pieces) {
        //console.log(`Key, value is ${key},${piece}`);
        let square = computePiece(piece);
        if(square.contains(event.clientX - canvasRect.left, event.clientY - canvasRect.top)) {
            //console.log("Reached");
            clickKey = key;
            break;
        }
    }
    //console.log(`Key is ${clickKey}`);
    if(clickKey != null) {
        model.puzzle.board.removeGroup(model, clickKey);
    }

    return model;//.copy();
}