import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { IRect, IRowInStorage } from "./interfaces";

function App() {
  const canvasRef = useRef(null);
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let storage: IRowInStorage[] | null;
  const [rectSize, setRectSize] = useState(10);
  let storageFallingRects = 0;

  useEffect(() => {
    canvas = canvasRef.current!;
    canvas.height = window.innerHeight - (window.innerHeight % rectSize);
    canvas.width = window.innerWidth - (window.innerWidth % rectSize);
    ctx = canvas.getContext("2d");
    ctx!.fillStyle = "grey";
    initializeStorage();
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
      if (!row.fallingRectsCount) continue;

      row.rects.forEach((rect, index) => {
        if (!rect.isFalling) return;
        const posBottomLeft = previousRow.rects[index - 1];
        const posBottomRight = previousRow.rects[index + 1];
        const posBottomMiddle = previousRow.rects[index];
        const rectsBelow = [posBottomLeft, posBottomMiddle, posBottomRight];
        let IsOnTrajectory = false;

        rectsBelow.forEach((rectBelow) => {
          if (!rectBelow) return;
          const left =
            rectBelow.right >= rect.left && rectBelow.right <= rect.right;
          const right =
            rectBelow.left <= rect.right && rectBelow.left >= rect.left;

          if ((left || right) && rect.bottom === rectBelow.top) {
            IsOnTrajectory = true;
          }
        });

        if (IsOnTrajectory && rect.isFalling) {
          ctx?.fillRect(rect.left, rect.top, rectSize, rectSize);
          rect.isFalling = false;
          row.fallingRectsCount -= 1;
          return;
        }

        if (rect.isFalling) {
          ctx?.clearRect(rect.left, rect.top, rectSize, rectSize);
          rect.top += 1;
          rect.bottom += 1;
          ctx?.fillRect(rect.left, rect.top, rectSize, rectSize);
        }

        if (rect.top + 1 > row.endY) {
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
      left: x,
      top: y,
      bottom: y + rectSize,
      right: x + rectSize,
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
