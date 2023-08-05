import Icon from "@expo/vector-icons/Ionicons";
import React, { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import styles from "./styles";
import { Color } from "../../constants";
import Reanimated, { FadeIn, FadeOut } from "react-native-reanimated";

interface IProps {
  label?: string;
  onPress: () => void;
}

const FriendCard: FC<IProps> = ({ label = "--", onPress }) => {
  return (
    <Reanimated.View entering={FadeIn} exiting={FadeOut}>
      <TouchableOpacity style={styles.friends} onPress={onPress}>
        <Image
          style={styles.avatar}
          source={{ uri: "https://picsum.photos/id/239/200/300" }}
        />
        <View style={styles.spaceBetween}>
          <Text style={styles.friendLabel}>{label}</Text>
          <Icon name={"chevron-forward"} size={20} color={Color.text} />
        </View>
      </TouchableOpacity>
    </Reanimated.View>
  );
};

export default FriendCard;
