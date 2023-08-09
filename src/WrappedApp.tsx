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
import {} from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { FC, useEffect, useState } from "react";
import { RootNavigator } from "./navigation";
import { Color } from "./constants";
import { useAuth } from "./atoms/auth";
import firebase from "firebase/compat/app";
import * as deviceStorage from "./utils";
import { Collection, IUser } from "./types";
import { auth, db } from "./api/firebase";
import { navigationRef } from "./navigation/RootNavigation";
import { IncomingCall } from "./components";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import * as Font from "expo-font";
import { Image } from "expo-image";
import { Asset } from "expo-asset";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { DarkColors, LightColors } from "./constants/Color";
import { useSettings } from "./atoms/settings";

const WrappedApp: FC = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const { initializing, setUser, startup } = useAuth();
  const { theme, setTheme } = useSettings();

  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Caveat_400Regular,
  });

  const isLightTheme = theme === "light";

  const Theme = {
    ...(isLightTheme ? DefaultTheme : DarkTheme),
    colors: {
      ...(isLightTheme ? DefaultTheme.colors : DarkTheme.colors),
      ...(isLightTheme ? LightColors : DarkColors),
    },
  };

  const getInitialTheme = async () => {
    const theme = await deviceStorage.getTheme();
    if (!theme) {
      await deviceStorage.setTheme("dark");
      setTheme("dark");
    }
    switch (theme) {
      case "light":
        return setTheme("light");
      case "dark":
      default:
        return setTheme("dark");
    }
  };

  const onAuthStateChanged = async (user: firebase.User | null) => {
    if (user) {
      const doc = await db.collection(Collection.Users).doc(user.uid).get();
      if (doc.exists) {
        const userData = doc.data() as IUser;
        await deviceStorage.setUser(user.uid);
        setUser(userData);
      }
    }
  };

  // const cacheImages = (images: string[]) => {
  //   return images.map((image) => {
  //     if (typeof image === "string") {
  //       return Image.prefetch(image);
  //     } else {
  //       return Asset.fromModule(image).downloadAsync();
  //     }
  //   });
  // }

  const cacheFonts = (fonts: any[]) => {
    return fonts.map((font) => Font.loadAsync(font));
  };

  useEffect(() => {
    const loadResourcesAndDataAsync = async () => {
      try {
        SplashScreen.preventAutoHideAsync();

        await getInitialTheme();

        // const imageAssets = cacheImages([
        //   "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        //   require("./assets/images/circle.jpg"),
        // ]);

        const fontAssets = cacheFonts([FontAwesome.font, Feather.font]);

        await Promise.all([...fontAssets]); // spread image assets if needed
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };

    loadResourcesAndDataAsync();
  }, []);

  useEffect(() => {
    startup();
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded && !initializing && appIsReady) {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [fontsLoaded, initializing, appIsReady]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer ref={navigationRef} theme={Theme}>
        <RootNavigator />
        <IncomingCall />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default WrappedApp;
