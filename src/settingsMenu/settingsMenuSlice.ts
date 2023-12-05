import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISettingsMenu } from "./settingsMenuModels";

const canvasHeight = window.innerHeight - (window.innerHeight % 20);

const initialState: ISettingsMenu = {
  rectMinSpeed: {
    inputType: "range",
    value: 3,
    unitType: "px",
    inputMinValue: 1,
    inputMaxValue: 1,
  },
  rectMaxSpeed: {
    inputType: "range",
    value: 8,
    unitType: "px",
    inputMinValue: 1,
    inputMaxValue: 1,
  },
  rectSize: {
    inputType: "range",
    value: 10,
    unitType: "px",
    inputMinValue: 1,
    inputMaxValue: 100,
  },
  perimeterSizeForFilling: {
    inputType: "range",
    value: canvasHeight / 10,
    inputMinValue: 1,
    inputMaxValue: 1,
  },
  canvasColor: {
    inputType: "color",
    value: "#000000",
    inputMinValue: 0,
    inputMaxValue: 0,
  },
  rectColor: {
    inputType: "color",
    value: "#bababa",
    inputMinValue: 0,
    inputMaxValue: 0,
  },
  fallingRectColor: {
    inputType: "color",
    value: "#860404",
    inputMinValue: 0,
    inputMaxValue: 0,
  },
};

export const settingsMenuSlice = createSlice({
  name: "settingsMenu",
  initialState,
  reducers: {
    setMenuSettings: (state, action: PayloadAction<ISettingsMenu>) => {
      const rectSize = action.payload.rectSize;
      const rectMaxSpeed = action.payload.rectMaxSpeed;
      const rectMinSpeed = action.payload.rectMinSpeed;
      const perimeterSizeForFilling = action.payload.perimeterSizeForFilling;

      const rectMaxSpeedValue =
        rectSize.value <= rectMaxSpeed.value
          ? rectSize.value
          : rectMaxSpeed.value;
      const rectMinSpeedValue =
        rectMinSpeed.value >= rectMaxSpeedValue
          ? rectMaxSpeedValue
          : rectMinSpeed.value;

      const perimeterSizeForFillingValue =
        perimeterSizeForFilling.value >= perimeterSizeForFilling.inputMaxValue
          ? perimeterSizeForFilling.inputMaxValue
          : perimeterSizeForFilling.value;

      return {
        ...action.payload,
        rectMinSpeed: {
          ...rectMinSpeed,
          value: rectMinSpeedValue,
          inputMaxValue: rectMaxSpeedValue,
        },
        rectMaxSpeed: {
          ...rectMaxSpeed,
          value: rectMaxSpeedValue,
          inputMaxValue: rectSize.value,
        },

        perimeterSizeForFilling: {
          ...perimeterSizeForFilling,
          value: perimeterSizeForFillingValue,
        },
      };
    },
  },
});
export const { setMenuSettings } = settingsMenuSlice.actions;

export default settingsMenuSlice.reducer;
