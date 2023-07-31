import { View, StyleSheet } from "react-native";
import { Color } from "../../constants";
import { FC } from "react";

const ItemSeparator: FC = () => (
  <View
    style={{
      height: StyleSheet.hairlineWidth,
      backgroundColor: Color.border,
    }}
  />
);

export default ItemSeparator;
