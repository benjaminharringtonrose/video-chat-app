import React, { FC, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../atoms/auth";
import Icon from "@expo/vector-icons/Ionicons";

import { auth } from "../../api/firebase";
import * as deviceStorage from "../../utils";
import { FontFamily } from "../../constants";
import { Avatar, Button, SettingRow } from "../../components";
import styles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useSettings } from "../../atoms/settings";

const AccountScreen: FC = () => {
  const { colors, dark } = useTheme();
  const [pushEnabled, setPushEnabled] = useState(false);
  const { setTheme } = useSettings();

  const { setUser, user } = useAuth();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            {"General"}
          </Text>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              borderTopColor: colors.border,
            }}
          >
            <Avatar
              source={{ uri: "https://picsum.photos/id/239/200/300" }}
              imageStyle={[styles.avatarPlaceholder, { marginVertical: 20 }]}
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
            onPress={() => {}}
          />
          <SettingRow
            label={"Notifications"}
            textStyle={{ color: colors.text }}
            onPress={() => {}}
          />
          <SettingRow
            isEnabled={pushEnabled}
            label={"Push Notifications"}
            type={"switch"}
            onPress={() => setPushEnabled((prevState) => !prevState)}
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
          backgroundColor={colors.primary}
          labelColor={colors.white}
          style={{ marginBottom: 40, marginHorizontal: 10 }}
        />
      </ScrollView>
    </View>
  );
};

export default AccountScreen;
