import React, { FC, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Text,
  View,
} from "react-native";
import styles from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import {
  Avatar,
  ItemSeparator,
  LeftMessage,
  MessageInput,
  RightMessage,
} from "../../components";
import { useMessages } from "../../atoms/messages";
import { db } from "../../api/firebase";
import { Collection } from "../../types";
import { useAuth } from "../../atoms/auth";
import uuid from "react-native-uuid";
import { FontFamily } from "../../constants";

const MessageThreadScreen: FC = () => {
  const { colors } = useTheme();
  const [message, setMessage] = useState("");
  const { top, bottom } = useSafeAreaInsets();

  const { user } = useAuth();
  const { messages, friendId } = useMessages();

  console.log(messages);

  const onSendMessage = async () => {
    await db
      .collection(Collection.MessageThreads)
      .doc(user?.uid)
      .collection(Collection.Messages)
      .doc(friendId)
      .set(
        {
          [uuid.v4() as string]: {
            sender: user?.uid,
            message,
            createdAt: Date.now(),
            avatar: "https://picsum.photos/id/239/200/300",
            username: user?.username,
          },
        },
        { merge: true }
      );
    await db
      .collection(Collection.MessageThreads)
      .doc(friendId)
      .collection(Collection.Messages)
      .doc(user?.uid)
      .set(
        {
          [uuid.v4() as string]: {
            sender: user?.uid,
            message,
            createdAt: Date.now(),
            avatar: "https://picsum.photos/id/239/200/300",
            username: user?.username,
          },
        },
        { merge: true }
      );
    setMessage("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, marginTop: top + 50 }}
    >
      <FlatList
        contentContainerStyle={{ flex: 1, marginHorizontal: 10 }}
        data={messages ?? []}
        renderItem={({ item }) => {
          const isMyMessage = item.sender === user?.uid;
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }).format(item.createdAt);

          if (isMyMessage) {
            return <RightMessage date={formattedDate} message={item.message} />;
          }
          return (
            <LeftMessage
              avatar={item.avatar}
              username={item.username}
              date={formattedDate}
              message={item.message}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />
      <MessageInput
        value={message}
        onChangeText={setMessage}
        onSubmit={onSendMessage}
        style={{ marginBottom: bottom, marginHorizontal: 10 }}
      />
    </KeyboardAvoidingView>
  );
};

export default MessageThreadScreen;
