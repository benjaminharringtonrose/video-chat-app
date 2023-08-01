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
} from "../screens";
import { useAuth } from "../atoms/auth";
import { Color, FontFamily } from "../constants";
import { AnyParams, Routes } from "./types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TabBar } from "../components";

const routesWithBackNav = new Set([Routes.FriendDetail, Routes.VideoChat]);

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: FC = () => (
  <HomeStack.Navigator
    screenOptions={({ navigation, route }) => ({
      headerShown: true,
      headerStyle: { backgroundColor: Color.background },
      headerTitle: "Chait",
      headerTitleStyle: {
        color: Color.text,
        fontFamily: FontFamily.Bold,
        fontSize: 36,
      },
      headerShadowVisible: false,
      headerLeft: () => {
        if (routesWithBackNav.has(route.name as Routes)) {
          return (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ zIndex: 999 }}
            >
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
      options={{ headerTitle: "" }}
    />
    <HomeStack.Screen
      name={Routes.VideoChat}
      component={VideoChatScreen}
      options={{ headerTitle: "" }}
    />
  </HomeStack.Navigator>
);

const SearchStack = createNativeStackNavigator();

const SearchStackNavigator: FC = () => (
  <SearchStack.Navigator
    screenOptions={() => ({
      headerStyle: {
        backgroundColor: Color.background,
      },
      headerTitleStyle: {
        color: Color.white,
        fontFamily: FontFamily.Bold,
        fontSize: 36,
      },
      headerShadowVisible: false,
    })}
  >
    <SearchStack.Screen name={Routes.Search} component={SearchScreen} />
  </SearchStack.Navigator>
);

const NotificationsStack = createNativeStackNavigator();

const NotificationsStackNavigator: FC = () => (
  <NotificationsStack.Navigator
    screenOptions={() => ({
      headerStyle: {
        backgroundColor: Color.background,
      },
      headerTitleStyle: {
        color: Color.white,
        fontFamily: FontFamily.Bold,
        fontSize: 36,
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

const AccountStack = createNativeStackNavigator();

const AccountStackNavigator: FC = () => (
  <AccountStack.Navigator
    screenOptions={() => ({
      headerStyle: {
        backgroundColor: Color.background,
      },
      headerTitleStyle: {
        color: Color.white,
        fontFamily: FontFamily.Bold,
        fontSize: 36,
      },
      headerShadowVisible: false,
    })}
  >
    <AccountStack.Screen name={Routes.Account} component={AccountScreen} />
  </AccountStack.Navigator>
);

const Tab = createBottomTabNavigator();

const TabNavigator: FC = () => (
  <Tab.Navigator
    tabBar={(props) => <TabBar {...props} />}
    screenOptions={{
      headerStyle: {
        backgroundColor: Color.background,
      },
      headerTitleStyle: {
        color: Color.white,
        fontFamily: FontFamily.Bold,
        fontSize: 36,
      },
    }}
  >
    <Tab.Screen
      name={Routes.HomeStack}
      component={HomeStackNavigator}
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

const RootStack = createNativeStackNavigator<AnyParams>();

export const RootNavigator: FC = () => {
  const { user } = useAuth();
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <RootStack.Screen name={Routes.Tabs} component={TabNavigator} />
        </>
      ) : (
        <RootStack.Group
          screenOptions={{
            headerTitle: "Chait",
            headerTitleStyle: {
              color: Color.white,
              fontFamily: FontFamily.Bold,
              fontSize: 36,
            },
            headerStyle: {
              backgroundColor: Color.background,
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
