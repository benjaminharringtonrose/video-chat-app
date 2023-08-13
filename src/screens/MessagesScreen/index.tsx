import React, { FC } from "react";
import { FlatList, View } from "react-native";
import { Card } from "../../components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { CardType } from "../../types";
import styles from "./styles";

const threads = [
  {
    id: 0,
    username: "YipYip123",
    updatedAt: "09:34 PM",
    unreadCount: 2,
    avatar: "https://picsum.photos/id/239/200/300",
    lastMessage: "lopus lorum blah...",
  },
];

const MessagesScreen: FC = () => {
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={{ marginTop: top + 20 }}>
      <FlatList
        data={threads}
        renderItem={({ item }) => {
          return (
            <Card
              type={CardType.MessageThread}
              onPress={() => {}}
              username={item.username}
              avatar={item.avatar}
              lastMessage={item.lastMessage}
              unreadCount={item.unreadCount}
              updatedAt={item.updatedAt}
            />
          );
        }}
      />
    </View>
  );
};

export default MessagesScreen;
