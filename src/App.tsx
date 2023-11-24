import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  comparePositionsForFallenRects,
  comparePositionsForFallingRects,
  compareRectAbove,
  compareRectBelow,
  compareRectBottomLeft,
  compareRectBottomRight,
  compareRectLeft,
  compareRectRight,
  compareRectTopLeft,
  compareRectTopRight,
} from "./helperFunctions/comparisonIntersections";
import { getRandomIntInclusive } from "./helperFunctions/random";
import { IRect, IRowInStorage } from "./interfaces";

function App() {
  const canvasRef = useRef(null);
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let storage: IRowInStorage[] | null;
  const [rectSize, setRectSize] = useState(30);
  const [perimeterSizeForFilling, setPerimeterSizeForFilling] = useState(20);
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

  const updateAnimation = () => {
    if (!storage) return;
    storageFallingRects = 0;

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

      storageFallingRects += row.fallingRectsCount;
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
    const speed = getRandomIntInclusive(4, 12);

    const newRect: IRect = {
      isFalling: true,
      speed: speed,
      size: rectSize,
      top: y,
      bottom: y + rectSize,
      left: x,
      right: x + rectSize,
    };

    const rowAbove = storage![indexOfY + 1];
    const rowBelow = storage![indexOfY - 1];
    const currentRow = storage![indexOfY];
    if (!rowAbove || !rowBelow) return false;

    const rectLeft = currentRow.rects[indexOfX - 1];
    const rectRight = currentRow.rects[indexOfX + 1];
    const rectAbove = rowAbove.rects[indexOfX];
    const rectBelow = rowBelow.rects[indexOfX];
    const rectTopLeft = rowAbove.rects[indexOfX - 1];
    const rectTopRight = rowAbove.rects[indexOfX + 1];
    const rectBottomLeft = rowBelow.rects[indexOfX - 1];
    const rectBottomRight = rowBelow.rects[indexOfX + 1];

    if (rectLeft && compareRectLeft(rectLeft, newRect)) return false;
    if (rectRight && compareRectRight(rectRight, newRect)) return false;
    if (rectAbove && compareRectAbove(rectAbove, newRect)) return false;
    if (rectBelow && compareRectBelow(rectBelow, newRect)) return false;
    if (rectTopLeft && compareRectTopLeft(rectTopLeft, newRect)) return false;
    if (rectTopRight && compareRectTopRight(rectTopRight, newRect))
      return false;
    if (rectBottomLeft && compareRectBottomLeft(rectBottomLeft, newRect))
      return false;
    if (rectBottomRight && compareRectBottomRight(rectBottomRight, newRect))
      return false;

    return newRect;
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
        // const speed = getRandomIntInclusive(1, 5);

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

  const removeHalfRects = () => {
    if (!storage) return;
    let evenRect = false;

    for (let i = storage.length - 1; i >= 0; i--) {
      storage[i].rects.forEach((rect, index) => {
        rect.isFalling = true;
        storage![i].fallingRectsCount += 1;
        storageFallingRects += storage![i].fallingRectsCount;
        if (!evenRect) {
          evenRect = true;
          return;
        }

        ctx?.clearRect(rect.left, rect.top, rectSize, rectSize);
        evenRect = false;
        delete storage![i].rects[index];
        storage![i].fallingRectsCount -= 1;
      });
    }
  };

  const addRectToStorage = (x: number, y: number) => {
    if (!storage) return;

    const indexOfY = Math.trunc(y / rectSize);
    const indexOfX = Math.trunc(x / rectSize);
    // const speed = getRandomIntInclusive(1, 5);

    // const rect: IRect = {
    //   isFalling: true,
    //   size: rectSize,
    //   speed: speed,
    //   left: x,
    //   top: y,
    //   bottom: y + rectSize,
    //   right: x + rectSize,
    // };

    // storage[indexOfY].rects[indexOfX] = rect;
    // storage[indexOfY].fallingRectsCount += 1;

    fillRandomCellsAround(indexOfX, indexOfY);

    // ctx!.fillStyle = "#670b0b"
    if (!storageFallingRects) updateAnimation();
  };
  // setInterval(() => {
  //   console.log(storage);
  // }, 5000);

  return (
    <div className="App">
      <canvas
        id="canvas"
        ref={canvasRef}
        onClick={() => removeHalfRects()}
        onMouseMove={(e) =>
          addRectToStorage(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        }
        // onClick={(e) =>
        //   addRectToStorage(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        // }
      ></canvas>
    </div>
  );
}

export default App;
