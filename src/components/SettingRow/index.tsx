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
import Icon from "@expo/vector-icons/Ionicons";

import styles from "./styles";
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
          {
            padding: 10,
            borderRadius: 10,
            justifyContent: "center",
            backgroundColor: colors.card,
          },
          style,
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
            <Icon name={"chevron-forward"} color={colors.text} size={20} />
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View
        style={[
          {
            padding: 10,
            borderRadius: 10,
            backgroundColor: colors.card,
          },
          style,
        ]}
      >
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
