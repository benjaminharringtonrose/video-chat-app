import React, { FC } from "react";
import {
  View,
  Text,
  SectionList,
  SectionListRenderItemInfo,
  SectionListData,
} from "react-native";
import styles from "./styles";
import { useRecoilValue } from "recoil";
import { notificationsState } from "../../atoms/notifications";
import { ListItem } from "../../components";
import { ListItemType } from "../../components/ListItem";
import firebase from "firebase/compat";
import { db } from "../../api/firebase";
import { useAuth } from "../../atoms/auth";
import { INotification, NotificationType } from "../../types";

const NotificationsScreen: FC = () => {
  const { friendRequests } = useRecoilValue(notificationsState);

  const { user } = useAuth();

  const acceptFriendRequest = async (senderId: string) => {
    db.collection("users")
      .doc(user?.uid)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(senderId),
      });
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<INotification>;
  }) => {
    if (section.data?.length) {
      return (
        <View>
          <Text style={{ paddingLeft: 10, fontWeight: "600" }}>
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

  return (
    <View style={styles.root}>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={(item) => item.senderId}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
};

export default NotificationsScreen;
