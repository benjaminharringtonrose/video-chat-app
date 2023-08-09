import { atom, useRecoilState } from "recoil";
import { ColorSchemeName } from "react-native";

interface ISettingsState {
  theme: ColorSchemeName;
}

export const settingsState = atom<ISettingsState>({
  key: "settingsState",
  default: {
    theme: undefined,
  },
});

export const useSettings = () => {
  const [state, setState] = useRecoilState(settingsState);

  const setTheme = (theme: ColorSchemeName) => {
    setState((state) => ({ ...state, theme }));
  };

  return {
    theme: state.theme,
    setTheme,
  };
};
