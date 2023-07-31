import React, { FC } from "react";
import { View } from "react-native";
import { useAuth } from "../../atoms/auth";
import styles from "./styles";
import { auth } from "../../api/firebase";
import * as deviceStorage from "../../utils";
import { Color } from "../../constants";
import { Button } from "../../components";

const AccountScreen: FC = () => {
  const { setUser } = useAuth();
  return (
    <View style={[styles.root, { backgroundColor: Color.background }]}>
      <Button
        label={"Sign Out"}
        onPress={() => {
          auth.signOut();
          deviceStorage.removeUser();
          setUser(null);
        }}
        backgroundColor={Color.primary}
        labelColor={Color.text}
      />
    </View>
  );
};

export default AccountScreen;
