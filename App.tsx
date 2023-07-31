import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { RecoilRoot } from "recoil";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Listeners } from "./src/components";
import WrappedApp from "./src/WrappedApp";

SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RecoilRoot>
        <StatusBar style={"light"} />
        <WrappedApp />
        <Listeners />
      </RecoilRoot>
    </GestureHandlerRootView>
  );
}
