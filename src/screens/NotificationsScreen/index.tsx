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
import { INotification, NotificationType } from "../../types";
import { useFriends } from "../../atoms/friends";
import { Color, FontFamily } from "../../constants";
import { isFriend } from "../../utils";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { NavProp, Routes } from "../../navigation/types";

const NotificationsScreen: FC = () => {
  const { user } = useAuth();
  const { friends } = useFriends();

  const isFocused = useIsFocused();

  const {
    friendRequests,
    invitations,
    setUnreadNotifications,
    setIncomingCall,
  } = useNotifications();

  const isEmpty = !friendRequests.length && !invitations.length;

  const { navigate } = useNavigation<NavProp["navigation"]>();

  useFocusEffect(
    useCallback(() => {
      if (!isEmpty) {
        setTimeout(async () => {
          const notifications = await db
            .collection("notifications")
            .where("receiverId", "==", user?.uid)
            .get();
          notifications.forEach(async (notification) => {
            await db
              .collection("notifications")
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
          .collection("notifications")
          .where("receiverId", "==", user?.uid)
          .get();
        notifications.forEach(async (notification) => {
          await db
            .collection("notifications")
            .doc(notification.id)
            .update({ viewed: true });
        });
        setUnreadNotifications(false);
      }, 2000);
    }
  }, [isFocused, friendRequests, invitations]);

  const acceptFriendRequest = async (senderId: string) => {
    await db
      .collection("users")
      .doc(user?.uid)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(senderId),
      });

    await db
      .collection("users")
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
              setIncomingCall(false);
              navigate(Routes.VideoChat, {
                mode: "join",
                friendId: item.senderId,
                roomId: item.roomId,
              });
            }}
            viewed={item.viewed}
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
