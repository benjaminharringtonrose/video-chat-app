import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RecoilRoot } from "recoil";

import { RootNavigator } from "./src/navigation";
import { Listeners } from "./src/components";

export default function App() {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <Listeners />
    </RecoilRoot>
  );
}
