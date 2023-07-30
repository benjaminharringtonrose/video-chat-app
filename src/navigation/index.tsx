import { FC } from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  LoginScreen,
  SignUpScreen,
  VideoChatScreen,
  AccountScreen,
  HomeScreen,
} from "../screens";
import { useAuth } from "../atoms/auth";

export enum Routes {
  Login = "Login",
  SignUp = "SignUp",
  Tabs = "Tabs",
  Home = "Home",
  VideoChat = "VideoChat",
  Account = "Account",
}

type AnyParams = {
  [key: string]: any;
};

export type NavProp = NativeStackNavigationProp<AnyParams, string>;

const Tab = createBottomTabNavigator();

const TabNavigator: FC = () => (
  <Tab.Navigator>
    <Tab.Screen name={Routes.Home} component={HomeScreen} />
    <Tab.Screen name={Routes.VideoChat} component={VideoChatScreen} />
    <Tab.Screen name={Routes.Account} component={AccountScreen} />
  </Tab.Navigator>
);

const RootStack = createNativeStackNavigator<AnyParams>();

export const RootNavigator: FC = () => {
  const { user, initializing } = useAuth();

  if (initializing) return null;

  return (
    <RootStack.Navigator>
      {user ? (
        <>
          <RootStack.Screen
            name={Routes.Tabs}
            component={TabNavigator}
            options={{ headerShown: false }}
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
