import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import { atom, useRecoilState } from "recoil";
import { auth, db } from "../api/firebase";
import * as deviceStorage from "../utils";

interface IAuthState {
  user: firebase.User | null;
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
    const user = await deviceStorage.getUser();
    if (user) {
      setUser(user);
    }
  };

  function onAuthStateChanged(user: firebase.User | null) {
    if (user) {
      deviceStorage.setUser(user);
      setUser(user);
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

  const setUser = async (user: firebase.User | null) => {
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
