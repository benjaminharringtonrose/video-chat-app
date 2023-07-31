import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

export enum Routes {
  Login = "Login",
  SignUp = "SignUp",
  Tabs = "Tabs",
  HomeStack = "HomeStack",
  SearchStack = "SearchStack",
  NotificationsStack = "NotificationsStack",
  AccountStack = "AccountStack",
  Home = "Home",
  VideoChat = "VideoChat",
  Search = "Search",
  Account = "Account",
  Notifications = "Notifications",
  FriendDetail = "FriendDetail",
}

export type AnyParams = {
  [key: string]: any;
};

export type NavProp = NativeStackNavigationProp<AnyParams, string>;

export type NavRouteProp = RouteProp<any, any>;
