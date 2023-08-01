import React, { FC, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { RTCView } from "react-native-webrtc";
import { useWebRTC } from "../../hooks/useWebRTC";
import Button from "../../components/Button";
import { Color } from "../../constants";
import { useRoute } from "@react-navigation/native";
import { NavProp } from "../../navigation/types";
import { db } from "../../api/firebase";
import { useAuth } from "../../atoms/auth";
import { INotification, NotificationType } from "../../types";

const VideoChatScreen: FC = () => {
  const { width, height } = useWindowDimensions();
  const {
    localStream,
    remoteStream,
    startWebcam,
    createRoom,
    joinRoom,
    setRoomId,
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
        console.log("yip", params?.roomId);
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Color.background }}
      behavior="position"
    >
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={{
            position: "absolute",
            width,
            height,
            zIndex: 0,
          }}
          objectFit={"cover"}
          mirror
          zOrder={0}
        />
      )}

      {localStream && (
        <RTCView
          style={{
            width: localWidth,
            height: localHeight,
            position: "absolute",
            left: width - localWidth - 40,
            top: height - localHeight - 240,
            borderRadius: 10,
          }}
          streamURL={localStream.toURL()}
          objectFit={"cover"}
          mirror
          zOrder={1}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default VideoChatScreen;
