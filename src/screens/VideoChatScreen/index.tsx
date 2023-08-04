import React, { FC, useEffect } from "react";
import Icon from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import { RTCView } from "react-native-webrtc";
import { useWebRTC } from "../../hooks/useWebRTC";
import { Color } from "../../constants";
import { useRoute } from "@react-navigation/native";
import { NavProp } from "../../navigation/types";
import { db } from "../../api/firebase";
import { useAuth } from "../../atoms/auth";
import {
  CallMode,
  Collection,
  INotification,
  NotificationType,
} from "../../types";
import styles from "./styles";
import { useRoom } from "../../atoms/room";
import { Timer } from "../../components";
import { useTimer } from "../../atoms/timer";

const VideoChatScreen: FC = () => {
  const { width, height } = useWindowDimensions();
  const {
    localStream,
    remoteStream,
    startWebcam,
    createRoom,
    joinRoom,
    endStream,
  } = useWebRTC();

  const { params } = useRoute<NavProp["route"]>();
  const { user } = useAuth();
  const { setRoomId, setNotificationId, roomId, showRemoteStream } = useRoom();

  const { isRunning } = useTimer();

  const localWidth = width / 3;
  const localHeight = height / 3;

  const sendCallInvite = async (roomId?: string) => {
    if (!roomId) {
      return console.warn("No roomId");
    }
    const invitationDoc = db.collection(Collection.Notifications).doc();

    const notification: INotification = {
      id: invitationDoc.id,
      type: NotificationType.Invitation,
      senderUsername: user?.username,
      senderId: user?.uid,
      receiverId: params?.friendId,
      roomId,
      viewed: false,
      calling: true,
      callAnswered: false,
      callEnded: false,
    };

    try {
      await db
        .collection(Collection.Notifications)
        .doc(invitationDoc.id)
        .set(notification);
      setNotificationId(invitationDoc.id);
    } catch (e) {
      console.log("sendCallInvite Error:", e);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      await startWebcam();
      if (params?.mode === CallMode.Join) {
        try {
          await joinRoom(roomId);
        } catch (e) {
          console.log("bootstrap join Error:", e);
        }
      } else if (params?.mode === CallMode.Host) {
        try {
          const roomDoc = db.collection(Collection.Rooms).doc();
          setRoomId(roomDoc.id);
          await createRoom(roomDoc.id);
          await sendCallInvite(roomDoc.id);
          // setTimeout(async () => {
          //   const snapshot = await db
          //     .collection(Collection.Notifications)
          //     .doc(notificationId)
          //     .get();
          //   const callInvite = snapshot.data() as INotification;
          //   if (callInvite.callEnded && !callInvite.callAnswered) {
          //     console.log("oh crap");
          //     endStream({ roomId });
          //   }
          // }, 20000);
        } catch (e) {
          console.log("bootstrap host Error:", e);
        }
      }
    };
    bootstrap();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Color.background }}>
      {isRunning && (
        <Timer style={{ zIndex: 3, alignItems: "center", marginTop: 50 }} />
      )}
      {showRemoteStream && remoteStream && (
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
            onPress={() => endStream({ roomId })}
          >
            <Icon name={"call-end"} color={"white"} size={40} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VideoChatScreen;
