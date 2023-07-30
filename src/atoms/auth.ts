import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import { atom, useRecoilState } from "recoil";
import { auth } from "../api/firebase";
import * as deviceStorage from "../utils";

interface IAuthState {
  user: firebase.User | null;
}

const authState = atom<IAuthState>({
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
    }
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    getPersistedUser();
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const setUser = (user: firebase.User | null) => {
    setState((state) => ({ ...state, user }));
  };

  return {
    initializing,
    user: state.user,
    setUser,
  };
};
