import React, { FC, useEffect } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import FeatherIcon from "@expo/vector-icons/Feather";
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
import { db } from "../../api/firebase";
import { CallMode, Collection } from "../../types";
import { navigate } from "../../navigation/RootNavigation";
import { Routes } from "../../navigation/types";
import Avatar from "../Avatar";
import { useTheme } from "@react-navigation/native";

const IncomingCall: FC = () => {
  const { colors } = useTheme();
  const {
    incomingCall,
    setIncomingCall,
    setCurrentCall,
    currentCall,
    setRoomId,
    setCallMode,
  } = useRoom();

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

  const declineCall = async () => {
    await db.collection(Collection.Rooms).doc(currentCall?.roomId).set({
      calling: false,
      callAnswered: false,
      callEnded: true,
    });
    await db.collection(Collection.Calls).doc(currentCall?.id).delete();
    setCurrentCall(undefined);
    setIncomingCall(false);
  };

  const acceptCall = () => {
    if (!currentCall) {
      return console.log("acceptCall Error: no currentCall");
    }
    setRoomId(currentCall?.roomId);
    setCallMode(CallMode.Join);
    navigate(Routes.VideoChat, {
      friendId: currentCall?.senderId,
    });
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
              <Avatar
                source={{ uri: "https://picsum.photos/id/239/200/300" }}
                imageStyle={{ width: 60, height: 60, borderRadius: 30 }}
              />
              <Text style={[styles.usernameText, { color: colors.text }]}>
                {currentCall?.senderUsername}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.declineCallButton}
              onPress={declineCall}
            >
              <Icon name={"call-end"} color={"white"} size={40} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptCallButton}
              onPress={acceptCall}
            >
              <Icon name={"videocam"} color={"white"} size={40} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Reanimated.View>
    </Portal>
  );
};

export default IncomingCall;
