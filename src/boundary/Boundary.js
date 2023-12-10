import { Helper } from '../model/Model.js';
var BOXSIZE = 100;
var canvasWidth = 0;

const N = 1, S = 2, E = 4, W = 8;
export function drawGrid(ctx, model) {
    ctx.lineWidth = canvasWidth / model.size * .04;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(canvasWidth,0);
    ctx.stroke();
    ctx.moveTo(canvasWidth,0);
    ctx.lineTo(canvasWidth,canvasWidth);
    ctx.stroke();
    ctx.moveTo(canvasWidth,canvasWidth);
    ctx.lineTo(0,canvasWidth);
    ctx.stroke();
    ctx.moveTo(0,canvasWidth);
    ctx.lineTo(0,0);
    ctx.stroke();
    for(let i=0; i<model.size; i++) {
        for(let j=0; j<model.size; j++) {
            //console.log(`i,j ${i},${j}`);
            if((model.maze.grid[i][j] & E) === 0) { //right get(Helper.getKey(i,j)).right
                //console.log(`draw right ${(i+1)},${j} to ${i+1},${j+1}`);
                ctx.moveTo((j+1)*BOXSIZE,i*BOXSIZE);
                ctx.lineTo((j+1)*BOXSIZE,(i+1)*BOXSIZE);
                ctx.stroke();
            }
            if((model.maze.grid[i][j] & S) === 0) { //down
                //console.log(`draw down ${j},${i+1} to ${j+1},${i+1}`);
                ctx.moveTo(j*BOXSIZE, (i+1)*BOXSIZE);
                ctx.lineTo(BOXSIZE*(j+1), (i+1)*BOXSIZE);
                ctx.stroke();
            }
        }
    }
}
export function redrawCanvas(model, canvasObj, appObj) {
    if(typeof canvasObj === "undefined") return;

    const ctx = canvasObj.getContext('2d');

    canvasWidth = canvasObj.width;
    BOXSIZE = canvasObj.width/model.size;
    if(ctx == null) return;

    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasObj.width, canvasObj.height);
    if(model.maze) {
        drawGrid(ctx, model);
    }

}