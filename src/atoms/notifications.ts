import { atom, useRecoilState } from "recoil";
import { IInvitation, INotification } from "../types";

interface INotificationsState {
  friendRequests: INotification[];
  invitations: INotification[];
  unreadNotifications: boolean;
  incomingCall: boolean;
}

export const notificationsState = atom<INotificationsState>({
  key: "notificationsState",
  default: {
    friendRequests: [],
    invitations: [],
    unreadNotifications: false,
    incomingCall: false,
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

  const setIncomingCall = (incomingCall: boolean) => {
    setState(() => ({ ...state, incomingCall }));
  };

  return {
    invitations: state.invitations,
    friendRequests: state.friendRequests,
    unreadNotifications: state.unreadNotifications,
    incomingCall: state.incomingCall,
    setInvitations,
    setUnreadNotifications,
    setIncomingCall,
  };
};
