import { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Icon from "@expo/vector-icons/Ionicons";
import styles from "./styles";
import { Color } from "../../constants";

export enum ListItemType {
  Results = "Results",
  Friends = "Firends",
  User = "User",
}

interface IProps {
  type: ListItemType;
  label: string;
  onPress: () => void;
}

const ListItem: FC<IProps> = ({ type, label, onPress }) => {
  switch (type) {
    case ListItemType.Friends:
      return (
        <TouchableOpacity style={styles.friends} onPress={onPress}>
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
            source={{ uri: "https://picsum.photos/id/239/200/300" }}
          />
          <Text style={{ paddingLeft: 10 }}>{label}</Text>
        </TouchableOpacity>
      );
    case ListItemType.Results:
      return (
        <View style={styles.searchResults}>
          <Text>{label}</Text>
          <TouchableOpacity style={styles.searchResultButton} onPress={onPress}>
            <Icon name={"add"} color={Color.white} size={20} />
          </TouchableOpacity>
        </View>
      );
    case ListItemType.User:
    default:
      return (
        <View style={styles.searchResults}>
          <Text>{label}</Text>
          <TouchableOpacity style={styles.searchResultButton} onPress={onPress}>
            <Icon name={"add"} color={Color.white} size={20} />
          </TouchableOpacity>
        </View>
      );
  }
};

export default ListItem;
