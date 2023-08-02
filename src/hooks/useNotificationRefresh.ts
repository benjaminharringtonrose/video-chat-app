import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { db } from "../api/firebase";
import { Collection, QueryKey } from "../types";

interface IUseNotificationRefreshParams {
  isEmpty: boolean;
  userId?: string;
}

const useNotificationRefresh = ({ isEmpty }: IUseNotificationRefreshParams) => {
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      if (!isEmpty) {
        setTimeout(async () => {
          const notifications = await db
            .collection(Collection.Notifications)
            .where(QueryKey.ReceiverId, "==", user?.uid)
            .get();
          notifications.forEach(async (notification) => {
            await db
              .collection(Collection.Notifications)
              .doc(notification.id)
              .update({ viewed: true });
          });
          setUnreadNotifications(false);
        }, 2000);
      }
    }, [isEmpty])
  );

  useEffect(() => {
    if (isFocused) {
      setTimeout(async () => {
        const notifications = await db
          .collection(Collection.Notifications)
          .where(QueryKey.ReceiverId, "==", user?.uid)
          .get();
        notifications.forEach(async (notification) => {
          await db
            .collection(Collection.Notifications)
            .doc(notification.id)
            .update({ viewed: true });
        });
        setUnreadNotifications(false);
      }, 2000);
    }
  }, [isFocused, friendRequests, invitations]);
};
