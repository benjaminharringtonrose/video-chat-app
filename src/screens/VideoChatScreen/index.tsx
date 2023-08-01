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
import firebase from "firebase/compat";

const VideoChatScreen: FC = () => {
  const { width, height } = useWindowDimensions();
  const {
    roomId,
    localStream,
    remoteStream,
    webcamStarted,
    startWebcam,
    createRoom,
    joinRoom,
    setRoomId,
  } = useWebRTC();

  const { params } = useRoute<NavProp["route"]>();
  const { user } = useAuth();

  const friendId = params?.friendId;

  const localWidth = width / 3;
  const localHeight = height / 3;

  const sendInvitation = async () => {
    const invitationDoc = db.collection("invitations").doc();

    await db.collection("invitations").doc(invitationDoc.id).set({
      id: invitationDoc.id,
      senderId: user?.uid,
      receiverId: friendId,
    });

    await db
      .collection("users")
      .doc(friendId)
      .update({
        invitations: firebase.firestore.FieldValue.arrayUnion(roomId),
      });
  };

  useEffect(() => {
    const init = async () => {
      await startWebcam();
      await createRoom();
      await sendInvitation();
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
