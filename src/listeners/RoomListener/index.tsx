import { FC, useEffect } from "react";
import InCallManager from "react-native-incall-manager";
import { Collection, IRoom } from "../../types";
import { Routes } from "../../navigation/types";
import { db } from "../../api/firebase";
import { useRoom } from "../../atoms/room";
import { useSetRecoilState } from "recoil";
import { timerState } from "../../atoms/timer";
import { navigate } from "../../navigation/RootNavigation";
import { useAuth } from "../../atoms/auth";
import { deleteCall, deleteRoom } from "../../api/firestore";

const RoomListener: FC = () => {
  const { roomId, currentCall, setRoomId } = useRoom();

  const { user } = useAuth();

  const setTimer = useSetRecoilState(timerState);

  useEffect(() => {
    if (!roomId) {
      console.log("ROOMS: NOT LISTENING", user?.username);
      return;
    }

    console.log("ROOMS: LISTENING", user?.username);
    console.log(`${user?.username} ROOM ID:`, roomId);

    const unsubscribe = db
      .collection(Collection.Rooms)
      .doc(roomId)
      .onSnapshot(async (snapshot) => {
        const room = snapshot.data() as IRoom;
        if (room?.callAnswered) {
          setTimer((state) => ({
            ...state,
            isRunning: true,
          }));
          InCallManager.stopRingback();
        }
        if (room?.callEnded) {
          console.log("IN ROOM CALL ENDED", user?.username);
          setTimer((state) => ({
            ...state,
            minutes: 0,
            seconds: 0,
            isRunning: false,
          }));
          setRoomId("");
          InCallManager.stopRingback();
          await deleteCall(currentCall?.id);
          await deleteRoom(roomId);
          navigate(Routes.Home);
        }
      });
    return () => unsubscribe();
  }, [roomId]);

  return null;
};

export default RoomListener;
