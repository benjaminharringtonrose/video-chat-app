import React, { FC } from "react";
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
import { notificationsState } from "../../atoms/notifications";
import { ItemSeparator, ListItem } from "../../components";
import { ListItemType } from "../../components/ListItem";
import firebase from "firebase/compat";
import { db } from "../../api/firebase";
import { useAuth } from "../../atoms/auth";
import { INotification, NotificationType } from "../../types";
import { useFriends } from "../../atoms/friends";
import { Color, FontFamily } from "../../constants";

const NotificationsScreen: FC = () => {
  const { friendRequests } = useRecoilValue(notificationsState);

  const { friends } = useFriends();

  const { user } = useAuth();

  const isFriend = (uid: string) => {
    let _isFriend = false;
    friends.forEach((friend) => {
      if (friend.uid === uid) {
        _isFriend = true;
      }
    });
    return _isFriend;
  };

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
          isFriend={isFriend(item.senderId)}
          onPress={() => acceptFriendRequest(item.senderId)}
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

  const isEmpty = !friendRequests.length;

  return (
    <View style={[styles.root, { backgroundColor: Color.background }]}>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        renderSectionFooter={() => {
          if (isEmpty) {
            return (
              <View
                style={[
                  styles.noResultsContainer,
                  { backgroundColor: Color.card },
                ]}
              >
                <LottieView
                  source={require("../../../assets/lottie/no_notifications.json")}
                  style={{
                    alignSelf: "center",
                    width: 100,
                    height: 100,
                  }}
                  loop={false}
                  autoPlay={true}
                />
                <Text style={[styles.noResultsText, { color: Color.text }]}>
                  {"No notifications"}
                </Text>
              </View>
            );
          }
          return null;
        }}
        keyExtractor={(item) => item.senderId}
        contentContainerStyle={{ paddingTop: 20 }}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default NotificationsScreen;
