import React, { FC, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useAuth } from "../../atoms/auth";
import Icon from "@expo/vector-icons/Ionicons";

import { auth } from "../../api/firebase";
import * as deviceStorage from "../../utils";
import { Color, FontFamily } from "../../constants";
import { Avatar, Button, SettingRow } from "../../components";
import styles from "./styles";

const AccountScreen: FC = () => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const { setUser, user } = useAuth();

  return (
    <View style={[styles.root, { backgroundColor: Color.background }]}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={styles.sectionText}>{"General"}</Text>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              marginBottom: 10,
            }}
          >
            <Avatar
              source={{ uri: "https://picsum.photos/id/239/200/300" }}
              imageStyle={styles.avatarPlaceholder}
            />
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  color: Color.text,
                  fontFamily: FontFamily.Medium,
                }}
              >
                {user?.username ?? "--"}
              </Text>
              <Text
                style={{
                  color: Color.grey,
                  fontFamily: FontFamily.Medium,
                }}
              >
                {user?.email ?? "--"}
              </Text>
            </View>
            <Icon name={"chevron-forward"} color={Color.grey} size={30} />
          </TouchableOpacity>
          <SettingRow
            label={"Delete Account"}
            style={{ marginBottom: 20 }}
            textStyle={{ color: Color.white }}
            onPress={() => {}}
          />
          <SettingRow
            label={"Notifications"}
            style={{ marginBottom: 20 }}
            textStyle={{ color: Color.white }}
            onPress={() => {}}
          />
          <SettingRow
            isEnabled={pushEnabled}
            label={"Push Notifications"}
            style={{ marginBottom: 20 }}
            type={"switch"}
            onPress={() => setPushEnabled((prevState) => !prevState)}
          />
          <SettingRow
            isEnabled={darkModeEnabled}
            label={"Dark Mode"}
            style={{ marginBottom: 20 }}
            type={"switch"}
            onPress={() => setDarkModeEnabled((prevState) => !prevState)}
          />
          <Text style={styles.sectionText}>{"Support"}</Text>
          <SettingRow
            label={"Report an issue"}
            style={{ paddingVertical: 20 }}
            textStyle={{ color: Color.white }}
            onPress={() => {}}
          />
          <SettingRow
            label={"FAQ"}
            style={{ paddingVertical: 20 }}
            textStyle={{ color: Color.white }}
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
          backgroundColor={Color.primary}
          labelColor={Color.text}
          style={{ marginBottom: 40, marginHorizontal: 10 }}
        />
      </ScrollView>
    </View>
  );
};

export default AccountScreen;
