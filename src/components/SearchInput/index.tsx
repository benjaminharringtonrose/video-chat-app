import React, { FC } from "react";
import {
  Keyboard,
  StyleProp,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { Color } from "../../constants";
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
      <TouchableOpacity onPress={onSearch} style={{ padding: 10 }}>
        <Icon
          name={"search"}
          size={20}
          style={{ justifyContent: "flex-end" }}
          color={Color.text}
        />
      </TouchableOpacity>
      <TextInput
        onChangeText={onChangeText}
        value={value}
        selectionColor={Color.grey}
        style={[styles.textInput, { color: Color.input }]}
        placeholder={placeholder}
        placeholderTextColor={Color.placeholder}
        cursorColor={Color.placeholder}
        onSubmitEditing={onSearch}
        returnKeyType={"search"}
        autoCapitalize={"none"}
      />
    </View>
  );
};

export default SearchInput;
