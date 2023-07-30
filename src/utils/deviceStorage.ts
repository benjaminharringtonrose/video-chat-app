import * as SecureStore from "expo-secure-store";

export const getUser = async () => {
  let rawUser = await SecureStore.getItemAsync("uid");
  return rawUser;
};

export const setUser = async (uid: string) => {
  await SecureStore.setItemAsync("uid", uid);
};

export const removeUser = async () => {
  await SecureStore.deleteItemAsync("uid");
};
