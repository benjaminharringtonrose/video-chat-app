import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { FC, useEffect } from "react";
import { RootNavigator } from "./navigation";
import { Color } from "./constants";
import { useAuth } from "./atoms/auth";
import firebase from "firebase/compat/app";
import * as deviceStorage from "./utils";
import { IUser } from "./types";
import { auth, db } from "./api/firebase";

const WrappedApp: FC = () => {
  const { initializing, setUser, getPersistedUser } = useAuth();

  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Caveat_400Regular,
  });

  const Theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Color.background,
    },
  };

  async function onAuthStateChanged(user: firebase.User | null) {
    if (user) {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists) {
        const userData = doc.data() as IUser;
        await deviceStorage.setUser(user.uid);
        setUser(userData);
      }
    }
  }

  useEffect(() => {
    getPersistedUser();
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded && !initializing) {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [fontsLoaded, initializing]);

  if (!fontsLoaded || initializing) {
    return null;
  }

  return (
    <NavigationContainer theme={Theme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default WrappedApp;
