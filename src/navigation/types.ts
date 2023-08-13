import { NativeStackScreenProps } from "@react-navigation/native-stack";

export enum Routes {
  Login = "Login",
  SignUp = "SignUp",
  Tabs = "Tabs",
  HomeStack = "HomeStack",
  SearchStack = "SearchStack",
  NotificationsStack = "NotificationsStack",
  AccountStack = "AccountStack",
  MessagesStack = "MessagesStack",
  Home = "Home",
  VideoChat = "VideoChat",
  Search = "Search",
  Account = "Account",
  Notifications = "Notifications",
  FriendDetail = "FriendDetail",
  Messages = "Messages",
  MessageThread = "MessageThread",
}

export type AnyParams = {
  [key: string]: any;
};

export type NavProp = NativeStackScreenProps<AnyParams>;
