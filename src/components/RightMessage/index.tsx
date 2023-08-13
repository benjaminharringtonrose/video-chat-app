import React, { FC } from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import { useTheme } from "@react-navigation/native";

interface IProps {
  date: string;
  message: string;
}

const RightMessage: FC<IProps> = ({ date, message }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <View style={styles.flex}>
        <View style={styles.topTextContainer}>
          <Text style={[styles.you, { color: colors.text }]}>{"You"}</Text>
          <Text style={[styles.date, { color: colors.text }]}>{date}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={[
              styles.messageText,
              { color: colors.text, backgroundColor: colors.primary },
            ]}
          >
            {message}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RightMessage;
