import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  comparePositionsForFallenRects,
  comparePositionsForFallingRects,
  compareRectAround,
} from "./helperFunctions/comparisonIntersections";
import { getRandomIntInclusive } from "./helperFunctions/random";
import { IRect, IRowInStorage } from "./interfaces";

function App() {
  const canvasRef = useRef(null);
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let storage: IRowInStorage[] | null;
  const [rectSize, setRectSize] = useState(6);
  const [perimeterSizeForFilling, setPerimeterSizeForFilling] = useState(70);
  let numberOfRows: number;
  let numberOfCellsInRow: number;
  let storageFallingRects = 0;
  let rectSpeed = 1;
  let baseColor = "grey";
  let fallColor = "#670b0b";

  useEffect(() => {
    canvas = canvasRef.current!;
    canvas.height = window.innerHeight - (window.innerHeight % rectSize);
    canvas.width = window.innerWidth - (window.innerWidth % rectSize);
    ctx = canvas.getContext("2d");
    ctx!.fillStyle = "#670b0b";
    numberOfRows = canvas.height / rectSize;
    numberOfCellsInRow = canvas.width / rectSize;
    initializeStorage();
  });

  const initializeStorage = () => {
    storage = Array.from(Array(numberOfRows), (v, k) => {
      return {
        startY: k * rectSize,
        endY: (k + 1) * rectSize,
        fallingRectsCount: 0,
        rects: Array(numberOfCellsInRow),
      };
    });
  };

  const getNumberFallingRects = () => {
    if (!storage) return 0;
    let numberOfRect = 0;

    storage.forEach((row) => {
      numberOfRect += row.fallingRectsCount;
    });

    return numberOfRect;
  };

  const updateAnimation = () => {
    if (!storage) return;

    for (let i = storage.length - 1; i >= 0; i--) {
      const row = storage[i];
      const previousRow = storage[i + 1];
      let prePreviousRow = storage[i + 2] || { rects: [] };
      if (!row.fallingRectsCount) continue;

      row.rects.forEach((rect, index) => {
        if (!rect) return;
        if (!rect.isFalling) return;

        ctx!.clearRect(rect.left, rect.top, rectSize, rectSize);
        ctx!.fillStyle = fallColor;

        if (!previousRow) {
          rect.isFalling = false;
          row.fallingRectsCount -= 1;
        }

        if (previousRow) {
          const rectBottomLeft = previousRow.rects[index - 1];
          const rectBottomRight = previousRow.rects[index + 1];
          const rectBelow = previousRow.rects[index];

          const newParams = comparePositionsForFallingRects(
            rectBelow,
            rectBottomLeft,
            rectBottomRight,
            rect
          );

          if (newParams) {
            rect.speed = newParams.currSpeed;
            rect.top = newParams.currTop;
            rect.bottom = newParams.currBottom;
            newParams.collidingRectangles.forEach(
              (r) => (r.speed = newParams.rectsBelowSpeed)
            );
            ctx!.fillRect(rect.left, rect.top, rectSize, rectSize);
            return;
          }
        }

        if (rect.top + rect.speed > row.endY) {
          row.fallingRectsCount -= 1;
          const rectPreBottomLeft = prePreviousRow.rects[index - 1];
          const rectPreBottomRight = prePreviousRow.rects[index + 1];
          const rectPreBelow = prePreviousRow.rects[index];

          const obstacle = comparePositionsForFallenRects(
            rectPreBelow,
            rectPreBottomLeft,
            rectPreBottomRight,
            rect
          );

          if (obstacle || i === storage!.length - 2) {
            rect.top = previousRow.startY;
            rect.bottom = previousRow.endY;
            rect.isFalling = false;
          } else {
            storageFallingRects += 1;
            previousRow.fallingRectsCount += 1;
          }

          delete row.rects[index];
          previousRow.rects[index] = rect;
        }

        if (rect.isFalling) {
          rect.top += rect.speed;
          rect.bottom += rect.speed;
        } else ctx!.fillStyle = baseColor;

        ctx!.fillRect(rect.left, rect.top, rectSize, rectSize);
      });
      storageFallingRects = getNumberFallingRects();
    }

    if (storageFallingRects) requestAnimationFrame(updateAnimation);
  };

  const randomlyFillCell = (
    cell: IRect,
    indexOfX: number,
    indexOfY: number
  ): false | IRect => {
    const x = getRandomIntInclusive(cell.left, cell.right);
    const y = getRandomIntInclusive(cell.top, cell.bottom);
    const randomSpeed = getRandomIntInclusive(3, 5);

    const newRect: IRect = {
      isFalling: true,
      speed: randomSpeed,
      size: rectSize,
      top: y,
      bottom: y + rectSize,
      left: x,
      right: x + rectSize,
    };

    const rowAbove = storage![indexOfY + 1];
    const rowBelow = storage![indexOfY - 1];
    const currentRow = storage![indexOfY];

    return compareRectAround(currentRow, rowBelow, rowAbove, newRect, indexOfX);
  };

  const fillRandomCellsAround = (indexOfX: number, indexOfY: number) => {
    if (!storage) return;
    let startYIndex = indexOfY - perimeterSizeForFilling;
    let endYIndex = indexOfY + perimeterSizeForFilling;
    let startXIndex = indexOfX - perimeterSizeForFilling;
    let endXIndex = indexOfX + perimeterSizeForFilling;

    if (startYIndex < 0) startYIndex = 0;
    if (endYIndex > numberOfRows) endYIndex = numberOfRows;
    if (startXIndex < 0) startXIndex = 0;
    if (endXIndex > numberOfCellsInRow) endXIndex = numberOfCellsInRow;

    for (let i = startYIndex; i < endYIndex; i++) {
      const currentRow = storage[i];

      for (let j = startXIndex; j < endXIndex; j++) {
        if (currentRow.rects[j]) continue;
        if (!getRandomIntInclusive(0, 1)) continue;

        const currentCell = {
          isFalling: true,
          size: rectSize,
          speed: 0,
          top: currentRow.startY,
          bottom: currentRow.endY,
          left: j * rectSize,
          right: j * rectSize + rectSize,
        };

        const randomlyFilledRect = randomlyFillCell(currentCell, j, i);

        if (!randomlyFilledRect) continue;

        currentRow.rects[j] = randomlyFilledRect;
        currentRow.fallingRectsCount += 1;
      }
    }
  };

  const removeRects = () => {
    if (!storage) return;
    const storageFallingRectsBeforeRemove = storageFallingRects;

    const firstRow = storage[storage.length - 1];
    firstRow.rects = [];
    firstRow.fallingRectsCount = 0;
    ctx?.clearRect(0, firstRow.startY, canvas.width, rectSize);

    for (let y = storage.length - 2; y >= 0; y--) {
      storage[y].rects.forEach((rect, x) => {
        if (!rect.isFalling) storage![y].fallingRectsCount += 1;
        rect.isFalling = true;
        if (!getRandomIntInclusive(0, 1)) return;

        ctx?.clearRect(rect.left, rect.top, rectSize, rectSize);
        storage![y].fallingRectsCount -= 1;
        delete storage![y].rects[x];
      });
    }
    storageFallingRects = getNumberFallingRects();
    if (!storageFallingRectsBeforeRemove) updateAnimation();
  };

  const addRectToStorage = (x: number, y: number) => {
    if (!storage) return;

    const indexOfY = Math.trunc(y / rectSize);
    const indexOfX = Math.trunc(x / rectSize);

    fillRandomCellsAround(indexOfX, indexOfY);
    if (!storageFallingRects) updateAnimation();
  };

  return (
    <div className="App">
      <canvas
        id="canvas"
        ref={canvasRef}
        onClick={() => removeRects()}
        onMouseMove={(e) =>
          addRectToStorage(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        }
      ></canvas>
    </div>
  );
}

export default App;
