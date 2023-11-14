import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { IRect, IRowInStorage } from "./interfaces";

function App() {
  const canvasRef = useRef(null);
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let storage: IRowInStorage[] | null;
  const [rectSize, setRectSize] = useState(50);
  let storageFallingRects = 0;

  useEffect(() => {
    canvas = canvasRef.current!;
    canvas.height = window.innerHeight - (window.innerHeight % rectSize);
    canvas.width = window.innerWidth - (window.innerWidth % rectSize);
    ctx = canvas.getContext("2d");
    ctx!.fillStyle = "grey";
    initializeStorage();
    console.log(storage);
  });

  const initializeStorage = () => {
    storage = Array.from(Array(canvas.height / rectSize), (v, k) => {
      return {
        startY: k * rectSize,
        endY: (k + 1) * rectSize,
        fallingRectsCount: 0,
        rects: Array(canvas.width / rectSize),
      };
    });
  };

  const updateAnimation = () => {
    if (!storage) return;
    storageFallingRects = 0;

    for (let i = storage.length - 2; i >= 0; i--) {
      const row = storage[i];
      const previousRow = storage[i + 1];
      ctx?.clearRect(0, row.startY, canvas.width, rectSize);

      row.rects.forEach((rect, index) => {
        const posBottomLeft = previousRow.rects[index - 1];
        const posBottomRight = previousRow.rects[index + 1];
        const posBottomMiddle = previousRow.rects[index];

        const rectsBelow = [posBottomLeft, posBottomMiddle, posBottomRight];

        let IsOnTrajectory = false;

        rectsBelow.forEach((rectBelow) => {
          if (!rectBelow) return;
          const right = rectBelow.x + rectSize > rect.x && rectBelow.x < rect.x;
          const left = rectBelow.x < rect.x + rectSize && rectBelow.x > rect.x;
          if (left || right) IsOnTrajectory = true;
        });

        if (IsOnTrajectory && row.startY === rect.y) {
          ctx?.fillRect(rect.x, rect.y, rectSize, rectSize);
          return;
        }

        rect.y += 1;
        ctx?.fillRect(rect.x, rect.y, rectSize, rectSize);

        if (rect.y + 1 > row.endY) {
          delete row.rects[index];
          previousRow.rects[index] = rect;
          row.fallingRectsCount -= 1;
          previousRow.fallingRectsCount += 1;
          storageFallingRects += previousRow.fallingRectsCount;
        }
      });

      if (row.fallingRectsCount) storageFallingRects += row.fallingRectsCount;
    }

    if (storageFallingRects) requestAnimationFrame(updateAnimation);
  };

  const addRectToStorage = (x: number, y: number) => {
    if (!storage) return;

    const indexOfY = Math.trunc(y / rectSize);
    const indexOfX = Math.trunc(x / rectSize);

    const rect: IRect = {
      isFalling: true,
      x,
      y,
    };

    storage[indexOfY].rects[indexOfX] = rect;
    storage[indexOfY].fallingRectsCount += 1;

    if (!storageFallingRects) updateAnimation();
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

