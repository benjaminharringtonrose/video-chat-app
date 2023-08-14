import React, { FC, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LeftMessage, MessageInput, RightMessage } from "../../components";
import { useMessages } from "../../atoms/messages";
import { useAuth } from "../../atoms/auth";

const MessageThreadScreen: FC = () => {
  const [message, setMessage] = useState("");
  const { top, bottom } = useSafeAreaInsets();

  const { user } = useAuth();
  const { messages, friendId, onSendMessage } = useMessages();

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
        onSubmit={async () => {
          await onSendMessage(user, friendId, {
            message,
          });
          setMessage("");
        }}
        style={{ marginBottom: bottom, marginHorizontal: 10 }}
      />
    </KeyboardAvoidingView>
  );
};

export default MessageThreadScreen;
