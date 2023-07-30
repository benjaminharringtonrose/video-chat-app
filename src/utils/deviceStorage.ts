import * as SecureStore from "expo-secure-store";
import firebase from "firebase/compat/app";

export const getUser = async () => {
  let rawUser = await SecureStore.getItemAsync("user");
  if (rawUser !== null) {
    const user = JSON.parse(rawUser) as firebase.User;
    return user;
  }
  return rawUser;
};

export const setUser = async (user: firebase.User) => {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
};
