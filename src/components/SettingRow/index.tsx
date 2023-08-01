import React, { FC } from "react";
import {
  StyleProp,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import styles from "./styles";
import { Color } from "../../constants";

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
  if (type === "button") {
    return (
      <View style={[style, { paddingBottom: 10 }]}>
        <TouchableOpacity onPress={onPress}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={[styles.label, { color: Color.text }, textStyle]}>
              {label}
            </Text>
            <Ionicons name={"chevron-forward"} color={Color.grey} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={[style, { paddingBottom: 10 }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.label, { color: Color.text }, textStyle]}>
            {label}
          </Text>
          <Switch
            ios_backgroundColor={Color.medDarkGrey}
            thumbColor={Color.white}
            trackColor={{ false: Color.medDarkGrey, true: Color.primary }}
            value={isEnabled}
            onValueChange={onPress}
          />
        </View>
      </View>
    );
  }
};

export default SettingRow;
