import React, { FC } from "react";
import {
  StyleProp,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import styles from "./styles";
import { Color } from "../../constants";
import { useTheme } from "@react-navigation/native";

interface IProps {
  isEnabled?: boolean;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  type?: "button" | "switch";
}

const SettingRow: FC<IProps> = ({
  label,
  onPress,
  style,
  textStyle,
  type = "button",
  isEnabled,
}) => {
  const { colors } = useTheme();
  if (type === "button") {
    return (
      <View
        style={[
          style,
          {
            paddingVertical: 10,
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            justifyContent: "center",
          },
        ]}
      >
        <TouchableOpacity onPress={onPress}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.label, { color: colors.text }, textStyle]}>
              {label}
            </Text>
            <Ionicons name={"chevron-forward"} color={colors.grey} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={[style, { paddingBottom: 10 }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.label, { color: colors.text }, textStyle]}>
            {label}
          </Text>
          <Switch
            ios_backgroundColor={colors.medDarkGrey}
            thumbColor={colors.white}
            trackColor={{ false: colors.medDarkGrey, true: colors.primary }}
            value={isEnabled}
            onValueChange={onPress}
          />
        </View>
      </View>
    );
  }
};

export default SettingRow;
