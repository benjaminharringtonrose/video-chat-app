import { FC, useEffect, useState } from "react";
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
import { Sound } from "expo-av/build/Audio";
import { Audio } from "expo-av";

const NotificationLister: FC = () => {
  const { user } = useRecoilValue(authState);
  const { unreadNotifications, incomingCall } = useNotifications();
  const setNotifications = useSetRecoilState(notificationsState);

  const [sound, setSound] = useState<Sound>();

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/sounds/incoming-call.mp3")
    );
    await sound.playAsync();
    await sound.setIsLoopingAsync(true);
    setSound(sound);
  };

  const stopSound = async () => {
    await sound?.stopAsync();
  };

  useEffect(() => {
    if (incomingCall) {
      playSound();
    } else {
      stopSound();
    }
  }, [incomingCall]);

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
    if (!user?.uid) return;
    const unsubscribe = db
      .collection(Collection.Notifications)
      .where(QueryKey.ReceiverId, "==", user?.uid)
      .where(QueryKey.Type, "==", NotificationType.Invitation)
      .onSnapshot((snapshot) => {
        const invitations: INotification[] = [];

        snapshot.forEach((invitation) => {
          const data = invitation.data() as INotification;
          invitations.push(data);

          if (!data.viewed) {
            if (!unreadNotifications) {
              setNotifications((state) => ({
                ...state,
                unreadNotifications: true,
              }));
            }

            if (!incomingCall) {
              setNotifications((state) => ({
                ...state,
                incomingCall: true,
              }));
            }
          }
        });

        setNotifications((state) => ({
          ...state,
          invitations,
        }));
      });
    () => unsubscribe();
  }, [user?.uid]);

  return null;
};

export default NotificationLister;
