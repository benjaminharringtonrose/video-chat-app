import React, { FC, useState } from "react";
import { View, Text, FlatList, LayoutAnimation } from "react-native";
import styles from "./styles";
import SearchInput from "../../components/SeachInput";
import { db } from "../../api/firebase";
import { IUser, NotificationType } from "../../types";
import { useAuth } from "../../atoms/auth";
import { ListItem } from "../../components";
import { ListItemType } from "../../components/ListItem";
import { Color } from "../../constants";

const SearchScreen: FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);

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
    await db.collection("notifications").add({
      senderId: user?.uid,
      senderUsername: user?.username,
      recieverId: uid,
      type: NotificationType.FriendRequest,
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: Color.background }]}>
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        onSearch={onSearch}
        placeholder={"Search for a friend's username"}
        style={styles.searchInput}
      />
      {!searchResults.length && (
        <View
          style={[styles.noResultsContainer, { backgroundColor: Color.card }]}
        >
          <Text style={[styles.noResultsText, { color: Color.text }]}>
            {"No search results"}
          </Text>
        </View>
      )}
      <FlatList
        data={searchResults}
        renderItem={({ item }) => {
          return (
            <ListItem
              type={ListItemType.Results}
              key={item.uid}
              label={item.username ?? "--"}
              onPress={() => sendFriendRequest(item.uid)}
            />
          );
        }}
      />
    </View>
  );
};

export default SearchScreen;
