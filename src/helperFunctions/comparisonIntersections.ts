import { IRect } from "./../interfaces";

export const compareRectAbove = (rectAbove: IRect, rect: IRect) => {
  if (rectAbove.bottom > rect.top) return true;
  return false;
};
export const compareRectBelow = (rectBelow: IRect, rect: IRect) => {
  if (rectBelow.top < rect.bottom) return true;
  return false;
};
export const compareRectLeft = (rectLeft: IRect, rect: IRect) => {
  if (rectLeft.right > rect.left) return true;
  return false;
};
export const compareRectRight = (rectRight: IRect, rect: IRect) => {
  if (rectRight.left < rect.right) return true;
  return false;
};
export const compareRectTopLeft = (rectTopLeft: IRect, rect: IRect) => {
  if (rectTopLeft.bottom > rect.top && rectTopLeft.right > rect.left)
    return true;
  return false;
};
export const compareRectTopRight = (rectTopRight: IRect, rect: IRect) => {
  if (rectTopRight.bottom > rect.top && rectTopRight.left < rect.right)
    return true;
  return false;
};
export const compareRectBottomLeft = (rectBottomLeft: IRect, rect: IRect) => {
  if (rectBottomLeft.top < rect.bottom && rectBottomLeft.right > rect.left)
    return true;
  return false;
};
export const compareRectBottomRight = (rectBottomRight: IRect, rect: IRect) => {
  if (rectBottomRight.top < rect.bottom && rectBottomRight.left < rect.right)
    return true;
  return false;
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

interface IParametersForFallingRect {
  currTop: number;
  currBottom: number;
  currSpeed: number;
  rectsBelowSpeed: number;
  collidingRectangles: IRect[];
}

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
    currSpeed: collidingRectangles[0].speed,
    rectsBelowSpeed: collidingRectangles[0].speed + 1,
    collidingRectangles,
  };

};
