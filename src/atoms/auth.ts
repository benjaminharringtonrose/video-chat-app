import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import { atom, useRecoilState } from "recoil";
import { auth, db } from "../api/firebase";
import * as deviceStorage from "../utils";
import { IUser } from "../types";

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

  const getPersistedUser = async () => {
    const uid = await deviceStorage.getUser();
    if (uid) {
      const doc = await db.collection("users").doc(uid).get();
      if (doc.exists) {
        const userData = doc.data() as IUser;
        setUser(userData);
      }
    }
  };

  async function onAuthStateChanged(user: firebase.User | null) {
    if (user) {
      deviceStorage.setUser(user.uid);
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists) {
        const userData = doc.data() as IUser;
        setUser(userData);
      }
    } else {
      deviceStorage.removeUser();
      setUser(null);
    }
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    getPersistedUser();
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

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
    signOut,
  };
};
