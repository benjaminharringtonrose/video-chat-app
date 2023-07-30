import { atom, useRecoilState } from "recoil";
import { IUser } from "../types";
import { useAuth } from "./auth";
import { db } from "../api/firebase";
import { useState } from "react";

export const friendsState = atom<IUser[]>({
  key: "friendsState",
  default: [],
});

export const useFriends = () => {
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [state, setState] = useRecoilState(friendsState);

  const { user } = useAuth();

  const getFriends = async () => {
    if (!user?.friends) return;

    setLoadingFriends(true);

    const friends: IUser[] = [];

    for (const friendId of user.friends) {
      const doc = await db.collection("users").doc(friendId).get();
      if (doc.exists) {
        const friend = doc.data() as IUser;
        friends.push(friend);
      }
    }

    setState(friends);

    setLoadingFriends(false);
  };
  return {
    loadingFriends,
    friends: state,
    getFriends,
  };
};
