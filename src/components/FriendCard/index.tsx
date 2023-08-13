import Icon from "@expo/vector-icons/Ionicons";
import React, { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import Reanimated, { FadeIn, FadeOut } from "react-native-reanimated";
import Avatar from "../Avatar";
import { useTheme } from "@react-navigation/native";

interface IProps {
  label?: string;
  onPress: () => void;
  isOnline?: boolean;
}

const FriendCard: FC<IProps> = ({ label = "--", onPress, isOnline }) => {
  const { colors } = useTheme();

  return (
    <Reanimated.View entering={FadeIn} exiting={FadeOut}>
      <TouchableOpacity
        style={[styles.friends, { backgroundColor: colors.card }]}
        onPress={onPress}
      >
        <Avatar
          source={{ uri: "https://picsum.photos/id/239/200/300" }}
          isOnline={!!isOnline}
        />
        <View style={styles.spaceBetween}>
          <Text style={[styles.friendLabel, { color: colors.text }]}>
            {label}
          </Text>
          <Icon name={"chevron-forward"} size={20} color={colors.text} />
        </View>
      </TouchableOpacity>
    </Reanimated.View>
  );
};

export default FriendCard;
