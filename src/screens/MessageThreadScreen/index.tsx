import React, { FC, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from "react-native";
import styles from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { MessageInput } from "../../components";
import { useMessages } from "../../atoms/messages";
import { db } from "../../api/firebase";
import { Collection } from "../../types";
import { useAuth } from "../../atoms/auth";
import uuid from "react-native-uuid";

const MessageThreadScreen: FC = () => {
  const [message, setMessage] = useState("");
  const { top, bottom } = useSafeAreaInsets();

  const { user } = useAuth();
  const { messages, friendId } = useMessages();

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
          },
        },
        { merge: true }
      );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, marginTop: top + 100 }}
    >
      <FlatList
        contentContainerStyle={{ flex: 1 }}
        data={messages ?? []}
        renderItem={({ item }) => {
          return null;
        }}
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
