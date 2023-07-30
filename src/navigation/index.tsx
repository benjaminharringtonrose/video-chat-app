import { FC, useEffect } from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import firebase from "firebase/compat/app";
import * as deviceStorage from "../utils";
import {
  LoginScreen,
  SignUpScreen,
  VideoChatScreen,
  AccountScreen,
  HomeScreen,
  SearchScreen,
} from "../screens";
import { useAuth } from "../atoms/auth";
import { IUser } from "../types";
import { auth, db } from "../api/firebase";

export enum Routes {
  Login = "Login",
  SignUp = "SignUp",
  Tabs = "Tabs",
  Home = "Home",
  VideoChat = "VideoChat",
  Search = "Search",
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
    <Tab.Screen name={Routes.Search} component={SearchScreen} />
    <Tab.Screen name={Routes.Account} component={AccountScreen} />
  </Tab.Navigator>
);

const RootStack = createNativeStackNavigator<AnyParams>();

export const RootNavigator: FC = () => {
  const { user, initializing, setUser, setInitializing, getPersistedUser } =
    useAuth();

  async function onAuthStateChanged(user: firebase.User | null) {
    if (user) {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists) {
        const userData = doc.data() as IUser;
        await deviceStorage.setUser(user.uid);
        setUser(userData);
      }
    }
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    getPersistedUser();
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

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
