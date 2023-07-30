import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./src/navigation";

import { RecoilRoot } from "recoil";

export default function App() {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </RecoilRoot>
  );
}
