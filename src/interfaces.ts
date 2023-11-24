export interface IRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  speed: number;
  isFalling: boolean;
  size: number;
}

export interface IRowInStorage {
  startY: number;
  endY: number;
  fallingRectsCount: number;
  rects: IRect[];
}
