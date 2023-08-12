import React, { FC, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../atoms/auth";
import Icon from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

import { auth } from "../../api/firebase";
import { useSettings } from "../../atoms/settings";
import * as deviceStorage from "../../utils";
import { FontFamily } from "../../constants";
import { Avatar, Button, SettingRow } from "../../components";
import styles from "./styles";

const AccountScreen: FC = () => {
  const [pushEnabled, setPushEnabled] = useState(false);

  const { colors, dark } = useTheme();
  const { setTheme } = useSettings();
  const { setUser, user } = useAuth();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {"General"}
          </Text>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.card,
              borderRadius: 10,
              paddingVertical: 20,
              paddingHorizontal: 10,
              marginBottom: 10,
            }}
          >
            <Avatar
              source={{ uri: "https://picsum.photos/id/239/200/300" }}
              imageStyle={[styles.avatarPlaceholder]}
            />
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: FontFamily.Medium,
                }}
              >
                {user?.username ?? "--"}
              </Text>
              <Text
                style={{
                  color: colors.grey,
                  fontFamily: FontFamily.Medium,
                }}
              >
                {user?.email ?? "--"}
              </Text>
            </View>
            <Icon name={"chevron-forward"} color={colors.text} size={20} />
          </TouchableOpacity>
          <SettingRow
            label={"Delete Account"}
            textStyle={{ color: colors.text }}
            style={{ marginBottom: 10 }}
            onPress={() => {}}
          />
          <SettingRow
            label={"Notifications"}
            textStyle={{ color: colors.text }}
            style={{ marginBottom: 10 }}
            onPress={() => {}}
          />
          <SettingRow
            isEnabled={pushEnabled}
            label={"Push Notifications"}
            type={"switch"}
            onPress={() => setPushEnabled((prevState) => !prevState)}
            style={{ marginBottom: 10 }}
          />
          <SettingRow
            isEnabled={dark}
            label={"Dark Mode"}
            style={{ marginBottom: 20 }}
            type={"switch"}
            onPress={async () => {
              if (dark) {
                setTheme("light");
                await deviceStorage.setTheme("light");
              } else {
                setTheme("dark");
                await deviceStorage.setTheme("dark");
              }
            }}
          />
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {"Support"}
          </Text>
          <SettingRow
            label={"Report an issue"}
            textStyle={{ color: colors.text }}
            style={{ marginBottom: 10 }}
            onPress={() => {}}
          />
          <SettingRow
            label={"FAQ"}
            textStyle={{ color: colors.text }}
            style={{ marginBottom: 20 }}
            onPress={() => {}}
          />
        </View>
        <Button
          label={"Sign Out"}
          onPress={() => {
            auth.signOut();
            deviceStorage.removeUser();
            setUser(null);
          }}
          backgroundColor={colors.card}
          labelColor={colors.white}
          style={{ marginHorizontal: 10 }}
        />
      </ScrollView>
    </View>
  );
};

export default AccountScreen;
