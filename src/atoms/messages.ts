import { atom, useRecoilState } from "recoil";
import { INotification, IUser } from "../types";

interface IMessagesState {
  messages: any;
  friendId: string;
  selectedFriend?: IUser;
}

export const messagesState = atom<IMessagesState>({
  key: "messagesState",
  default: {
    messages: undefined,
    friendId: "",
  },
});

export const useMessages = () => {
  const [state, setState] = useRecoilState(messagesState);

  const setMessages = (messages: any[]) => {
    setState((state) => ({ ...state, messages }));
  };

  const setFriendId = (friendId: string) => {
    setState((state) => ({ ...state, friendId }));
  };

  const setSelectedFriend = (selectedFriend: IUser) => {
    setState((state) => ({ ...state, selectedFriend }));
  };
  return {
    selectedFriend: state.selectedFriend,
    messages: state.messages,
    friendId: state.friendId,
    setMessages,
    setFriendId,
    setSelectedFriend,
  };
};
