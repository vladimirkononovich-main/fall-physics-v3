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
        isThereFallingRect: false,
        rects: Array(canvas.width / rectSize),
      };
    });
  };

  let count = 0;
  const updateAnimation = () => {
    if (!storage) return;

    for (let i = storage.length - 2; i >= 0; i--) {
      const row = storage[i];
      const previousRow = storage[i + 1];
      ctx?.clearRect(0, row.startY, canvas.width, rectSize);

      row.rects.forEach((rect, index) => {
        rect.y += 1;
        ctx?.fillRect(rect.x, rect.y, rectSize, rectSize);

        if (rect.y + 1 > row.endY) {
          delete row.rects[index];
          previousRow.rects[index] = rect;
        }
      });
    }

    count++;
    if (count === 50) console.log(storage);
    if (count < 50) requestAnimationFrame(updateAnimation);
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

// const initializeStorage = () => {
//   storage = Array.from(new Array(canvas.height / rectSize), (v, k) => {
//     return {
//       startY: k * rectSize,
//       endY: (k + 1) * rectSize,
//       isThereFallingRect: false,
//       rects: [],
//     };
//   });
// };

// let count = 0;
// const updateAnimation = () => {
//   if (!storage) return;

//   for (let i = storage.length - 2; i >= 0; i--) {
//     const currentRow = storage[i];
//     const previousRow = storage[i + 1];
//     const fallingRects: IRect[] = [];

//     if (!currentRow.isThereFallingRect) continue;

//     ctx?.clearRect(0, currentRow.startY, canvas.width, rectSize);

//     currentRow.rects.forEach((rect, index) => {
//       if (!rect.isFalling) return;
//       fallingRects.push(rect);

//       rect.y += 1;
//       ctx?.fillRect(rect.x, rect.y, rectSize, rectSize);

//       if (rect.y + 1 > currentRow.endY) {
//         previousRow.rects.push(rect);
//         currentRow.rects.splice(index, 1);
//         fallingRects.pop();
//         previousRow.isThereFallingRect = true;
//       }
//     });

//     if (!fallingRects.length) currentRow.isThereFallingRect = false;
//   }
//   count++;
//   if (count === 50) console.log(storage);

//   if (count < 50) requestAnimationFrame(updateAnimation);
// };

// const addRectToStorage = (x: number, y: number) => {
//   if (!storage) return;

//   const currentRow = Math.trunc(y / rectSize);
//   storage[currentRow].isThereFallingRect = true;

//   const rect: IRect = {
//     isFalling: true,
//     x,
//     y,
//   };
//   storage[currentRow].rects.push(rect);

//   updateAnimation();
// };
