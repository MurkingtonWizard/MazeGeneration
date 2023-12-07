import React from 'react';
import './App.css';
import { layout } from './Layout.js';
import { redrawCanvas } from './boundary/Boundary.js';
import { removeGroup, moveNinja } from './controller/Controller.js';
import { Direction } from './model/Model.js';
import ninjase from './ninjase.png';

import {config_5x5,config_4x4,config_6x6} from './model/Puzzle.js';
import Model from './model/Model.js';

var puzzle5 = JSON.parse(JSON.stringify(config_5x5));
var puzzle4 = JSON.parse(JSON.stringify(config_4x4));
var puzzle6 = JSON.parse(JSON.stringify(config_6x6));

function App() {
  const [model, setModel] = React.useState(new Model(puzzle5));
  const [redraw, forceRedraw] = React.useState(0);

  const appRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    redrawCanvas(model, canvasRef.current, appRef.current);
  }, [model, redraw]);

  const handleClick = (e) => {
    if(model.victory) return;
    removeGroup(model, canvasRef.current, e);
    forceRedraw(redraw+1);
  }
  const handleKey = (e) => {
    if(model.victory) return;
    //get direction
    let direction = Direction.NoMove;
    if(e.key === 'w' && model.available(Direction.Up)) direction = Direction.Up;
    else if(e.key === 's' && model.available(Direction.Down)) direction = Direction.Down;
    else if(e.key === 'a' && model.available(Direction.Left)) direction = Direction.Left;
    else if(e.key === 'd' && model.available(Direction.Right)) direction = Direction.Right;
    //console.log(`Key pressed: ${e.key}`);
    moveNinja(model, direction);
    forceRedraw(redraw+1);
  }
  const handleButton = (direction) => {
    if(model.victory) return;
    //console.log(`Button pressed`);
    moveNinja(model, direction);
    forceRedraw(redraw+1);
  }
  const handleLevelButton = (level) => {
    if(level === 1) setModel(new Model(puzzle5));
    else if (level === 2) setModel(new Model(puzzle4));
    else setModel(new Model(puzzle6));
  }
  const handleResetButton = () => {
    if(model.puzzle.size === 5) handleLevelButton(1);
    else if(model.puzzle.size === 4) handleLevelButton(2);
    else handleLevelButton(3);
  }

  return (
    <main style={layout.Appmain} ref={appRef}>
      <div style={layout.leftSection}>
        <img id="ninjase" src={ninjase} alt="hidden" hidden></img>
        <canvas tabIndex="1"
          className='App-canvas'
          ref={canvasRef}
          width={layout.canvas.width}
          height={layout.canvas.height}
          onClick={handleClick}
          onKeyDown={handleKey}/>
      </div>
      <div style={layout.middleSection}>
        <label style={layout.scoretext}>{"Score: " + model.score}</label>
        <label style={layout.movetext}>{"Moves: " + model.moveCounter}</label>
        <div style={layout.buttons}>
          <button disabled={!model.available(Direction.Up)}     onClick={(e) => handleButton(Direction.Up)}     style={layout.upbutton}   >^</button>
          <button disabled={!model.available(Direction.Left)}   onClick={(e) => handleButton(Direction.Left)}   style={layout.leftbutton} >&lt;</button>
          <button disabled={!model.available(Direction.Right)}  onClick={(e) => handleButton(Direction.Right)}  style={layout.rightbutton}>&gt;</button>
          <button disabled={!model.available(Direction.Down)}   onClick={(e) => handleButton(Direction.Down)}   style={layout.downbutton} >v</button>
        </div>
      </div>
      <div style={layout.rightSection}>
        <button onClick={(e) => handleLevelButton(1)}  style={layout.level1Button}>Level 1</button>
        <button onClick={(e) => handleLevelButton(2)}  style={layout.level2Button}>Level 2</button>
        <button onClick={(e) => handleLevelButton(3)}  style={layout.level3Button}>Level 3</button>
        <button onClick={(e) => handleResetButton()}   style={layout.resetButton}>Reset</button>
        { model.victory ? (<label style={layout.victory}>You Win!</label>) : null }
      </div>
    </main>
  );
}

export default App;
 