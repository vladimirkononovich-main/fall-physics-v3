import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  let canvas: HTMLCanvasElement;
  let ctx;
  let storage: [][] | null = null;
  const [rectSize, setRectSize] = useState(50);

  useEffect(() => {
    canvas = canvasRef.current!;
    canvas.height = window.innerHeight - (window.innerHeight % rectSize);
    canvas.width = window.innerWidth;
    ctx = canvas.getContext("2d");

    storage = Array.from(new Array(canvas.height / rectSize), () => {
      return [];
    });

  });

  return (
    <div className="App">
      <canvas id="canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
