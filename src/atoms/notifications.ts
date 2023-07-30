import { atom } from "recoil";
import { INotification } from "../types";

interface INotificationsState {
  friendRequests: INotification[];
}

export const notificationsState = atom<INotificationsState>({
  key: "notificationsState",
  default: {
    friendRequests: [],
  },
});
