import React, { FC } from "react";
import { View } from "react-native";
import { Button } from "react-native-benji";
import { authState, useAuth } from "../../atoms/auth";
import styles from "./styles";
import { auth } from "../../api/firebase";
import * as deviceStorage from "../../utils";
import { useRecoilState } from "recoil";

const AccountScreen: FC = () => {
  const [_, setState] = useRecoilState(authState);
  return (
    <View style={styles.root}>
      <Button
        label={"Sign Out"}
        onPress={() => {
          auth.signOut();
          deviceStorage.removeUser();
          setState((state) => ({ ...state, user: null }));
        }}
      />
    </View>
  );
};

export default AccountScreen;
