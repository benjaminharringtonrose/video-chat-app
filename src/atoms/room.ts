import { atom, useRecoilState } from "recoil";
import { CallMode, ICall } from "../types";

interface IRoomState {
  roomId: string;
  callId: string;
  webcamStarted: boolean;
  incomingCall: boolean;
  showRemoteStream: boolean;
  currentCall?: ICall;
  callMode?: CallMode;
}

export const roomState = atom<IRoomState>({
  key: "roomState",
  default: {
    roomId: "",
    callId: "",
    webcamStarted: false,
    incomingCall: false,
    showRemoteStream: false,
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

  const setShowRemoteStream = (showRemoteStream: boolean) => {
    setState((state) => ({ ...state, showRemoteStream }));
  };

  const setCurrentCall = (currentCall?: ICall) => {
    setState((state) => ({ ...state, currentCall }));
  };

  const setCallMode = (callMode: CallMode) => {
    setState((state) => ({ ...state, callMode }));
  };

  return {
    roomId: state.roomId,
    callId: state.callId,
    webcamStarted: state.webcamStarted,
    incomingCall: state.incomingCall,
    showRemoteStream: state.showRemoteStream,
    currentCall: state.currentCall,
    callMode: state.callMode,
    setRoomId,
    setCallId,
    setWebcamStarted,
    setIncomingCall,
    setShowRemoteStream,
    setCurrentCall,
    setCallMode,
  };
};
