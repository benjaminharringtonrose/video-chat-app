import { FC, useEffect, useState } from "react";
import {
  InteractionManager,
  Platform,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/Feather";
import { Color } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Routes } from "../../navigation/types";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styles from "./styles";
import { useNotifications } from "../../atoms/notifications";
import Badge from "../Badge";

const TabBar: FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const indicatorOffset = useSharedValue(0);

  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const { unreadNotifications } = useNotifications();

  const tabWidth = (width - 20) / state.routes.length;

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      indicatorOffset.value = state.index * tabWidth;
    });
  }, [state.index]);

  const tabIndicatorStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: withTiming(indicatorOffset.value) }],
    }),
    [state.index]
  );

  return (
    <View
      style={[
        styles.root,
        {
          marginBottom: Platform.select({
            ios: bottom,
            android: bottom + 10,
          }),
          backgroundColor: Color.card,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({
              name: route.name,
              params: route.params,
              merge: true,
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const getIcon = (routeName: Routes) => {
          const color = isFocused ? Color.primary : Color.grey;
          switch (routeName) {
            case Routes.HomeStack:
              return <Icon name={"home"} size={24} color={color} />;
            case Routes.SearchStack:
              return <Icon name={"user-plus"} size={24} color={color} />;
            case Routes.NotificationsStack:
              return (
                <View>
                  {unreadNotifications && (
                    <View style={{ position: "absolute", left: 20, bottom: 5 }}>
                      <Badge />
                    </View>
                  )}
                  <Icon name={"bell"} size={24} color={color} />
                </View>
              );
            case Routes.AccountStack:
              return <Icon name={"user"} size={24} color={color} />;
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center" }}
          >
            {getIcon(route.name as Routes)}
          </Pressable>
        );
      })}
      <Reanimated.View
        style={[
          styles.tabIndicator,
          { width: tabWidth, backgroundColor: Color.primary },
          tabIndicatorStyle,
        ]}
      />
    </View>
  );
};

export default TabBar;
