import { FC, useEffect, useState } from "react";
import {
  InteractionManager,
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
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import styles from "./styles";
import { useNotifications } from "../../atoms/notifications";

const TabBar: FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const offset = useSharedValue(0);
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

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const pulse = useAnimatedStyle(() => {
    const opacity = interpolate(
      offset.value,
      [0, 1],
      [0.6, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity: opacity,
      transform: [{ scale: offset.value }],
    };
  });

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
          marginBottom: bottom,
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
              return <Icon name={"home"} size={30} color={color} />;
            case Routes.SearchStack:
              return <Icon name={"search"} size={30} color={color} />;
            case Routes.NotificationsStack:
              return (
                <View>
                  {unreadNotifications && (
                    <>
                      <Reanimated.View style={[styles.circle, pulse]} />
                      <View style={styles.innerCircle} />
                    </>
                  )}
                  <Icon name={"bell"} size={30} color={color} />
                </View>
              );
            case Routes.AccountStack:
              return <Icon name={"user"} size={30} color={color} />;
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
