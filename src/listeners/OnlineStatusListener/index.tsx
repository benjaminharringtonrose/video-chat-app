import { FC, useEffect, useRef } from "react";
import { useAuth } from "../../atoms/auth";
import { db } from "../../api/firebase";
import { Collection } from "../../types";
import { AppState } from "react-native";

const OnlineStatusListener: FC = () => {
  const appState = useRef(AppState.currentState);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;
    db.collection(Collection.Users).doc(user?.uid).update({
      isOnline: true,
    });
  }, [user?.uid]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        db.collection(Collection.Users).doc(user?.uid).update({
          isOnline: true,
        });
      }
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        db.collection(Collection.Users).doc(user?.uid).update({
          isOnline: false,
        });
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [user?.uid]);
  return null;
};

export default OnlineStatusListener;
