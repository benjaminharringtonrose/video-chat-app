import { Sound } from "expo-av/build/Audio";
import { FC, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { useRoom } from "../../atoms/room";
import { useAuth } from "../../atoms/auth";
import { db } from "../../api/firebase";
import { Collection, ICall, QueryKey } from "../../types";
import { orderBy } from "lodash";

const CallListener: FC = () => {
  const { user } = useAuth();
  const {
    incomingCall,
    outgoingCall,
    currentCall,
    setIncomingCall,
    setOutgoingCall,
    setCurrentCall,
  } = useRoom();
  const incomingCallRef = useRef<Sound | null>(null);
  const outgoingCallRef = useRef<Sound | null>(null);

  // const loadSounds = async () => {
  //   const { sound: incomingCall } = await Audio.Sound.createAsync(
  //     require("../../../assets/sounds/incoming-call.mp3")
  //   );
  //   const { sound: outgoingCall } = await Audio.Sound.createAsync(
  //     require("../../../assets/sounds/outgoing-call-2.mp3")
  //   );
  //   incomingCallRef.current = incomingCall;
  //   outgoingCallRef.current = outgoingCall;
  // };

  // const playIncomingCall = async () => {
  //   await incomingCallRef.current?.playAsync();
  //   await incomingCallRef.current?.setIsLoopingAsync(true);
  // };

  // const stopIncomingCall = async () => {
  //   await incomingCallRef.current?.setIsLoopingAsync(false);
  //   await incomingCallRef.current?.stopAsync();
  // };

  // const playOutgoingCall = async () => {
  //   await outgoingCallRef.current?.playAsync();
  //   await outgoingCallRef.current?.setIsLoopingAsync(true);
  // };

  // const stopOutgoingCall = async () => {
  //   await outgoingCallRef.current?.setIsLoopingAsync(false);
  //   await outgoingCallRef.current?.stopAsync();
  // };

  // useEffect(() => {
  //   loadSounds();
  // }, []);

  // useEffect(() => {
  //   if (incomingCall) {
  //     playIncomingCall();
  //   } else {
  //     stopIncomingCall();
  //   }
  // }, [incomingCall]);

  // useEffect(() => {
  //   if (outgoingCall) {
  //     console.log("playing outgoing call", user?.username);
  //     playOutgoingCall();
  //   } else if (!currentCall) {
  //     console.log("stopping outgoing call", user?.username);
  //     stopOutgoingCall();
  //   } else {
  //     console.log("stopping outgoing call", user?.username);
  //     stopOutgoingCall();
  //   }
  // }, [outgoingCall, currentCall]);

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
          setIncomingCall(true);
          setCurrentCall(incomingCall);
        } else {
          console.log("NO INCOMING CALLS", user?.username);
          setIncomingCall(false);
          setCurrentCall(undefined);
          setOutgoingCall(false);
        }
      });
    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  return null;
};

export default CallListener;
