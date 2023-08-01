import React, { FC, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import styles from "./styles";
import { Color } from "../../constants";

interface IProps {
  username?: string;
  onPress: () => void;
}

const SearchResultCard: FC<IProps> = ({ username = "--", onPress }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.root}>
      <Image
        style={styles.avatar}
        source={{ uri: "https://picsum.photos/id/239/200/300" }}
      />
      <View style={styles.searchResultInner}>
        <Text style={styles.searchResultLabel}>{username}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.searchResultButton,
          { backgroundColor: Color.primary },
          pressed && {
            backgroundColor: Color.background,
            borderWidth: 1,
            borderColor: Color.primary,
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
            { color: Color.text },
            pressed && { color: Color.primary },
          ]}
        >
          {pressed ? "added" : "add"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchResultCard;
