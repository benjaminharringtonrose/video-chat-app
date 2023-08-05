import React, { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Image, ImageSource, ImageStyle } from "expo-image";
import styles from "./styles";

interface IProps {
  source: string | number | ImageSource | ImageSource[] | string[] | null;
  isOnline?: boolean;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

const Avatar: FC<IProps> = ({ style, imageStyle, source, isOnline }) => {
  return (
    <View style={style}>
      <Image style={[styles.avatar, imageStyle]} source={source} />
      {isOnline && (
        <View style={[styles.onlineBubble, { backgroundColor: "green" }]} />
      )}
    </View>
  );
};

export default Avatar;
