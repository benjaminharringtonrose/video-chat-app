import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum Routes {
  Login = "Login",
  SignUp = "SignUp",
  Tabs = "Tabs",
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
