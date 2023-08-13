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
import { ItemSeparator, MessageInput } from "../../components";
import { useMessages } from "../../atoms/messages";
import { db } from "../../api/firebase";
import { Collection } from "../../types";
import { useAuth } from "../../atoms/auth";
import uuid from "react-native-uuid";

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
        contentContainerStyle={{ flex: 1, marginHorizontal: 10 }}
        data={messages ?? []}
        renderItem={({ item }) => {
          const isMyMessage = item.sender === user?.uid;
          return (
            <View
              style={{ alignItems: isMyMessage ? "flex-end" : "flex-start" }}
            >
              <Text
                style={{
                  color: colors.text,
                  backgroundColor: isMyMessage ? colors.primary : colors.card,
                  borderRadius: 10,
                  overflow: "hidden",
                  padding: 20,
                }}
              >
                {item.message}
              </Text>
            </View>
          );
        }}
        ItemSeparatorComponent={ItemSeparator}
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
