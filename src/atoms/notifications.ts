import { atom, useRecoilState } from "recoil";
import { INotification } from "../types";

interface INotificationsState {
  friendRequests: INotification[];
  unreadNotifications: boolean;
}

export const notificationsState = atom<INotificationsState>({
  key: "notificationsState",
  default: {
    friendRequests: [],
    unreadNotifications: false,
  },
});

export const useNotifications = () => {
  const [state, setState] = useRecoilState(notificationsState);

  const setUnreadNotifications = (value: boolean) => {
    setState((state) => ({ ...state, hasSeenNotifications: value }));
  };

  return {
    unreadNotifications: state.unreadNotifications,
    setUnreadNotifications,
  };
};
