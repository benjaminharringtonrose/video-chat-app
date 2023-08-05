import { atom, useRecoilState } from "recoil";
import { ICall } from "../types";

interface IRoomState {
  roomId: string;
  callId: string;
  webcamStarted: boolean;
  incomingCall: boolean;
  outgoingCall: boolean;
  showRemoteStream: boolean;
  currentCall?: ICall;
}

export const roomState = atom<IRoomState>({
  key: "roomState",
  default: {
    roomId: "",
    callId: "",
    webcamStarted: false,
    incomingCall: false,
    outgoingCall: false,
    showRemoteStream: false,
    currentCall: undefined,
  },
});

export const useRoom = () => {
  const [state, setState] = useRecoilState(roomState);

  const setRoomId = (roomId: string) => {
    setState((state) => ({ ...state, roomId }));
  };

  const setCallId = (callId: string) => {
    setState((state) => ({ ...state, callId }));
  };

  const setWebcamStarted = (webcamStarted: boolean) => {
    setState((state) => ({ ...state, webcamStarted }));
  };

  const setIncomingCall = (incomingCall: boolean) => {
    setState((state) => ({ ...state, incomingCall }));
  };

  const setOutgoingCall = (outgoingCall: boolean) => {
    setState((state) => ({ ...state, outgoingCall }));
  };

  const setShowRemoteStream = (showRemoteStream: boolean) => {
    setState((state) => ({ ...state, showRemoteStream }));
  };

  const setCurrentCall = (currentCall?: ICall) => {
    setState((state) => ({ ...state, currentCall }));
  };

  return {
    roomId: state.roomId,
    callId: state.callId,
    webcamStarted: state.webcamStarted,
    incomingCall: state.incomingCall,
    outgoingCall: state.outgoingCall,
    showRemoteStream: state.showRemoteStream,
    currentCall: state.currentCall,
    setRoomId,
    setCallId,
    setWebcamStarted,
    setIncomingCall,
    setOutgoingCall,
    setShowRemoteStream,
    setCurrentCall,
  };
};
