import { FC, useEffect } from "react";
import { db } from "../../api/firebase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "../../atoms/auth";
import { INotification, IUser, NotificationType } from "../../types";
import { notificationsState } from "../../atoms/notifications";

const Listeners: FC = () => {
  const { user } = useRecoilValue(authState);
  const setNotifications = useSetRecoilState(notificationsState);
  const setAuth = useSetRecoilState(authState);

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
      .onSnapshot((snapshot) => {
        if (snapshot.docs[0].exists) {
          const data = snapshot.docs[0].data() as IUser;
          setAuth((state) => ({ ...state, user: data }));
        }
      });
  }, [user?.uid]);

  return null;
};

export default Listeners;
