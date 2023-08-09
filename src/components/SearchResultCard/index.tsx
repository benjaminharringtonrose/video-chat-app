import React, { FC, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import styles from "./styles";
import { useTheme } from "@react-navigation/native";

interface IProps {
  username?: string;
  onPress: () => void;
}

const SearchResultCard: FC<IProps> = ({ username = "--", onPress }) => {
  const { colors } = useTheme();
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.root}>
      <Image
        style={styles.avatar}
        source={{ uri: "https://picsum.photos/id/239/200/300" }}
      />
      <View style={styles.searchResultInner}>
        <Text style={[styles.searchResultLabel, { color: colors.text }]}>
          {username}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.searchResultButton,
          { backgroundColor: colors.primary },
          pressed && {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.primary,
          },
        ]}
        disabled={pressed}
        onPress={() => {
          onPress();
          setPressed(true);
        }}
      >
        <Text
          style={[
            styles.addButton,
            { color: colors.text },
            pressed && { color: colors.primary },
          ]}
        >
          {pressed ? "added" : "add"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchResultCard;
