import { atom, useRecoilState } from "recoil";
import { IInvitation, INotification } from "../types";

interface INotificationsState {
  friendRequests: INotification[];
  invitations: INotification[];
  unreadNotifications: boolean;
}

export const notificationsState = atom<INotificationsState>({
  key: "notificationsState",
  default: {
    friendRequests: [],
    invitations: [],
    unreadNotifications: false,
  },
});

export const useNotifications = () => {
  const [state, setState] = useRecoilState(notificationsState);

  const setUnreadNotifications = (value: boolean) => {
    setState((state) => ({ ...state, unreadNotifications: value }));
  };

  const setInvitations = (invitations: INotification[]) => {
    setState(() => ({ ...state, invitations }));
  };

  return {
    invitations: state.invitations,
    friendRequests: state.friendRequests,
    unreadNotifications: state.unreadNotifications,
    setInvitations,
    setUnreadNotifications,
  };
};
