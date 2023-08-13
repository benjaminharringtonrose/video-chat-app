import { StatusBar } from "expo-status-bar";
import firebase from "firebase/compat/app";
import React from "react";
import { RecoilRoot } from "recoil";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import WrappedApp from "./src/WrappedApp";
import { LogBox } from "react-native";
import {
  CallListener,
  NotificationListener,
  OnlineStatusListener,
  UserListener,
} from "./src/listeners";
import RoomListener from "./src/listeners/RoomListener";
import { Host } from "react-native-portalize";

LogBox.ignoreLogs([
  "Error: No native splash screen",
  "No video stream",
  "Warning: Overriding previous",
]);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Host>
        <RecoilRoot>
          <StatusBar style={"light"} />
          <WrappedApp />
          <NotificationListener />
          <UserListener />
          <RoomListener />
          <CallListener />
          <OnlineStatusListener />
        </RecoilRoot>
      </Host>
    </GestureHandlerRootView>
  );
}
