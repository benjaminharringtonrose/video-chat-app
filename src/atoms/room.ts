import { atom, useRecoilState } from "recoil";

interface IRoomState {
  roomId: string;
  remoteCallEnded: boolean;
  notificationId: string;
}

export const roomState = atom<IRoomState>({
  key: "roomState",
  default: {
    roomId: "",
    remoteCallEnded: false,
    notificationId: "",
  },
});

export const useRoom = () => {
  const [state, setState] = useRecoilState(roomState);

  const setRoomId = (roomId: string) => {
    setState((state) => ({ ...state, roomId }));
  };

  const setRemoteCallEnded = (remoteCallEnded: boolean) => {
    setState((state) => ({ ...state, remoteCallEnded }));
  };

  const setNotificationId = (notificationId: string) => {
    setState((state) => ({ ...state, notificationId }));
  };

  return {
    roomId: state.roomId,
    remoteCallEnded: state.remoteCallEnded,
    notificationId: state.notificationId,
    setRoomId,
    setRemoteCallEnded,
    setNotificationId,
  };
};
