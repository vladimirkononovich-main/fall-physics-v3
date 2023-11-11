export interface IRect {
  x: number;
  y: number;
}

export interface IRowInStorage {
  startY: number;
  endY: number;
  rects: IRect[];
}
