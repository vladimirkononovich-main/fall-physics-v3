export interface ISettingsMenu {
    rectSize: {
      inputType: string;
      value: number;
      unitType?: string;
      inputMinValue: number;
      inputMaxValue: number;
    };
    rectMaxSpeed: {
      inputType: string;
      value: number;
      unitType?: string;
      inputMinValue: number;
      inputMaxValue: number;
    };
    rectMinSpeed: {
      inputType: string;
      value: number;
      unitType?: string;
      inputMinValue: number;
      inputMaxValue: number;
    };
    canvasColor: {
      inputType: string;
      value: string;
      unitType?: string;
      inputMinValue: number;
      inputMaxValue: number;
    };
    rectColor: {
      inputType: string;
      value: string;
      unitType?: string;
      inputMinValue: number;
      inputMaxValue: number;
    };
    fallingRectColor: {
      inputType: string;
      value: string;
      unitType?: string;
      inputMinValue: number;
      inputMaxValue: number;
    };
    perimeterSizeForFilling: {
      inputType: string;
      value: number;
      unitType?: string;
      inputMinValue: number;
      inputMaxValue: number;
    };
  }