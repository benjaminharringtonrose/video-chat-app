import React, { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import Avatar from "../Avatar";
import { useTheme } from "@react-navigation/native";

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
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.friendRequest,
        !viewed && { backgroundColor: colors.card },
      ]}
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
          { backgroundColor: colors.primary },
          isFriend && {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.primary,
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
            { color: colors.text },
            isFriend && { color: colors.primary },
          ]}
        >
          {isFriend ? "added" : "add"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FriendRequestCard;
