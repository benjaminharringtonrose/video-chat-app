import React, { FC, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import styles from "./styles";
import { Color, FontFamily } from "../../constants";
import { useFriends } from "../../atoms/friends";
import { useRoute, useNavigation, useTheme } from "@react-navigation/native";
import { NavProp, Routes } from "../../navigation/types";
import { CallMode, IUser } from "../../types";
import Icon from "@expo/vector-icons/Feather";
import { useRoom } from "../../atoms/room";
import { useMessages } from "../../atoms/messages";

const FriendDetailScreen: FC = () => {
  const [selectedFriend, setSelectedFriend] = useState<IUser>();

  const { colors } = useTheme();
  const { friends } = useFriends();
  const { setFriendId } = useMessages();
  const { params } = useRoute<NavProp["route"]>();
  const { navigate } = useNavigation<NavProp["navigation"]>();
  const { setCallMode } = useRoom();

  const friendId = params?.friendId;
  const friendUsername = params?.friendUsername;

  const isOnline = true;

  useEffect(() => {
    if (friendId) {
      friends.forEach((friend) => {
        if (friend.uid === friendId) {
          setSelectedFriend(friend);
        }
      });
    }
  }, [friendId]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          borderBottomStartRadius: 40,
          borderTopStartRadius: 40,
        }}
      >
        <View style={{ alignItems: "center", paddingTop: 20 }}>
          <Image
            style={styles.avatar}
            source={{ uri: "https://picsum.photos/id/239/200/300" }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 20,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontFamily: FontFamily.SemiBold,
                fontSize: 24,
                paddingRight: 10,
              }}
            >
              {selectedFriend?.username}
            </Text>
            {selectedFriend?.isOnline && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: Color.lightGreen,
                }}
              />
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setCallMode(CallMode.Host);
                navigate(Routes.VideoChat, {
                  friendId,
                });
              }}
              style={{
                backgroundColor: Color.primaryLight,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Icon name={"video"} size={30} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFriendId(friendId);
                navigate(Routes.MessageThread, {
                  friendUsername,
                });
              }}
              style={{
                backgroundColor: Color.primaryLight,
                padding: 10,
                borderRadius: 10,
                marginLeft: 10,
              }}
            >
              <Icon name={"mail"} size={30} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: colors.background }}></View>
    </View>
  );
};

export default FriendDetailScreen;
