import { atom, useRecoilState } from "recoil";

interface IRoomState {
  roomId: string;
  notificationId: string;
  webcamStarted: boolean;
  incomingCall: boolean;
  outgoingCall: boolean;
}

export const roomState = atom<IRoomState>({
  key: "roomState",
  default: {
    roomId: "",
    notificationId: "",
    webcamStarted: false,
    incomingCall: false,
    outgoingCall: false,
  },
});

export const useRoom = () => {
  const [state, setState] = useRecoilState(roomState);

  const setRoomId = (roomId: string) => {
    setState((state) => ({ ...state, roomId }));
  };

  const setNotificationId = (notificationId: string) => {
    setState((state) => ({ ...state, notificationId }));
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

  return {
    roomId: state.roomId,
    notificationId: state.notificationId,
    webcamStarted: state.webcamStarted,
    incomingCall: state.incomingCall,
    outgoingCall: state.outgoingCall,
    setRoomId,
    setNotificationId,
    setWebcamStarted,
    setIncomingCall,
    setOutgoingCall,
  };
};
