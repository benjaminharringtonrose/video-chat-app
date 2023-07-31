import React, { FC, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  SectionListRenderItemInfo,
  SectionListData,
} from "react-native";
import LottieView from "lottie-react-native";

import styles from "./styles";
import { ItemSeparator, ListItem } from "../../components";
import { ListItemType } from "../../components/ListItem";
import { useFriends } from "../../atoms/friends";
import { IUser } from "../../types";
import { Color } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { NavProp, Routes } from "../../navigation/types";

const HomeScreen: FC = () => {
  const { friends, getFriends, loadingFriends } = useFriends();
  const { navigate } = useNavigation<NavProp>();

  useEffect(() => {
    getFriends();
  }, []);

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

  if (isEmpty) {
    return (
      <View style={[styles.noResultsContainer]}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <LottieView
            source={require("../../../assets/lottie/empty.json")}
            style={{
              alignSelf: "center",
              width: 150,
              height: 150,
            }}
            loop={false}
            autoPlay={true}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.noResultsTitle, { color: Color.text }]}>
            {"You don't have any friends yet"}
          </Text>
          <Text style={[styles.noResultsDescription, { color: Color.text }]}>
            {
              "Search for your friends or send them an invitation to download the app"
            }
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: Color.background }]}>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={{ paddingTop: 20 }}
        refreshing={loadingFriends}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default HomeScreen;
