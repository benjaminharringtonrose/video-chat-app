import * as SecureStore from "expo-secure-store";
import { ColorSchemeName } from "react-native";

export const getUser = async () => {
  let uid = await SecureStore.getItemAsync("uid");
  return uid;
};

export const setUser = async (uid: string) => {
  await SecureStore.setItemAsync("uid", uid);
};

export const removeUser = async () => {
  await SecureStore.deleteItemAsync("uid");
};

export const getTheme = async () => {
  const theme = await SecureStore.getItemAsync("theme");
  return theme as ColorSchemeName;
};

export const setTheme = async (theme?: string | null) => {
  if (theme) {
    await SecureStore.setItemAsync("theme", theme);
  }
};
