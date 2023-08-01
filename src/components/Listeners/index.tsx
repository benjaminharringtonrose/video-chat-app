import { FC, useEffect } from "react";
import { db } from "../../api/firebase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Audio } from "expo-av";
import { authState } from "../../atoms/auth";
import { INotification, IUser, NotificationType } from "../../types";
import {
  notificationsState,
  useNotifications,
} from "../../atoms/notifications";
import { friendsState } from "../../atoms/friends";

const Listeners: FC = () => {
  const { user } = useRecoilValue(authState);
  const { unreadNotifications, incomingCall } = useNotifications();
  const setNotifications = useSetRecoilState(notificationsState);
  const setAuth = useSetRecoilState(authState);
  const setFriends = useSetRecoilState(friendsState);

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/sounds/incoming-call.mp3")
    );
    await sound.playAsync();
  }

  useEffect(() => {
    // friend requests
    if (!user?.uid) return;
    db.collection("notifications")
      .where("receiverId", "==", user?.uid)
      .where("type", "==", NotificationType.FriendRequest)
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
  }, [user?.uid]);

  useEffect(() => {
    // room invitations
    if (!user?.uid) return;
    db.collection("notifications")
      .where("receiverId", "==", user?.uid)
      .where("type", "==", NotificationType.Invitation)
      .onSnapshot((snapshot) => {
        const invitations: INotification[] = [];
        snapshot.forEach((invitation) => {
          const data = invitation.data() as INotification;
          invitations.push(data);
          if (!data.viewed && !unreadNotifications) {
            setNotifications((state) => ({
              ...state,
              unreadNotifications: true,
            }));
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

          // populate friends
          if (data.friends) {
            for (const friendId of data.friends) {
              const doc = await db.collection("users").doc(friendId).get();
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
  }, [user?.uid]);

  useEffect(() => {
    if (incomingCall) {
      // play sound
      playSound();
    }
  }, [incomingCall]);

  return null;
};

export default Listeners;
