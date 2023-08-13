import { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/Ionicons";
import {
  LoginScreen,
  SignUpScreen,
  VideoChatScreen,
  AccountScreen,
  HomeScreen,
  SearchScreen,
  NotificationsScreen,
  FriendDetailScreen,
  MessagesScreen,
} from "../screens";
import { useAuth } from "../atoms/auth";
import { FontFamily } from "../constants";
import { Routes } from "./types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TabBar } from "../components";
import { useTheme } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import MessageThreadScreen from "../screens/MessageThreadScreen";

const routesWithBackNav = new Set([Routes.FriendDetail, Routes.VideoChat]);

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: FC = () => {
  const { colors } = useTheme();
  return (
    <HomeStack.Navigator
      screenOptions={({ navigation, route }) => ({
        cardStyle: {
          backgroundColor: colors.background,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitle: "VideoChait",
        headerTitleStyle: {
          color: colors.text,
          fontFamily: FontFamily.Bold,
          fontSize: 28,
        },
        headerShadowVisible: false,
        headerLeft: () => {
          if (routesWithBackNav.has(route.name as Routes)) {
            return (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ zIndex: 999 }}
              >
                <Icon name={"chevron-back"} size={30} color={colors.text} />
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
        options={{ headerTitle: "" }}
      />
    </HomeStack.Navigator>
  );
};

const SearchStack = createNativeStackNavigator();

const SearchStackNavigator: FC = () => {
  const { colors } = useTheme();

  return (
    <SearchStack.Navigator
      screenOptions={() => ({
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontFamily: FontFamily.Bold,
          fontSize: 28,
        },
        headerShadowVisible: false,
        headerTitle: "Find Friends",
      })}
    >
      <SearchStack.Screen name={Routes.Search} component={SearchScreen} />
    </SearchStack.Navigator>
  );
};

const NotificationsStack = createNativeStackNavigator();

const NotificationsStackNavigator: FC = () => {
  const { colors } = useTheme();

  return (
    <NotificationsStack.Navigator
      screenOptions={() => ({
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontFamily: FontFamily.Bold,
          fontSize: 28,
        },
        headerShadowVisible: false,
      })}
    >
      <NotificationsStack.Screen
        name={Routes.Notifications}
        component={NotificationsScreen}
      />
    </NotificationsStack.Navigator>
  );
};

const AccountStack = createNativeStackNavigator();

const AccountStackNavigator: FC = () => {
  const { colors } = useTheme();

  return (
    <AccountStack.Navigator
      screenOptions={() => ({
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontFamily: FontFamily.Bold,
          fontSize: 28,
        },
        headerShadowVisible: false,
      })}
    >
      <AccountStack.Screen name={Routes.Account} component={AccountScreen} />
    </AccountStack.Navigator>
  );
};

const MessagesStack = createNativeStackNavigator();

const MessagesStackNavigator: FC = () => {
  const { colors } = useTheme();

  return (
    <MessagesStack.Navigator
      screenOptions={() => ({
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontFamily: FontFamily.Bold,
          fontSize: 28,
        },
        headerShadowVisible: false,
      })}
    >
      <MessagesStack.Screen name={Routes.Messages} component={MessagesScreen} />
      <MessagesStack.Screen
        name={Routes.MessageThread}
        component={MessageThreadScreen}
      />
    </MessagesStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const TabNavigator: FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontFamily: FontFamily.Bold,
          fontSize: 28,
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
        },
      }}
    >
      <Tab.Screen
        name={Routes.HomeStack}
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={Routes.MessagesStack}
        component={MessagesStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={Routes.SearchStack}
        component={SearchStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={Routes.NotificationsStack}
        component={NotificationsStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={Routes.AccountStack}
        component={AccountStackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator();

export const RootNavigator: FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      {user ? (
        <>
          <RootStack.Screen name={Routes.Tabs} component={TabNavigator} />
          <RootStack.Screen
            name={Routes.VideoChat}
            component={VideoChatScreen}
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              presentation: "fullScreenModal",
              animation: "slide_from_bottom",
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          />
          <RootStack.Screen
            name={Routes.MessageThread}
            component={MessageThreadScreen}
            options={({ route }) => ({
              headerShown: true,
              headerTransparent: true,
              // @ts-ignore
              headerTitle: route?.params?.friendUsername,
            })}
          />
        </>
      ) : (
        <RootStack.Group
          screenOptions={{
            headerTitle: "VideoChait",
            headerTitleStyle: {
              color: colors.text,
              fontFamily: FontFamily.Bold,
              fontSize: 28,
            },
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <RootStack.Screen name={Routes.Login} component={LoginScreen} />
          <RootStack.Screen
            name={Routes.SignUp}
            component={SignUpScreen}
            options={({ navigation }) => ({
              headerLeft: () => {
                return (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name={"chevron-back"} size={30} color={colors.text} />
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
