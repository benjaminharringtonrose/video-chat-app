import React, { FC } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import Avatar from "../Avatar";
import styles from "./styles";

interface IProps {
  avatar: string;
  username: string;
  date: string;
  message: string;
}

const LeftMessage: FC<IProps> = ({ avatar, username, date, message }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <Avatar source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.flex}>
        <View style={styles.topTextContainer}>
          <Text style={[styles.date, { color: colors.text }]}>{date}</Text>
        </View>
        <View style={{ alignItems: "flex-start" }}>
          <Text
            style={[
              styles.messageText,
              { backgroundColor: colors.card, color: colors.text },
            ]}
          >
            {message}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LeftMessage;
