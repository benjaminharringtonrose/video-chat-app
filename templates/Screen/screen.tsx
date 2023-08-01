import React, { FC } from "react";
import { View, Text } from "react-native";
import styles from "./styles";

const Screen: FC = () => {
  return (
    <View style={styles.root}>
      <Text>{"Screen"}</Text>
    </View>
  );
};

export default Screen;
