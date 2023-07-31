import React, { FC, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  SectionListRenderItemInfo,
  SectionListData,
  StyleSheet,
} from "react-native";
import styles from "./styles";
import { ListItem } from "../../components";
import { ListItemType } from "../../components/ListItem";
import { useFriends } from "../../atoms/friends";
import { IUser } from "../../types";
import { Color, FontFamily } from "../../constants";

const HomeScreen: FC = () => {
  const { friends, getFriends, loadingFriends } = useFriends();

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
        onPress={() => {}}
      />
    );
  };

  const sections = [
    {
      title: "Friends",
      data: friends,
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: Color.background }]}>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
};

export default HomeScreen;
