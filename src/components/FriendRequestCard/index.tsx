import React, { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import styles from "./styles";
import { Color } from "../../constants";
import Avatar from "../Avatar";

interface IProps {
  username?: string;
  label?: string;
  viewed: boolean;
  isFriend: boolean;
  onPress: () => void;
}

const FriendRequestCard: FC<IProps> = ({
  username = "--",
  label = "--",
  viewed,
  isFriend,
  onPress,
}) => {
  return (
    <View
      style={[styles.friendRequest, !viewed && { backgroundColor: Color.card }]}
    >
      <Avatar source={{ uri: "https://picsum.photos/id/239/200/300" }} />
      <View style={styles.friendRequestInner}>
        <Text style={styles.friendRequestLabel}>
          <Text style={styles.friendRequestUsername}>{username}</Text>
          {` ${label}`}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.searchResultButton,
          { backgroundColor: Color.primary },
          isFriend && {
            backgroundColor: Color.background,
            borderWidth: 1,
            borderColor: Color.primary,
          },
        ]}
        disabled={isFriend}
        onPress={() => {
          onPress();
        }}
      >
        <Text
          style={[
            styles.addButton,
            { color: Color.text },
            isFriend && { color: Color.primary },
          ]}
        >
          {isFriend ? "added" : "add"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FriendRequestCard;
