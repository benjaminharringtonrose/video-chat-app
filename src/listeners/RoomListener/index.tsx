import { FC, useEffect } from "react";
import { Collection, IRoom } from "../../types";
import { Routes } from "../../navigation/types";
import { db } from "../../api/firebase";
import { useRoom } from "../../atoms/room";
import { useSetRecoilState } from "recoil";
import { timerState } from "../../atoms/timer";
import { navigate } from "../../navigation/RootNavigation";
import { useAuth } from "../../atoms/auth";

const RoomListener: FC = () => {
  const { roomId, currentCall, setOutgoingCall, setRoomId, setCurrentCall } =
    useRoom();

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
          setOutgoingCall(false);
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
          setRoomId("");
          await db.collection(Collection.Calls).doc(currentCall?.id).delete();
          navigate(Routes.Home);
        }
      });
    return () => unsubscribe();
  }, [roomId]);

  return null;
};

export default RoomListener;
