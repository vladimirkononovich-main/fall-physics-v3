export interface IRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  isFalling: boolean;
}

export interface IRowInStorage {
  startY: number;
  endY: number;
  fallingRectsCount: number;
  rects: IRect[];
}
