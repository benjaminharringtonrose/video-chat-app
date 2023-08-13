import InCallManager from "react-native-incall-manager";
import { FC, useEffect } from "react";
import { orderBy } from "lodash";
import { useSetRecoilState } from "recoil";
import { db } from "../../api/firebase";
import { roomState } from "../../atoms/room";
import { useAuth } from "../../atoms/auth";
import { Collection, ICall, QueryKey } from "../../types";

const CallListener: FC = () => {
  const setRoomState = useSetRecoilState(roomState);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = db
      .collection(Collection.Calls)
      .where(QueryKey.ReceiverId, "==", user?.uid)
      .onSnapshot((query) => {
        const calls: ICall[] = [];
        query.forEach((snapshot) => {
          calls.push(snapshot.data() as ICall);
        });
        const incomingCall = orderBy(calls, "createdAt", "desc")[0];
        console.log(incomingCall);
        if (incomingCall) {
          console.log("INCOMING CALL", user?.username);
          InCallManager.startRingtone("_BUNDLE_");
          setRoomState((state) => ({
            ...state,
            incomingCall: true,
            currentCall: incomingCall,
          }));
        } else {
          console.log("NO INCOMING CALLS", user?.username);
          InCallManager.stopRingtone();
          setRoomState((state) => ({
            ...state,
            incomingCall: false,
            currentCall: undefined,
          }));
        }
      });
    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  return null;
};

export default CallListener;
