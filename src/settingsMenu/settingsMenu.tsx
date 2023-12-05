import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import "./settingsMenu.css";
import { setMenuSettings } from "./settingsMenuSlice";

interface ISettingsMenuProps {
  setShowSettingMenu: (value: React.SetStateAction<boolean>) => void;
  toggleSettingMenu: (e: KeyboardEvent) => void;
}

export const SettingsMenu = ({
  setShowSettingMenu,
  toggleSettingMenu,
}: ISettingsMenuProps) => {
  const settingsMenu = useSelector((state: RootState) => state.settingsMenu);
  const canvasHeight =
    window.innerHeight - (window.innerHeight % settingsMenu.rectSize.value);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setMenuSettings({
        ...settingsMenu,
        perimeterSizeForFilling: {
          ...settingsMenu.perimeterSizeForFilling,
          inputMaxValue: canvasHeight / settingsMenu.rectSize.value,
        },
      })
    );
  }, []);

  const closeMenu = () => {
    document.body.removeEventListener("keydown", toggleSettingMenu);
    setShowSettingMenu(false);
  };

  return (
    <>
      <div className="backdrop" onClick={closeMenu}></div>
      <div className="settings-menu">
        <button
          type="button"
          className="settings-menu__button"
          onClick={closeMenu}
        >
          Esc
        </button>
        {Object.keys(settingsMenu).map((key) => {
          const field = settingsMenu[key as keyof typeof settingsMenu];

          return (
            <div key={key} className="setting-menu__field-wrapper">
              <label htmlFor={key}>
                {key}&nbsp;
                {field.inputType === "range" && field!.value}
                {field?.unitType}
              </label>
              <div className="setting-menu__input-wrapper">
                {field.inputType === "range" && (
                  <label htmlFor={key}>{field.inputMinValue}</label>
                )}
                <input
                  min={field.inputMinValue}
                  max={field.inputMaxValue}
                  id={key}
                  type={field.inputType}
                  value={field.value}
                  onInput={(e) => {
                    const value = e.currentTarget.value;

                    dispatch(
                      setMenuSettings({
                        ...settingsMenu,
                        perimeterSizeForFilling: {
                          ...settingsMenu.perimeterSizeForFilling,
                          inputMaxValue:
                            canvasHeight / settingsMenu.rectSize.value,
                        },
                        [key]: {
                          ...field,
                          value: Number.isNaN(+value) ? value : +value,
                        },
                      })
                    );
                  }}
                />
                {field.inputType === "range" && (
                  <label htmlFor={key}>{field.inputMaxValue}</label>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
