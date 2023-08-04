import { Sound } from "expo-av/build/Audio";
import { FC, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { useRoom } from "../../atoms/room";

const CallListener: FC = () => {
  const { incomingCall, outgoingCall } = useRoom();
  const incomingCallRef = useRef<Sound | null>(null);
  const outgoingCallRef = useRef<Sound | null>(null);

  const loadSounds = async () => {
    const { sound: incomingCall } = await Audio.Sound.createAsync(
      require("../../../assets/sounds/incoming-call.mp3")
    );
    const { sound: outgoingCall } = await Audio.Sound.createAsync(
      require("../../../assets/sounds/rotary-phone.mp3")
    );
    incomingCallRef.current = incomingCall;
    outgoingCallRef.current = outgoingCall;
  };

  const playIncomingCall = async () => {
    await incomingCallRef.current?.playAsync();
    await incomingCallRef.current?.setIsLoopingAsync(true);
  };

  const stopIncomingCall = async () => {
    await incomingCallRef.current?.setIsLoopingAsync(false);
    await incomingCallRef.current?.stopAsync();
  };

  const playOutgoingCall = async () => {
    await outgoingCallRef.current?.playAsync();
    await outgoingCallRef.current?.setIsLoopingAsync(true);
  };

  const stopOutgoingCall = async () => {
    await outgoingCallRef.current?.setIsLoopingAsync(false);
    await outgoingCallRef.current?.stopAsync();
  };

  useEffect(() => {
    loadSounds();
  }, []);

  useEffect(() => {
    if (incomingCall) {
      playIncomingCall();
    } else {
      stopIncomingCall();
    }
  }, [incomingCall]);

  useEffect(() => {
    if (outgoingCall) {
      playOutgoingCall();
    } else {
      stopOutgoingCall();
    }
  }, [outgoingCall]);

  return null;
};

export default CallListener;
