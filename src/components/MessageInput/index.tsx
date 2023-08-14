import React, { FC } from "react";
import {
  Keyboard,
  StyleProp,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon from "@expo/vector-icons/Ionicons";
import styles from "./styles";

interface IProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => Promise<void>;
  style?: StyleProp<ViewStyle>;
}

const MessageInput: FC<IProps> = ({ value, onChangeText, onSubmit, style }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: colors.card,
        },
        style,
      ]}
    >
      <TextInput
        onChangeText={onChangeText}
        value={value}
        selectionColor={colors.grey}
        style={[styles.textInput, { color: colors.input }]}
        placeholder={"Type here..."}
        placeholderTextColor={colors.placeholder}
        cursorColor={colors.placeholder}
        onSubmitEditing={onSubmit}
        returnKeyType={"send"}
        autoCapitalize={"sentences"}
      />
      <TouchableOpacity
        style={{ paddingRight: 10 }}
        onPress={() => {
          onSubmit();
          Keyboard.dismiss();
        }}
      >
        <Icon color={colors.placeholder} name={"send"} size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;
