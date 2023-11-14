export interface IRect {
  x: number;
  y: number;
  isFalling: boolean;
}

export interface IRowInStorage {
  startY: number;
  endY: number;
  fallingRectsCount: number;
  rects: IRect[];
}
