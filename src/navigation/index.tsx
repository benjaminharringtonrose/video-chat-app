import { FC } from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { LoginScreen, SignUpScreen, VideoChatScreen } from "../screens";

export enum Routes {
  Login = "Login",
  SignUp = "SignUp",
  VideoChat = "VideoChat",
}

type AnyParams = {
  [key: string]: any;
};

export type NavProp = NativeStackNavigationProp<AnyParams, string>;

const RootStack = createNativeStackNavigator<AnyParams>();

export const RootNavigator: FC = () => {
  const isLoggedIn = false;
  return (
    <RootStack.Navigator>
      {isLoggedIn ? (
        <>
          <RootStack.Screen
            name={Routes.VideoChat}
            component={VideoChatScreen}
          />
        </>
      ) : (
        <>
          <RootStack.Screen
            name={Routes.Login}
            component={LoginScreen}
            options={{ title: "Chait App" }}
          />
          <RootStack.Screen
            name={Routes.SignUp}
            component={SignUpScreen}
            options={{ title: "Chait App", headerBackTitle: "Login" }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
};
