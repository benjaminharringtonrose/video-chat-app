import React, { FC } from "react";
import {
  StyleProp,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { Color, FontFamily } from "../../constants";
import styles from "./styles";

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
  return (
    <View style={[styles.root, { backgroundColor: Color.card }, style]}>
      <TextInput
        onChangeText={onChangeText}
        value={value}
        selectionColor={Color.secondary}
        style={[styles.textInput, { color: Color.input }]}
        placeholder={placeholder}
        placeholderTextColor={Color.placeholder}
        cursorColor={Color.placeholder}
      />
      <TouchableOpacity onPress={onSearch}>
        <Icon
          name={"search"}
          size={20}
          style={{ justifyContent: "flex-end" }}
          color={Color.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
