import { useState } from "react";
import { atom, useRecoilState } from "recoil";
import { auth, db } from "../api/firebase";
import * as deviceStorage from "../utils";
import { IUser } from "../types";
import { useNotifications } from "./notifications";

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
      const doc = await db.collection("users").doc(uid).get();
      if (doc.exists) {
        const userData = doc.data() as IUser;
        setUser(userData);
      }
      const notifications = await db
        .collection("notifications")
        .where("recieverId", "==", uid)
        .get();
      notifications.forEach((notification) => {
        if (notification.exists && !notification.data().viewed) {
          setUnreadNotifications(true);
        }
      });
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

  return {
    initializing,
    user: state.user,
    setUser,
    setInitializing,
    signOut,
    startup,
  };
};
