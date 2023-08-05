import { FC, useEffect } from "react";
import { db } from "../../api/firebase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "../../atoms/auth";
import { Collection, IUser, QueryKey } from "../../types";
import { friendsState } from "../../atoms/friends";

const UserListener: FC = () => {
  const { user } = useRecoilValue(authState);
  const setAuth = useSetRecoilState(authState);
  const setFriends = useSetRecoilState(friendsState);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = db
      .collection(Collection.Users)
      .where(QueryKey.Uid, "==", user?.uid)
      .onSnapshot(async (snapshot) => {
        const doc = snapshot.docs[0];

        if (doc.exists) {
          const friends: IUser[] = [];
          const user = doc.data() as IUser;

          setAuth((state) => ({
            ...state,
            user,
          }));

          if (user.friends) {
            for (const friendId of user.friends) {
              const doc = await db
                .collection(Collection.Users)
                .doc(friendId)
                .get();
              if (doc.exists) {
                const friend = doc.data() as IUser;
                friends.push(friend);
              }
            }
            setFriends(friends);
          } else {
            setFriends([]);
          }
        }
      });
    return () => unsubscribe();
  }, [user?.uid]);

  return null;
};

export default UserListener;
