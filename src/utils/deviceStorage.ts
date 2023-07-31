import * as SecureStore from "expo-secure-store";

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
