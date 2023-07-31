import { FC, useEffect } from "react";
import { db } from "../../api/firebase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "../../atoms/auth";
import { INotification, IUser, NotificationType } from "../../types";
import { notificationsState } from "../../atoms/notifications";
import { friendsState } from "../../atoms/friends";

const Listeners: FC = () => {
  const { user } = useRecoilValue(authState);
  const setNotifications = useSetRecoilState(notificationsState);
  const setAuth = useSetRecoilState(authState);
  const setFriends = useSetRecoilState(friendsState);

  useEffect(() => {
    if (!user?.uid) return;

    db.collection("notifications")
      .where("type", "==", NotificationType.FriendRequest)
      .onSnapshot((snapshot) => {
        const friendRequests: INotification[] = [];
        snapshot.forEach((friendRequest) => {
          if (friendRequest) {
            const data = friendRequest.data() as INotification;
            if (data.recieverId === user?.uid) {
              friendRequests.push(data);
            }
          }
        });
        setNotifications((state) => ({
          ...state,
          friendRequests,
        }));
      });
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;

    db.collection("users")
      .where("uid", "==", user?.uid)
      .onSnapshot(async (snapshot) => {
        if (snapshot.docs[0].exists) {
          const friends: IUser[] = [];

          const data = snapshot.docs[0].data() as IUser;

          setAuth((state) => ({ ...state, user: data }));

          if (data.friends) {
            for (const friendId of data.friends) {
              const doc = await db.collection("users").doc(friendId).get();
              if (doc.exists) {
                const friend = doc.data() as IUser;
                friends.push(friend);
              }
            }
            setFriends(friends);
          }
        }
      });
  }, [user?.uid]);

  return null;
};

export default Listeners;
