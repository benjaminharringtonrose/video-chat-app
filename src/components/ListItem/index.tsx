import { FC, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Icon from "@expo/vector-icons/Ionicons";
import styles from "./styles";
import { Color, FontFamily } from "../../constants";
import { useFriends } from "../../atoms/friends";

export enum ListItemType {
  Results = "Results",
  Friends = "Friends",
  User = "User",
  FriendRequest = "FriendRequest",
}

interface IProps {
  type: ListItemType;
  username?: string;
  label: string;
  isFriend?: boolean;
  onPress: () => void;
}

const ListItem: FC<IProps> = ({ type, username, label, isFriend, onPress }) => {
  switch (type) {
    case ListItemType.Friends:
      return (
        <TouchableOpacity style={styles.friends} onPress={onPress}>
          <Image
            style={styles.avatar}
            source={{ uri: "https://picsum.photos/id/239/200/300" }}
          />
          <Text
            style={{
              paddingLeft: 10,
              color: Color.white,
              fontFamily: FontFamily.Bold,
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>
      );
    case ListItemType.Results:
      return (
        <View style={[styles.searchResults, { backgroundColor: Color.card }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={styles.avatar}
              source={{ uri: "https://picsum.photos/id/239/200/300" }}
            />
            <Text
              style={{
                paddingLeft: 10,
                color: Color.text,
                fontFamily: FontFamily.Bold,
              }}
            >
              {label}
            </Text>
          </View>

          <TouchableOpacity style={styles.searchResultButton} onPress={onPress}>
            <Icon name={"add"} color={Color.white} size={20} />
          </TouchableOpacity>
        </View>
      );
    case ListItemType.FriendRequest:
    default:
      return (
        <View style={[styles.friendRequest, { backgroundColor: Color.card }]}>
          <Image
            style={styles.avatar}
            source={{ uri: "https://picsum.photos/id/239/200/300" }}
          />
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text
              style={{
                flex: 1,
                paddingLeft: 10,
                fontFamily: FontFamily.Light,
                color: Color.text,
              }}
            >
              <Text style={{ fontFamily: FontFamily.Bold, color: Color.text }}>
                {username}
              </Text>
              {` ${label}`}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.searchResultButton,
              { backgroundColor: Color.primary },
              isFriend && {
                backgroundColor: Color.card,
                borderWidth: 1,
                borderColor: Color.primary,
              },
            ]}
            disabled={isFriend}
            onPress={() => {
              onPress();
            }}
          >
            <Text
              style={[
                styles.addButton,
                { color: Color.text },
                isFriend && { color: Color.primary },
              ]}
            >
              {isFriend ? "Added" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      );
  }
};

export default ListItem;
