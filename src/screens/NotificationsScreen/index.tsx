import React, { FC, useCallback, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  SectionListRenderItemInfo,
  SectionListData,
} from "react-native";
import styles from "./styles";
import { useNotifications } from "../../atoms/notifications";
import { EmptyStateView, ItemSeparator, ListItem } from "../../components";
import { ListItemType } from "../../components/ListItem";
import firebase from "firebase/compat";
import { db } from "../../api/firebase";
import { useAuth } from "../../atoms/auth";
import {
  CallMode,
  Collection,
  INotification,
  NotificationType,
  QueryKey,
} from "../../types";
import { useFriends } from "../../atoms/friends";
import { Color, FontFamily } from "../../constants";
import { isFriend } from "../../utils";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { NavProp, Routes } from "../../navigation/types";
import { useRoom } from "../../atoms/room";

const NotificationsScreen: FC = () => {
  const { user } = useAuth();
  const { friends } = useFriends();
  const isFocused = useIsFocused();

  const { friendRequests, invitations, setUnreadNotifications } =
    useNotifications();

  const { setNotificationId } = useRoom();

  const { navigate } = useNavigation<NavProp["navigation"]>();

  const isEmpty = !friendRequests.length && !invitations.length;

  useFocusEffect(
    useCallback(() => {
      console.log("yip");
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
      }, 1000);
    }
  }, [isFocused, friendRequests, invitations]);

  const acceptFriendRequest = async (senderId: string) => {
    await db
      .collection(Collection.Users)
      .doc(user?.uid)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(senderId),
      });

    await db
      .collection(Collection.Users)
      .doc(senderId)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(user?.uid),
      });
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<INotification>;
  }) => {
    if (section.data?.length) {
      return (
        <View style={{ backgroundColor: Color.background }}>
          <Text
            style={{
              paddingLeft: 10,
              fontFamily: FontFamily.Light,
              color: Color.text,
            }}
          >
            {section.title}
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderItem = ({ item }: SectionListRenderItemInfo<INotification>) => {
    switch (item.type) {
      case NotificationType.FriendRequest:
        return (
          <ListItem
            type={ListItemType.FriendRequest}
            key={item.senderId}
            username={item.senderUsername}
            label={"wants to be your friend"}
            isFriend={isFriend(item?.senderId ?? "", friends)}
            onPress={() => acceptFriendRequest(item?.senderId ?? "")}
            viewed={item.viewed}
          />
        );
      case NotificationType.Invitation:
        return (
          <ListItem
            type={ListItemType.Invitation}
            key={item.senderId}
            username={item.senderUsername}
            label={"wants you to join his room"}
            onPress={() => {
              setNotificationId(item?.id ?? "");
              navigate(Routes.VideoChat, {
                mode: CallMode.Join,
                friendId: item.senderId,
                roomId: item.roomId,
              });
            }}
            viewed={item.viewed}
            calling={item.calling}
            callEnded={item.callEnded}
            callAnswered={item.callAnswered}
          />
        );
      default:
        return null;
    }
  };

  const sections = [
    {
      title: "Friend Requests",
      data: friendRequests,
      type: NotificationType.FriendRequest,
    },
    {
      title: "Room Invitations",
      data: invitations,
      type: NotificationType.Invitation,
    },
  ];

  if (isEmpty) {
    return (
      <EmptyStateView
        title={"You dont have any notifications"}
        lottie={require("../../../assets/lottie/no_notifications.json")}
      />
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: Color.background }]}>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id ?? index.toString()}
        contentContainerStyle={{ paddingTop: 20 }}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default NotificationsScreen;
