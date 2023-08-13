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

const firebaseConfig = {
  apiKey: "AIzaSyDSdAOb0LC-MTgR1Xy_H9RCQbiwNBnnjeU",
  authDomain: "video-chat-app-841bf.firebaseapp.com",
  projectId: "video-chat-app-841bf",
  storageBucket: "video-chat-app-841bf.appspot.com",
  messagingSenderId: "649604954515",
  appId: "1:649604954515:web:d3e4e652e9fde5f7089066",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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
