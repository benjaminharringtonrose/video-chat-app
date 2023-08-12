import React, { FC, useState } from "react";
import {
  View,
  FlatList,
  LayoutAnimation,
  ListRenderItemInfo,
} from "react-native";
import styles from "./styles";
import SearchInput from "../../components/SearchInput";
import { db } from "../../api/firebase";
import {
  Collection,
  INotification,
  IUser,
  NotificationType,
  CardType,
} from "../../types";
import { useAuth } from "../../atoms/auth";
import { EmptyStateView, ItemSeparator, Card } from "../../components";
import { isFriend } from "../../utils";
import { useFriends } from "../../atoms/friends";
import { useTheme } from "@react-navigation/native";

const SearchScreen: FC = () => {
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);

  const { friends } = useFriends();
  const { user } = useAuth();

  const onSearch = async () => {
    const users = await db.collection("users").get();
    if (users.docs) {
      const results: IUser[] = [];
      users.docs.forEach((doc) => {
        if (doc.exists) {
          const user = doc.data() as IUser;
          if (
            searchText &&
            user.username
              ?.toLocaleLowerCase()
              .includes(searchText.toLocaleLowerCase())
          ) {
            results.push(user);
          }
        }
      });
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSearchResults(results);
    }
  };

  const sendFriendRequest = async (uid: string) => {
    const notificationsDoc = db.collection(Collection.Notifications).doc();

    const notification: INotification = {
      id: notificationsDoc.id,
      senderId: user?.uid,
      senderUsername: user?.username,
      receiverId: uid,
      type: NotificationType.FriendRequest,
      viewed: false,
    };

    await notificationsDoc.set(notification);
  };

  const renderItem = ({ item }: ListRenderItemInfo<IUser>) => {
    return (
      <Card
        type={CardType.Results}
        key={item.uid}
        username={item.username ?? "--"}
        isFriend={isFriend(item.uid, friends)}
        onPress={() => sendFriendRequest(item.uid)}
      />
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        onSearch={onSearch}
        placeholder={"Search"}
        style={styles.searchInput}
      />
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.uid}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={() => {
          if (!searchResults.length) {
            return (
              <EmptyStateView
                title={"No search results"}
                description={
                  "Search for your friends by their username or invite them to the app"
                }
              />
            );
          }
          return null;
        }}
      />
    </View>
  );
};

export default SearchScreen;
