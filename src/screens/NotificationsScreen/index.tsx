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
import { EmptyStateView, ItemSeparator, Card } from "../../components";
import firebase from "firebase/compat";
import { db } from "../../api/firebase";
import { useAuth } from "../../atoms/auth";
import {
  Collection,
  INotification,
  NotificationType,
  QueryKey,
  CardType,
} from "../../types";
import { useFriends } from "../../atoms/friends";
import { FontFamily } from "../../constants";
import { isFriend } from "../../utils";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { NavProp } from "../../navigation/types";

const NotificationsScreen: FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { friends } = useFriends();
  const isFocused = useIsFocused();

  const { friendRequests, invitations, setUnreadNotifications } =
    useNotifications();

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
        <View style={{ backgroundColor: colors.background }}>
          <Text
            style={{
              paddingLeft: 10,
              fontFamily: FontFamily.Light,
              color: colors.text,
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
          <Card
            type={CardType.FriendRequest}
            key={item.senderId}
            username={item.senderUsername}
            label={"wants to be your friend"}
            isFriend={isFriend(item?.senderId ?? "", friends)}
            onPress={() => acceptFriendRequest(item?.senderId ?? "")}
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

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id ?? index.toString()}
        contentContainerStyle={{ paddingTop: 20 }}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={() => {
          if (isEmpty) {
            return (
              <View style={{ flex: 1 }}>
                <EmptyStateView
                  title={"You dont have any notifications"}
                  description={
                    "This is where you'll see your friend requests, group invitations, etc"
                  }
                  lottie={require("../../../assets/lottie/no_notifications.json")}
                />
              </View>
            );
          }
          return null;
        }}
      />
    </View>
  );
};

export default NotificationsScreen;
