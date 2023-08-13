import * as SplashScreen from "expo-splash-screen";
import * as Device from "expo-device";
import {
  useFonts,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import * as Notifications from "expo-notifications";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { FC, useEffect, useRef, useState } from "react";
import { RootNavigator } from "./navigation";
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
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { DarkColors, LightColors } from "./constants/Color";
import { useSettings } from "./atoms/settings";
import { Platform } from "react-native";
import { updateUser } from "./api/firestore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const WrappedApp: FC = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const [appIsReady, setAppIsReady] = useState(false);
  const { user, initializing, setUser, startup } = useAuth();
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

  const cacheFonts = (fonts: any[]) => {
    return fonts.map((font) => Font.loadAsync(font));
  };

  useEffect(() => {
    const loadResourcesAndDataAsync = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await getInitialTheme();
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

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(!!notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      subscriber();
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
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

async function sendCallPushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}
