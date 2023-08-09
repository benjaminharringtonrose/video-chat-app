import { LightColors } from "../constants/Color";

declare module "@react-navigation/native" {
  export type ExtendedTheme = {
    dark: boolean;
    colors: typeof theme;
  };
  export function useTheme(): ExtendedTheme;
}
