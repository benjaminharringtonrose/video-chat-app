import { FC, useEffect, useRef } from "react";
import { Collection, INotification, IRoom } from "../../types";
import { NavProp, Routes } from "../../navigation/types";
import { db } from "../../api/firebase";
import { useRoom } from "../../atoms/room";
import { useNavigation } from "@react-navigation/native";
import { Sound } from "expo-av/build/Audio";
import { Audio } from "expo-av";
import { useSetRecoilState } from "recoil";
import { timerState } from "../../atoms/timer";
import { navigate } from "../../navigation/RootNavigation";
import { useAuth } from "../../atoms/auth";

const RoomListener: FC = () => {
  const {
    roomId,
    notificationId,
    setOutgoingCall,
    setIncomingCall,
    setNotificationId,
    setRoomId,
  } = useRoom();

  const { user } = useAuth();

  const setTimer = useSetRecoilState(timerState);

  useEffect(() => {
    if (!roomId) {
      console.log("not listening to rooms");
      return;
    }
    console.log("listening to room");
    const unsubscribe = db
      .collection(Collection.Rooms)
      .doc(roomId)
      .onSnapshot(async (snapshot) => {
        const room = snapshot.data() as IRoom;
        if (room?.calling) {
          setOutgoingCall(true);
        }
        if (room?.callAnswered) {
          setTimer((state) => ({ ...state, isRunning: true }));
          setOutgoingCall(false);
          setIncomingCall(false);
        }
        if (room?.callEnded) {
          console.log("IN ROOM CALL ENDED", user?.username);
          setTimer((state) => ({
            ...state,
            minutes: 0,
            seconds: 0,
            isRunning: false,
          }));
          setOutgoingCall(false);
          setIncomingCall(false);
          setNotificationId("");
          setRoomId("");
          navigate(Routes.Home);
        }
      });
    return () => unsubscribe();
  }, [roomId]);

  return null;
};

export default RoomListener;
