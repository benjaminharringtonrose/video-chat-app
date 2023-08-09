import { View, StyleSheet } from "react-native";
import { FC } from "react";
import { useTheme } from "@react-navigation/native";

const ItemSeparator: FC = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
      }}
    />
  );
};

export default ItemSeparator;
