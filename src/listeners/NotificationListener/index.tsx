import { FC, useEffect, useRef, useState } from "react";
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
  const { unreadNotifications } = useNotifications();
  const setNotifications = useSetRecoilState(notificationsState);

  const soundRef = useRef<Sound | null>(null);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/sounds/incoming-call.mp3")
    );
    await sound.playAsync();
    await sound.setIsLoopingAsync(true);
    soundRef.current = sound;
  };

  const stopSound = async () => {
    await soundRef.current?.setIsLoopingAsync(false);
    await soundRef.current?.stopAsync();
  };

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
    console.log("listening to invitations");
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
          console.log("playing sound");
          playSound();
        } else {
          console.log("stopping sound");
          stopSound();
        }

        setNotifications((state) => ({
          ...state,
          invitations: notifications,
        }));
      });

    return () => unsubscribe();
  }, [user?.uid]);

  return null;
};

export default NotificationLister;
