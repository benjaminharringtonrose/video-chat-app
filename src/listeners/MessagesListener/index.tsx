import { FC, useEffect } from "react";
import { useAuth } from "../../atoms/auth";
import { db } from "../../api/firebase";
import { Collection, IMessage } from "../../types";
import { useSetRecoilState } from "recoil";
import { messagesState, useMessages } from "../../atoms/messages";
import { orderBy } from "lodash";

const MessagesListener: FC = () => {
  const { user } = useAuth();

  const { friendId, setMessages } = useMessages();

  useEffect(() => {
    if (friendId) {
    }
  }, [friendId]);

  useEffect(() => {
    if (!user?.uid || !friendId) return;
    const unsubscribe = db
      .collection(Collection.MessageThreads)
      .doc(user?.uid)
      .collection(Collection.Messages)
      .doc(friendId)
      .onSnapshot((snapshot) => {
        console.log("MESSAGES LISTENING");
        const friendMessages: any[] = [];
        const messages = snapshot.data() as any;
        for (const key in messages) {
          friendMessages.push(messages[key]);
        }
        setMessages(orderBy(friendMessages, ["createdAt"], ["desc"]));
      });
    return () => unsubscribe();
  }, [user?.uid, friendId]);
  return null;
};

export default MessagesListener;
