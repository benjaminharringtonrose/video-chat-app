import React, { FC, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  SectionListRenderItemInfo,
  SectionListData,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

import styles from "./styles";
import { EmptyStateView, ItemSeparator, ListItem } from "../../components";
import { ListItemType } from "../../components/ListItem";
import { useFriends } from "../../atoms/friends";
import { IUser } from "../../types";
import { Color } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { NavProp, Routes } from "../../navigation/types";
import { useAuth } from "../../atoms/auth";

const HomeScreen: FC = () => {
  const { user } = useAuth();
  const { friends, getFriends, loadingFriends } = useFriends();
  const { navigate } = useNavigation<NavProp["navigation"]>();

  useEffect(() => {
    if (user?.friends) {
      getFriends(user?.friends);
    }
  }, [user?.friends]);

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<any>;
  }) => {
    return (
      <View style={{ backgroundColor: Color.background }}>
        <Text style={[styles.sectionHeaderText, { color: Color.text }]}>
          {section.title}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: SectionListRenderItemInfo<IUser>) => {
    return (
      <ListItem
        type={ListItemType.Friends}
        label={item.username ?? "--"}
        onPress={() =>
          navigate(Routes.FriendDetail, {
            friendId: item.uid,
          })
        }
        isOnline={item.isOnline}
      />
    );
  };

  const sections = [
    {
      title: "Friends",
      data: friends,
    },
  ];

  const isEmpty = !friends.length;

  if (loadingFriends || (user?.friends && !friends.length)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={Color.primary} />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <EmptyStateView
          title={"You don't have any friends yet"}
          description={
            "Search for your friends or send them an invitation to download the app"
          }
          lottie={require("../../../assets/lottie/empty.json")}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: Color.background }]}>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={{ paddingTop: 20 }}
        refreshing={loadingFriends}
        ItemSeparatorComponent={ItemSeparator}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
