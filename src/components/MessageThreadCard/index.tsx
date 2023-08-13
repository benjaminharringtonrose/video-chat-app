import React, { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import Avatar from "../Avatar";
import styles from "./styles";
import Badge from "../Badge";

interface IProps {
  avatar?: string;
  username?: string;
  lastMessage?: string;
  unreadCount?: number;
  updatedAt?: string;
}

const MessageThreadCard: FC<IProps> = ({
  avatar,
  username = "--",
  lastMessage,
  unreadCount,
  updatedAt,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={[styles.root, { backgroundColor: colors.card }]}>
      <Avatar source={{ uri: avatar }} />
      <View style={styles.leftTextContainer}>
        <Text style={[styles.username, { color: colors.text }]}>
          {username}
        </Text>
        <Text style={[styles.lastMessage, { color: colors.text }]}>
          {lastMessage}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.updatedAt, { color: colors.text }]}>
            {updatedAt}
          </Text>
          <Icon name={"chevron-forward"} size={20} color={colors.text} />
        </View>

        <Text style={[styles.unreadCount, { color: colors.text }]}>
          {unreadCount}
        </Text>
        {unreadCount && unreadCount > 0 && (
          <View style={styles.badgeContainer}>
            <Badge />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MessageThreadCard;
