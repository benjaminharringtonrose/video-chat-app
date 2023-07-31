import { FC, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/Ionicons";
import firebase from "firebase/compat/app";
import * as deviceStorage from "../utils";
import {
  LoginScreen,
  SignUpScreen,
  VideoChatScreen,
  AccountScreen,
  HomeScreen,
  SearchScreen,
  NotificationsScreen,
  FriendDetailScreen,
} from "../screens";
import { useAuth } from "../atoms/auth";
import { IUser } from "../types";
import { auth, db } from "../api/firebase";
import { Color, FontFamily } from "../constants";
import { AnyParams, Routes } from "./types";
import { TouchableOpacity } from "react-native-gesture-handler";

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: FC = () => (
  <HomeStack.Navigator
    screenOptions={({ navigation }) => ({
      headerShown: true,
      headerTitle: "Chait",
      headerTitleStyle: {
        color: Color.white,
        fontFamily: FontFamily.Header,
        fontSize: 36,
      },
      headerStyle: {
        backgroundColor: Color.background,
        shadowColor: "transparent",
      },
      headerLeft: () => {
        if (navigation.canGoBack()) {
          return (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name={"chevron-back"} size={30} color={Color.text} />
            </TouchableOpacity>
          );
        }
        return null;
      },
    })}
  >
    <HomeStack.Screen name={Routes.Home} component={HomeScreen} />
    <HomeStack.Screen
      name={Routes.FriendDetail}
      component={FriendDetailScreen}
    />
    <HomeStack.Screen name={Routes.VideoChat} component={VideoChatScreen} />
  </HomeStack.Navigator>
);

const Tab = createBottomTabNavigator();

const TabNavigator: FC = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: Color.primary,
      tabBarInactiveTintColor: Color.medDarkGrey,
      tabBarStyle: {
        backgroundColor: Color.background,
        borderTopWidth: 0,
      },
      headerTitleStyle: {
        color: Color.white,
        fontFamily: FontFamily.Header,
        fontSize: 36,
      },
      headerStyle: {
        backgroundColor: Color.background,
        shadowColor: "transparent",
      },
    }}
  >
    <Tab.Screen
      name={Routes.HomeStack}
      component={HomeStackNavigator}
      options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name={Routes.Search}
      component={SearchScreen}
      options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="ios-search" color={color} size={size} />
        ),
        headerTitle: "Chait",
      }}
    />
    <Tab.Screen
      name={Routes.Notifications}
      component={NotificationsScreen}
      options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="notifications" color={color} size={size} />
        ),
        headerTitle: "Chait",
      }}
    />
    <Tab.Screen
      name={Routes.Account}
      component={AccountScreen}
      options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
        ),
        headerTitle: "Chait",
      }}
    />
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

  console.log("initializing", initializing);

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
        <RootStack.Group
          screenOptions={({ navigation }) => ({
            headerTitle: "Chait",
            headerTitleStyle: {
              color: Color.white,
              fontFamily: FontFamily.Header,
              fontSize: 36,
            },
            headerStyle: {
              backgroundColor: Color.background,
              shadowColor: "transparent",
            },
          })}
        >
          <RootStack.Screen name={Routes.Login} component={LoginScreen} />
          <RootStack.Screen
            name={Routes.SignUp}
            component={SignUpScreen}
            options={({ navigation }) => ({
              headerLeft: () => {
                return (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name={"chevron-back"} size={30} color={Color.text} />
                  </TouchableOpacity>
                );
              },
            })}
          />
        </RootStack.Group>
      )}
    </RootStack.Navigator>
  );
};
