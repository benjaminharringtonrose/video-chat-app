import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { RecoilRoot } from "recoil";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import WrappedApp from "./src/WrappedApp";
import { LogBox, Platform } from "react-native";
import {
  CallListener,
  NotificationListener,
  UserListener,
} from "./src/listeners";
import RoomListener from "./src/listeners/RoomListener";
import { Host } from "react-native-portalize";

LogBox.ignoreLogs([
  "Error: No native splash screen",
  "No video stream",
  "Warning: Overriding previous",
]);

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

export default function App() {
  // const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef<Notifications.Subscription | null>(null);
  // const responseListener = useRef<Notifications.Subscription | null>(null);

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) =>
  //     setExpoPushToken(token)
  //   );

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(!!notification);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log(response);
  //     });

  //   return () => {
  //     notificationListener.current &&
  //       Notifications.removeNotificationSubscription(
  //         notificationListener.current
  //       );
  //     responseListener.current &&
  //       Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

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
        </RecoilRoot>
      </Host>
    </GestureHandlerRootView>
  );
}

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: "Here is the notification body",
//       data: { data: "goes here" },
//     },
//     trigger: { seconds: 2 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   return token;
// }
