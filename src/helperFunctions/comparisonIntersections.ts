import { IParametersForFallingRect } from './helperFunctionsModels';
import { IRect, IRowInStorage } from "../appModels";

export const compareRectAround = (
  currentRow: IRowInStorage,
  rowBelow: IRowInStorage,
  rowAbove: IRowInStorage,
  newRect: IRect,
  indexOfX: number
) => {
  if (!rowAbove || !rowBelow) return false;

  const rectLeft = currentRow.rects[indexOfX - 1];
  const rectRight = currentRow.rects[indexOfX + 1];
  const rectAbove = rowAbove.rects[indexOfX];
  const rectBelow = rowBelow.rects[indexOfX];
  const rectTopLeft = rowAbove.rects[indexOfX - 1];
  const rectTopRight = rowAbove.rects[indexOfX + 1];
  const rectBottomLeft = rowBelow.rects[indexOfX - 1];
  const rectBottomRight = rowBelow.rects[indexOfX + 1];

  if (rectLeft) if (rectLeft.right > newRect.left) return false;
  if (rectRight) if (rectRight.left < newRect.right) return false;
  if (rectAbove) if (rectAbove.bottom > newRect.top) return false;
  if (rectBelow) if (rectBelow.top < newRect.bottom) return false;

  if (rectTopLeft) {
    if (rectTopLeft.bottom > newRect.top && rectTopLeft.right > newRect.left)
      return false;
  }
  if (rectTopRight) {
    if (rectTopRight.bottom > newRect.top && rectTopRight.left < newRect.right)
      return false;
  }
  if (rectBottomLeft) {
    if (
      rectBottomLeft.top < newRect.bottom &&
      rectBottomLeft.right > newRect.left
    )
      return false;
  }
  if (rectBottomRight) {
    if (
      rectBottomRight.top < newRect.bottom &&
      rectBottomRight.left < newRect.right
    )
      return false;
  }

  return newRect;
};

export const comparePositionsForFallenRects = (
  rectPreBelow: IRect,
  rectPreBottomLeft: IRect,
  rectPreBottomRight: IRect,
  rect: IRect
) => {
  if (rectPreBelow) {
    if (!rectPreBelow.isFalling) return true;
  }
  if (rectPreBottomLeft) {
    if (!rectPreBottomLeft.isFalling && rectPreBottomLeft.right >= rect.left)
      return true;
  }
  if (rectPreBottomRight) {
    if (!rectPreBottomRight.isFalling && rectPreBottomRight.left <= rect.right)
      return true;
  }

  return false;
};

export const comparePositionsForFallingRects = (
  rectBelow: IRect,
  rectBottomLeft: IRect,
  rectBottomRight: IRect,
  rect: IRect
): IParametersForFallingRect | false => {
  const collidingRectangles: IRect[] = [];

  if (rectBelow) {
    if (rectBelow.isFalling && rect.bottom + rect.speed >= rectBelow.top) {
      collidingRectangles.push(rectBelow);
    }
  }
  if (rectBottomLeft) {
    if (
      rectBottomLeft.isFalling &&
      rect.bottom + rect.speed >= rectBottomLeft.top &&
      rectBottomLeft.right >= rect.left
    ) {
      collidingRectangles.push(rectBottomLeft);
    }
  }
  if (rectBottomRight) {
    if (
      rectBottomRight.isFalling &&
      rect.bottom + rect.speed >= rectBottomRight.top &&
      rectBottomRight.left <= rect.right
    ) {
      collidingRectangles.push(rectBottomRight);
    }
  }

  if (!collidingRectangles.length) return false;

  return {
    currTop: collidingRectangles[0].top - rect.size,
    currBottom: collidingRectangles[0].top,
    currSpeed: rect.speed - 1 || 1,
    rectsBelowSpeed: rect.speed,
    collidingRectangles,
  };
};
