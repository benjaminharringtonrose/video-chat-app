import React, { FC } from "react";
import {
  StyleProp,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import styles from "./styles";
import { useTheme } from "@react-navigation/native";

interface IProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

const SearchInput: FC<IProps> = ({
  value,
  onChangeText,
  style,
  onSearch,
  placeholder,
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.card }, style]}>
      <TouchableOpacity onPress={onSearch} style={{ padding: 10 }}>
        <Icon
          name={"search"}
          size={20}
          style={{ justifyContent: "flex-end", width: 20, height: 20 }}
          color={colors.text}
        />
      </TouchableOpacity>
      <TextInput
        onChangeText={onChangeText}
        value={value}
        selectionColor={colors.grey}
        style={[styles.textInput, { color: colors.input }]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        cursorColor={colors.placeholder}
        onSubmitEditing={onSearch}
        returnKeyType={"search"}
        autoCapitalize={"none"}
      />
    </View>
  );
};

export default SearchInput;
