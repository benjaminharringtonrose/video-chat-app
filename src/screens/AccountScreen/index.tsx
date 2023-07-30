import React, { FC } from "react";
import { View, Text } from "react-native";
import styles from "./styles";

const AccountScreen: FC = () => {
  return (
    <View style={styles.root}>
      <Text>{"AccountScreen"}</Text>
    </View>
  );
};

export default AccountScreen;
