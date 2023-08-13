import { atom, useRecoilState } from "recoil";
import { INotification } from "../types";

interface IMessagesState {
  messages: any;
  friendId: string;
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
  return {
    messages: state.messages,
    friendId: state.friendId,
    setMessages,
    setFriendId,
  };
};
