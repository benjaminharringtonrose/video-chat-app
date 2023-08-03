import { atom, useRecoilState } from "recoil";

interface IRoomState {
  roomId: string;
  notificationId: string;
}

export const roomState = atom<IRoomState>({
  key: "roomState",
  default: {
    roomId: "",
    notificationId: "",
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

  return {
    roomId: state.roomId,
    notificationId: state.notificationId,
    setRoomId,
    setNotificationId,
  };
};
