import React, { FC, useEffect, useState } from "react";
import Icon from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import { RTCView } from "react-native-webrtc";
import LottieView from "lottie-react-native";
import { useRoute } from "@react-navigation/native";
import Reanimated, { FadeIn, FadeOut } from "react-native-reanimated";
import InCallManager from "react-native-incall-manager";
import { db } from "../../api/firebase";
import { useAuth } from "../../atoms/auth";
import { useRoom } from "../../atoms/room";
import { useTimer } from "../../atoms/timer";
import { useWebRTC } from "../../hooks/useWebRTC";
import { NavProp } from "../../navigation/types";
import { Timer } from "../../components";
import { CallMode, Collection, ICall } from "../../types";
import styles from "./styles";

const VideoChatScreen: FC = () => {
  const { width, height } = useWindowDimensions();
  const { params } = useRoute<NavProp["route"]>();
  const { user } = useAuth();
  const { setRoomId, roomId, showRemoteStream, setCurrentCall } = useRoom();
  const { isRunning } = useTimer();
  const {
    localStream,
    remoteStream,
    startWebcam,
    createRoom,
    joinRoom,
    endStream,
    webcamStarted,
  } = useWebRTC();

  const sendCallInvite = async (roomId?: string) => {
    if (!roomId) {
      return console.warn("No roomId");
    }
    const callDoc = db.collection(Collection.Calls).doc();
    const call: ICall = {
      id: callDoc.id,
      senderUsername: user?.username,
      senderId: user?.uid,
      receiverId: params?.friendId,
      roomId,
      createdAt: new Date().toISOString(),
    };
    setCurrentCall(call);
    await callDoc.set(call);
  };

  useEffect(() => {
    const bootstrap = async () => {
      InCallManager.start();
      InCallManager.setKeepScreenOn(true);
      InCallManager.setForceSpeakerphoneOn(true);
      await startWebcam();
      switch (params?.mode) {
        case CallMode.Join: {
          return await joinRoom(roomId);
        }
        case CallMode.Host: {
          const roomDoc = db.collection(Collection.Rooms).doc();
          setRoomId(roomDoc.id);
          await createRoom(roomDoc.id);
          return await sendCallInvite(roomDoc.id);
        }
      }
    };
    bootstrap();
    return () => {
      InCallManager.stop();
    };
  }, []);

  return (
    <View style={styles.root}>
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
