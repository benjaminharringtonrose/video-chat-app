import React, { FC, useEffect } from "react";
import Icon from "@expo/vector-icons/MaterialIcons";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { RTCView } from "react-native-webrtc";
import { useWebRTC } from "../../hooks/useWebRTC";
import { Color } from "../../constants";
import { useRoute } from "@react-navigation/native";
import { NavProp, Routes } from "../../navigation/types";
import { db } from "../../api/firebase";
import { useAuth } from "../../atoms/auth";
import { INotification, NotificationType } from "../../types";
import styles from "./styles";

const VideoChatScreen: FC = () => {
  const { width, height } = useWindowDimensions();
  const {
    localStream,
    remoteStream,
    roomId,
    startWebcam,
    createRoom,
    joinRoom,
    setRoomId,
    endStream,
  } = useWebRTC();

  const { params } = useRoute<NavProp["route"]>();
  const { user } = useAuth();

  const localWidth = width / 3;
  const localHeight = height / 3;

  const sendInvitation = async (roomId?: string) => {
    if (!roomId) {
      return console.warn("No roomId");
    }
    const invitationDoc = db.collection("notifications").doc();

    const notification: INotification = {
      id: invitationDoc.id,
      type: NotificationType.Invitation,
      senderUsername: user?.username,
      senderId: user?.uid,
      receiverId: params?.friendId,
      roomId,
      viewed: false,
    };

    await db
      .collection("notifications")
      .doc(invitationDoc.id)
      .set(notification);
  };

  useEffect(() => {
    const init = async () => {
      await startWebcam();
      if (params?.mode === "join") {
        setRoomId(params?.roomId as string);
        await joinRoom(params?.roomId);
      } else if (params?.mode === "invite") {
        const roomId = await createRoom();
        await sendInvitation(roomId);
      }
    };
    init();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Color.background }}>
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={{
            position: "absolute",
            width,
            height: height + 30,
            zIndex: 0,
          }}
          objectFit={"cover"}
          mirror
          zOrder={0}
        />
      )}
      <View style={styles.overlayContainer}>
        {localStream && (
          <View style={[styles.localStreamContainer]}>
            <RTCView
              objectFit={"cover"}
              style={{
                width: localWidth,
                height: localHeight,
                borderRadius: 10,
              }}
              streamURL={localStream.toURL()}
              mirror
              zOrder={1}
            />
          </View>
        )}
        <View style={styles.endCallContainer}>
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={() => endStream(roomId)}
          >
            <Icon name={"call-end"} color={"white"} size={40} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VideoChatScreen;
