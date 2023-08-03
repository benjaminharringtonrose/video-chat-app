import React, { FC, useEffect } from "react";
import { View } from "react-native";
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

const Badge: FC = () => {
  const offset = useSharedValue(0);

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

  return (
    <View style={{ alignItems: "center" }}>
      <Reanimated.View style={[styles.circle, pulse]} />
      <View style={styles.innerCircle} />
    </View>
  );
};

export default Badge;
