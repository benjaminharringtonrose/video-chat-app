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

const NotificationLister: FC = () => {
  const { user } = useRecoilValue(authState);
  const { unreadNotifications } = useNotifications();
  const setNotifications = useSetRecoilState(notificationsState);
  const setRoom = useSetRecoilState(roomState);

  const { notificationId } = useRoom();

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
          friendRequests,
        }));
      });
    () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || notificationId) {
      console.log("NOTIFICATIONS: NOT LISTENING", user?.username);
      return;
    }
    console.log("NOTIFICATIONS: LISTENING", user?.username);
    const unsubscribe = db
      .collection(Collection.Notifications)
      .where(QueryKey.ReceiverId, "==", user?.uid)
      .where(QueryKey.Type, "==", NotificationType.Invitation)
      .onSnapshot((snapshot) => {
        let incomingCall = false;
        const notifications: INotification[] = [];

        snapshot.forEach((notification) => {
          const data = notification.data() as INotification;
          notifications.push(data);

          if (data.calling) {
            incomingCall = true;
          }

          // logic for the notification badge on bottom tab
          if (!data.viewed && !unreadNotifications) {
            setNotifications((state) => ({
              ...state,
              unreadNotifications: true,
            }));
          }
        });

        if (incomingCall) {
          setRoom((state) => ({
            ...state,
            incomingCall: true,
          }));
        } else {
          setRoom((state) => ({
            ...state,
            incomingCall: false,
          }));
        }

        setNotifications((state) => ({
          ...state,
          invitations: notifications,
        }));
      });

    return () => unsubscribe();
  }, [user?.uid, notificationId]);

  return null;
};

export default NotificationLister;
