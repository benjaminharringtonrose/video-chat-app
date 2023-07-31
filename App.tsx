import {
  useFonts,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RecoilRoot } from "recoil";

import { RootNavigator } from "./src/navigation";
import { Listeners } from "./src/components";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Caveat_400Regular,
  });

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [fontsLoaded]);

  console.log(fontsLoaded);

  return (
    <RecoilRoot>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <Listeners />
    </RecoilRoot>
  );
}
