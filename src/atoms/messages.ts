import { atom, useRecoilState } from "recoil";
import uuid from "react-native-uuid";
import { INotification, IUser } from "../types";
import { sendMessage } from "../api/firestore";

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

  const onSendMessage = async (
    user: IUser | null,
    friendId?: string,
    data?: any
  ) => {
    await sendMessage(user?.uid, friendId, {
      [uuid.v4() as string]: {
        sender: user?.uid,
        message: data?.message,
        createdAt: Date.now(),
        avatar: "https://picsum.photos/id/239/200/300",
        username: user?.username,
      },
    });
    await sendMessage(friendId, user?.uid, {
      [uuid.v4() as string]: {
        sender: user?.uid,
        message: data?.message,
        createdAt: Date.now(),
        avatar: "https://picsum.photos/id/239/200/300",
        username: user?.username,
      },
    });
  };

  return {
    selectedFriend: state.selectedFriend,
    messages: state.messages,
    friendId: state.friendId,
    setMessages,
    setFriendId,
    setSelectedFriend,
    onSendMessage,
  };
};
