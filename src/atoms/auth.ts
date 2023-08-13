import { useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { atom, useRecoilState } from "recoil";
import { auth, db } from "../api/firebase";
import * as deviceStorage from "../utils";
import { Collection, IUser, QueryKey } from "../types";
import { useNotifications } from "./notifications";
import { Platform } from "react-native";
import { updateUser } from "../api/firestore";

interface IAuthState {
  user: IUser | null;
}

export const authState = atom<IAuthState>({
  key: "authState",
  default: {
    user: null,
  },
});

export const useAuth = () => {
  const [initializing, setInitializing] = useState(true);

  const [state, setState] = useRecoilState(authState);

  const { setUnreadNotifications } = useNotifications();

  const startup = async () => {
    setInitializing(true);
    const uid = await deviceStorage.getUser();
    if (uid) {
      const doc = await db.collection(Collection.Users).doc(uid).get();
      if (doc.exists) {
        const userData = doc.data() as IUser;
        setUser(userData);

        const notifications = await db
          .collection(Collection.Notifications)
          .where(QueryKey.ReceiverId, "==", uid)
          .get();

        notifications.forEach((notification) => {
          if (notification.exists && !notification.data().viewed) {
            setUnreadNotifications(true);
          }
        });
      }
      // const pushToken = await registerForPushNotificationsAsync();
      // await updateUser(uid, { pushToken });
    }
    setInitializing(false);
  };

  const setUser = async (user: IUser | null) => {
    setState((state) => ({ ...state, user }));
  };

  const signOut = async () => {
    await auth.signOut();
    await deviceStorage.removeUser();
    setState((state) => ({ ...state, user: null }));
  };

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "7aa0077d-36af-406f-819f-c6258822a50a",
        })
      ).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  };

  return {
    initializing,
    user: state.user,
    setUser,
    setInitializing,
    signOut,
    startup,
  };
};
