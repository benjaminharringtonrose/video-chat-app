import { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Icon from "@expo/vector-icons/Ionicons";
import styles from "./styles";
import { Color, FontFamily } from "../../constants";

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
          <View style={styles.spaceBetween}>
            <Text style={styles.friendLabel}>{label}</Text>
            <Icon name={"chevron-forward"} size={20} color={Color.text} />
          </View>
        </TouchableOpacity>
      );
    case ListItemType.Results:
      return (
        <View style={[styles.searchResult, { backgroundColor: Color.card }]}>
          <View style={styles.searchResultInner}>
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
        <View style={[styles.friendRequest]}>
          <Image
            style={styles.avatar}
            source={{ uri: "https://picsum.photos/id/239/200/300" }}
          />
          <View style={styles.friendRequestInner}>
            <Text style={styles.friendRequestLabel}>
              <Text style={styles.friendRequestUsername}>{username}</Text>
              {` ${label}`}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.searchResultButton,
              { backgroundColor: Color.primary },
              isFriend && {
                backgroundColor: Color.background,
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
