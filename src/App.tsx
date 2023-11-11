import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { IRect, IRowInStorage } from "./interfaces";

function App() {
  const canvasRef = useRef(null);
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let storage: IRowInStorage[] | null;
  const [rectSize, setRectSize] = useState(50);

  useEffect(() => {
    canvas = canvasRef.current!;
    canvas.height = window.innerHeight - (window.innerHeight % rectSize);
    canvas.width = window.innerWidth;
    ctx = canvas.getContext("2d");
    ctx!.fillStyle = "grey";
    initializeStorage();
  });

  const initializeStorage = () => {
    storage = Array.from(new Array(canvas.height / rectSize), (v, k) => {
      return {
        startY: k * rectSize,
        endY: (k + 1) * rectSize,
        rects: [],
      };
    });
  };

  const drawRect = (rect: IRect) => {
    ctx?.fillRect(rect.x, rect.y, rectSize, rectSize);
  };

  let count = 0

  const updateAnimation = () => {
    if (!storage) return;

    for (const storageRow of storage) {
      storageRow.rects.forEach((rect) => {
        drawRect(rect);
      });
    }

    if (count < 5) requestAnimationFrame(updateAnimation)
  };

  const addRectToStorage = (x: number, y: number) => {
    if (!storage) return;

    const currentRow = Math.trunc(y / rectSize);
    const rect: IRect = {
      x,
      y,
    };
    storage[currentRow].rects.push(rect);

    updateAnimation();
  };

  return (
    <div className="App">
      <canvas
        id="canvas"
        ref={canvasRef}
        onClick={(e) =>
          addRectToStorage(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        }
      ></canvas>
    </div>
  );
}

export default App;
