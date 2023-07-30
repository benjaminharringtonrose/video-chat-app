import * as SecureStore from "expo-secure-store";

export const getUser = async () => {
  console.log("getting user from device storage");
  let rawUser = await SecureStore.getItemAsync("uid");
  console.log(rawUser);
  return rawUser;
};

export const setUser = async (uid: string) => {
  console.log("setting user in device storage");
  await SecureStore.setItemAsync("uid", uid);
};

export const removeUser = async () => {
  await SecureStore.deleteItemAsync("uid");
};
