import React, { FC, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "./styles";
import SearchInput from "../../components/SeachInput";
import { db } from "../../api/firebase";
import { IUser, NotificationType } from "../../types";
import { useAuth } from "../../atoms/auth";
import { useRecoilValue } from "recoil";
import { notificationsState } from "../../atoms/notifications";
import { ListItem } from "../../components";
import firebase from "firebase/compat";
import { ListItemType } from "../../components/ListItem";

const SearchScreen: FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);

  const { user } = useAuth();
  const { friendRequests } = useRecoilValue(notificationsState);

  console.log(friendRequests);

  const onSearch = async () => {
    const users = await db.collection("users").get();
    if (users.docs) {
      const results: IUser[] = [];
      users.docs.forEach((doc) => {
        if (doc.exists) {
          const user = doc.data() as IUser;
          if (user.username?.includes(searchText)) {
            results.push(user);
          }
        }
      });

      setSearchResults(results);
    }
  };

  const sendFriendRequest = async (uid: string) => {
    await db.collection("notifications").add({
      senderId: user?.uid,
      recieverId: uid,
      type: NotificationType.FriendRequest,
    });
  };

  const acceptFriendRequest = async (senderId: string) => {
    db.collection("users")
      .doc(user?.uid)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(senderId),
      });
  };

  return (
    <View style={styles.root}>
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        onSearch={onSearch}
        style={{ marginTop: 10 }}
      />
      <ScrollView>
        <Text>{"Search Results"}</Text>
        {searchResults?.map((searchResult) => {
          return (
            <ListItem
              type={ListItemType.Results}
              key={searchResult.uid}
              label={searchResult.username ?? "--"}
              onPress={() => sendFriendRequest(searchResult.uid)}
            />
          );
        })}
        <Text>{"Friend Requests"}</Text>
        {friendRequests?.map((friendRequest) => {
          return (
            <ListItem
              type={ListItemType.User}
              key={friendRequest.senderId}
              label={"you have a friend request"}
              onPress={() => acceptFriendRequest(friendRequest.senderId)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;
