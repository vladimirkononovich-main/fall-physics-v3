import { IRect } from "../appModels";

export interface IParametersForFallingRect {
    currTop: number;
    currBottom: number;
    currSpeed: number;
    rectsBelowSpeed: number;
    collidingRectangles: IRect[];
  }