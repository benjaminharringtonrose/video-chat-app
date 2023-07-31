import React, { FC, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  SectionListRenderItemInfo,
  SectionListData,
} from "react-native";
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

  const renderSectionFooter = () => {
    if (isEmpty) {
      return (
        <View
          style={[styles.noResultsContainer, { backgroundColor: Color.card }]}
        >
          <Text style={[styles.noResultsText, { color: Color.text }]}>
            {"No friends"}
          </Text>
        </View>
      );
    }
    return null;
  };

  const sections = [
    {
      title: "Friends",
      data: friends,
    },
  ];

  const isEmpty = !friends.length;

  return (
    <View style={[styles.root, { backgroundColor: Color.background }]}>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        renderSectionFooter={renderSectionFooter}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={{ paddingTop: 20 }}
        refreshing={loadingFriends}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default HomeScreen;
