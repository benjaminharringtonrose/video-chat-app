import { FC, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { db } from "../../api/firebase";
import { authState } from "../../atoms/auth";
import {
  notificationsState,
  useNotifications,
} from "../../atoms/notifications";
import {
  Collection,
  INotification,
  NotificationType,
  QueryKey,
} from "../../types";
import { roomState, useRoom } from "../../atoms/room";
import { orderBy } from "lodash";

const NotificationLister: FC = () => {
  const { user } = useRecoilValue(authState);
  const { unreadNotifications } = useNotifications();
  const setNotifications = useSetRecoilState(notificationsState);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = db
      .collection(Collection.Notifications)
      .where(QueryKey.ReceiverId, "==", user?.uid)
      .where(QueryKey.Type, "==", NotificationType.FriendRequest)
      .onSnapshot((snapshot) => {
        const friendRequests: INotification[] = [];

        snapshot.forEach((notification) => {
          const data = notification.data() as INotification;
          friendRequests.push(data);

          if (!data.viewed && !unreadNotifications) {
            setNotifications((state) => ({
              ...state,
              unreadNotifications: true,
            }));
          }
        });

        setNotifications((state) => ({
          ...state,
          friendRequests: orderBy(friendRequests, ["createdAt"], ["desc"]),
        }));
      });
    () => unsubscribe();
  }, [user?.uid]);

  return null;
};

export default NotificationLister;
