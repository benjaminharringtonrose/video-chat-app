import React, { FC, useEffect } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { Portal } from "react-native-portalize";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import styles from "./styles";
import { useRoom } from "../../atoms/room";

const IncomingCall: FC = () => {
  const { incomingCall } = useRoom();

  const y = useSharedValue(-100);

  useEffect(() => {
    if (incomingCall) {
      y.value = 50;
    } else {
      y.value = -100;
    }
  }, [incomingCall]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(y.value),
      },
    ],
  }));

  const declineCall = () => {
    // decline the call
  };
  return (
    <Portal>
      <Reanimated.View style={animStyle}>
        <BlurView
          intensity={30}
          style={styles.blurView}
          blurReductionFactor={4}
        >
          <View style={styles.outerRow}>
            <View style={styles.leftContainer}>
              <Image
                style={styles.avatar}
                source={{ uri: "https://picsum.photos/id/239/200/300" }}
              />
              <Text style={styles.usernameText}>{"JohnDeere555"}</Text>
            </View>

            <TouchableOpacity
              style={styles.declineCallButton}
              onPress={declineCall}
            >
              <Icon name={"call-end"} color={"white"} size={40} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptCallButton}
              onPress={declineCall}
            >
              <Icon name={"call-end"} color={"white"} size={40} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Reanimated.View>
    </Portal>
  );
};

export default IncomingCall;
