import { atom, useRecoilState } from "recoil";
import { Collection, IUser } from "../types";
import { useAuth } from "./auth";
import { db } from "../api/firebase";
import { useState } from "react";
import { LayoutAnimation } from "react-native";

export const friendsState = atom<IUser[]>({
  key: "friendsState",
  default: [],
});

export const useFriends = () => {
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [state, setState] = useRecoilState(friendsState);

  const { user } = useAuth();

  const getFriends = async (friendIds: string[]) => {
    setLoadingFriends(true);

    const friends: IUser[] = [];

    for (const friendId of friendIds) {
      const doc = await db.collection(Collection.Users).doc(friendId).get();
      if (doc.exists) {
        const friend = doc.data() as IUser;
        friends.push(friend);
      }
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setState(friends);
    setLoadingFriends(false);
  };
  return {
    loadingFriends,
    friends: state,
    getFriends,
  };
};
