import React, { FC } from "react";
import {
  StyleProp,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { Color } from "../../constants";

interface IProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  style?: StyleProp<ViewStyle>;
}

const SearchInput: FC<IProps> = ({ value, onChangeText, style, onSearch }) => {
  return (
    <View
      style={[
        {
          padding: 10,
          backgroundColor: Color.white,
          minHeight: 50,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: Color.lightGrey,
          alignItems: "center",
          flexDirection: "row",
        },
        style,
      ]}
    >
      <TextInput
        onChangeText={onChangeText}
        value={value}
        selectionColor={Color.darkGrey}
        style={{ flex: 1 }}
      />
      <TouchableOpacity onPress={onSearch}>
        <Icon
          name={"search"}
          size={20}
          style={{ justifyContent: "flex-end" }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
