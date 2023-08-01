import React, { FC } from "react";
import Icon from "@expo/vector-icons/Ionicons";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import styles from "./styles";
import { Color } from "../../constants";

interface IProps {
  viewed: boolean;
  username?: string;
  label?: string;
  onPress: () => void;
}

const InvitationCard: FC<IProps> = ({
  viewed,
  username = "--",
  label = "--",
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.friendRequest, !viewed && { backgroundColor: Color.card }]}
    >
      <Image
        style={styles.avatar}
        source={{ uri: "https://picsum.photos/id/239/200/300" }}
      />
      <View style={styles.friendRequestInner}>
        <Text style={styles.friendRequestLabel}>
          <Text style={styles.friendRequestUsername}>{username}</Text>
          {` ${label}`}
        </Text>
      </View>
      <Icon name={"chevron-forward"} size={20} color={Color.text} />
    </TouchableOpacity>
  );
};

export default InvitationCard;
