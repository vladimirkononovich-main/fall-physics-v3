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
