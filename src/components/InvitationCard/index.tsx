import React, { FC } from "react";
import Icon from "@expo/vector-icons/Ionicons";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import styles from "./styles";
import { Color } from "../../constants";
import Badge from "../Badge";
import Avatar from "../Avatar";

interface IProps {
  label?: string;
  username?: string;
  onPress: () => void;
  viewed: boolean;
  calling: boolean;
  callEnded: boolean;
  callAnswered: boolean;
}

const InvitationCard: FC<IProps> = ({
  label = "--",
  username = "--",
  onPress,
  viewed,
  calling,
  callEnded,
  callAnswered,
}) => {
  const getLabel = () => {
    if (callEnded && !callAnswered) {
      return `You missed a call from ${username}`;
    }
    return `Incoming call from ${username}`;
  };
  const disabled = callEnded && !callAnswered;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.root, !viewed && { backgroundColor: Color.card }]}
      disabled={disabled}
    >
      <Avatar source={{ uri: "https://picsum.photos/id/239/200/300" }} />
      <View style={styles.rowContainer}>
        <Text style={styles.label}>{getLabel()}</Text>
      </View>
      {calling && (
        <View style={{ top: 5 }}>
          <Badge />
        </View>
      )}
      {!disabled && (
        <Icon name={"chevron-forward"} size={20} color={Color.text} />
      )}
    </TouchableOpacity>
  );
};

export default InvitationCard;
