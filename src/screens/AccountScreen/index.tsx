import React, { FC } from "react";
import { View } from "react-native";
import { Button } from "react-native-benji";
import { useAuth } from "../../atoms/auth";
import styles from "./styles";
import { auth } from "../../api/firebase";
import * as deviceStorage from "../../utils";

const AccountScreen: FC = () => {
  const { setUser } = useAuth();
  return (
    <View style={styles.root}>
      <Button
        label={"Sign Out"}
        onPress={() => {
          auth.signOut();
          deviceStorage.removeUser();
          setUser(null);
        }}
      />
    </View>
  );
};

export default AccountScreen;
