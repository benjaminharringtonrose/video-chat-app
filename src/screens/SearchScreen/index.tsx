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
} from "../../types";
import { useAuth } from "../../atoms/auth";
import { EmptyStateView, ItemSeparator, ListItem } from "../../components";
import { ListItemType } from "../../components/ListItem";
import { Color } from "../../constants";
import { isFriend } from "../../utils";
import { useFriends } from "../../atoms/friends";

const SearchScreen: FC = () => {
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
          if (searchText && user.username?.includes(searchText)) {
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
      <ListItem
        type={ListItemType.Results}
        key={item.uid}
        username={item.username ?? "--"}
        isFriend={isFriend(item.uid, friends)}
        onPress={() => sendFriendRequest(item.uid)}
      />
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: Color.background }]}>
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        onSearch={onSearch}
        placeholder={"Search"}
        style={styles.searchInput}
      />
      {!searchResults.length && <EmptyStateView title={"No search results"} />}
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.uid}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default SearchScreen;
