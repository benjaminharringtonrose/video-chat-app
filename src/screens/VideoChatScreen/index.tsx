import React, { FC, useEffect, useState } from "react";
import Icon from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import { RTCView } from "react-native-webrtc";
import LottieView from "lottie-react-native";
import { useRoute, useTheme } from "@react-navigation/native";
import Reanimated, { FadeIn, FadeOut } from "react-native-reanimated";
import InCallManager from "react-native-incall-manager";
import { db } from "../../api/firebase";
import { useRoom } from "../../atoms/room";
import { useTimer } from "../../atoms/timer";
import { useWebRTC } from "../../hooks/useWebRTC";
import { NavProp } from "../../navigation/types";
import { Timer } from "../../components";
import { CallMode, Collection } from "../../types";
import styles from "./styles";

const VideoChatScreen: FC = () => {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const { params } = useRoute<NavProp["route"]>();
  const { setRoomId, roomId, showRemoteStream, callMode } = useRoom();
  const { isRunning } = useTimer();
  const {
    localStream,
    remoteStream,
    startWebcam,
    createRoom,
    sendCallInvite,
    endStream,
    webcamStarted,
  } = useWebRTC();

  useEffect(() => {
    const bootstrap = async () => {
      InCallManager.start();
      InCallManager.setKeepScreenOn(true);
      InCallManager.setForceSpeakerphoneOn(true);
      await startWebcam();
      if (callMode === CallMode.Host) {
        const roomDoc = db.collection(Collection.Rooms).doc();
        setRoomId(roomDoc.id);
        await createRoom(roomDoc.id);
        await sendCallInvite(roomDoc.id, params?.friendId);
      }
    };
    bootstrap();
    return () => {
      InCallManager.stop();
    };
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {isRunning && <Timer style={styles.timer} />}
      <View style={styles.lottieContainer}>
        <LottieView
          source={require("../../../assets/lottie/calling2.json")}
          style={styles.lottie}
          loop={true}
          autoPlay={true}
        />
      </View>
      {showRemoteStream && remoteStream && (
        <Reanimated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.remoteStreamContainer}
        >
          <RTCView
            streamURL={remoteStream.toURL()}
            style={[styles.remoteStream, { width, height: height + 30 }]}
            objectFit={"cover"}
            mirror
            zOrder={0}
          />
        </Reanimated.View>
      )}
      <View style={styles.overlayContainer}>
        {webcamStarted && localStream && (
          <Reanimated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.localStreamContainer}
          >
            <RTCView
              objectFit={"cover"}
              style={{
                width: width / 3,
                height: height / 3,
                borderRadius: 10,
              }}
              streamURL={localStream.toURL()}
              mirror
              zOrder={1}
            />
          </Reanimated.View>
        )}
        <View style={styles.endCallContainer}>
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={() => {
              endStream({ roomId });
            }}
          >
            <Icon name={"call-end"} color={"white"} size={40} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VideoChatScreen;

function findDifference(str1: string, str2: string) {
  const words1 = str1?.split(/\s+/);
  const words2 = str2?.split(/\s+/);
  const uniqueWords2 = words2.filter((word) => !words1?.includes(word));
  const difference = uniqueWords2.join(" ");
  return difference;
}
