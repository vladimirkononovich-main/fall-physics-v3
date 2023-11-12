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
        isThereFallingRect: false,
        rects: [],
      };
    });
  };

  const updateAnimation = () => {
    if (!storage) return;

    for (let i = storage.length - 2; i >= 0; i--) {
      const currentRow = storage[i];
      const previousRow = storage[i + 1];

      if (!currentRow.isThereFallingRect) continue;

      ctx?.clearRect(0, currentRow.startY, canvas.width, rectSize);

      currentRow.rects.forEach((rect, index) => {
        if (!rect.isFalling) return;

        rect.y += 1;
        ctx?.fillRect(rect.x, rect.y, rectSize, rectSize);

        if (rect.y + 1 > currentRow.endY) {
          previousRow.rects.push(rect);
          currentRow.rects.splice(index, 1);
          previousRow.isThereFallingRect = true;          
        }
      });
    }

    requestAnimationFrame(updateAnimation);
  };

  const addRectToStorage = (x: number, y: number) => {
    if (!storage) return;

    const currentRow = Math.trunc(y / rectSize);
    storage[currentRow].isThereFallingRect = true;

    const rect: IRect = {
      isFalling: true,
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
