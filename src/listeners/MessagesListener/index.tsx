import { FC, useEffect } from "react";
import { useAuth } from "../../atoms/auth";
import { db } from "../../api/firebase";
import { Collection, IUser } from "../../types";
import { useMessages } from "../../atoms/messages";
import { orderBy } from "lodash";

const MessagesListener: FC = () => {
  const { user } = useAuth();

  const { friendId, setMessages, setSelectedFriend } = useMessages();

  useEffect(() => {
    const fetchFriend = async () => {
      const friend = await db.collection(Collection.Users).doc(friendId).get();
      setSelectedFriend(friend.data() as IUser);
    };
    if (friendId) {
      fetchFriend();
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
        setMessages(orderBy(friendMessages, ["createdAt"], ["asc"]));
      });
    return () => unsubscribe();
  }, [user?.uid, friendId]);
  return null;
};

export default MessagesListener;
