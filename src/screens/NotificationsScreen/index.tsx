import React, { FC, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  SectionListRenderItemInfo,
  SectionListData,
} from "react-native";
import LottieView from "lottie-react-native";
import styles from "./styles";
import { useRecoilValue } from "recoil";
import {
  notificationsState,
  useNotifications,
} from "../../atoms/notifications";
import { EmptyStateView, ItemSeparator, ListItem } from "../../components";
import { ListItemType } from "../../components/ListItem";
import firebase from "firebase/compat";
import { db } from "../../api/firebase";
import { useAuth } from "../../atoms/auth";
import { INotification, IUser, NotificationType } from "../../types";
import { useFriends } from "../../atoms/friends";
import { Color, FontFamily } from "../../constants";
import { isFriend } from "../../utils";

const NotificationsScreen: FC = () => {
  const { friendRequests } = useRecoilValue(notificationsState);

  const { user } = useAuth();
  const { friends } = useFriends();

  const { setUnreadNotifications } = useNotifications();

  const isEmpty = !friendRequests.length;

  useEffect(() => {
    if (!isEmpty) {
      setTimeout(async () => {
        const notifications = await db
          .collection("notifications")
          .where("recieverId", "==", user?.uid)
          .get();
        notifications.forEach(async (notification) => {
          await db
            .collection("notifications")
            .doc(notification.id)
            .update({ viewed: true });
        });
        setUnreadNotifications(false);
      }, 5000);
    }
  }, [isEmpty]);

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
    if (item.type === NotificationType.FriendRequest) {
      return (
        <ListItem
          type={ListItemType.FriendRequest}
          key={item.senderId}
          username={item.senderUsername}
          label={"wants to be your friend"}
          isFriend={isFriend(item.senderId, friends)}
          onPress={() => acceptFriendRequest(item.senderId)}
          viewed={item.viewed}
        />
      );
    }
    return null;
  };

  const sections = [
    {
      title: "Friend Requests",
      data: friendRequests,
      type: NotificationType.FriendRequest,
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
        keyExtractor={(item) => item.senderId}
        contentContainerStyle={{ paddingTop: 20 }}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default NotificationsScreen;
