import React from 'react';
import './App.css';
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

import { layout } from './Layout.js';
import { redrawCanvas } from './boundary/Boundary.js';
import { step, generate } from './controller/Controller.js';

import Model from './model/Model.js';

function App() {
  const [size, setSize] = React.useState(5);
  const [model, setModel] = React.useState(new Model(size));
  const [redraw, forceRedraw] = React.useState(0);

  const appRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    redrawCanvas(model, canvasRef.current, appRef.current);
  }, [model, redraw, size]);

  const handleStepButton = () => {
    step(model);
    forceRedraw(redraw+1);
  }
  const handleResetButton = () => {
    setModel(new Model(size));
  }
  const handleGenerateButton = () => {
    generate(model);
    forceRedraw(redraw+1);
  }
  const getNumber = () => {
    let input = document.getElementById("size").value;
    if(input>30 || input < 1) return;
    setSize(input);
    setModel(new Model(input));
  }
  return (
    <main style={layout.Appmain} ref={appRef}>
      <div style={layout.leftSection}>
        <canvas tabIndex="1"
          className='App-canvas'
          ref={canvasRef}
          width={layout.canvas.width}
          height={layout.canvas.height}/>
      </div>
      <div style={layout.rightSection}>
        <button disabled={model.maze.grid.edges === 0}     onClick={(e) => handleStepButton()}     style={layout.stepButton}    >Step</button>
        <button disabled={model.maze.grid.edges === 0}     onClick={(e) => handleGenerateButton()} style={layout.generateButton}>Generate</button>
        <label style={layout.sizeInput} htmlFor="size">Maze size:</label>
        <input style={layout.inputText} type="number" id="size" name="size" min="1" max="30" onInput={(e) => getNumber()}></input>
        <button onClick={(e) => handleResetButton()}   style={layout.resetButton}>Reset</button>
      </div>
    </main>
  );
}
export default App;