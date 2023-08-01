import { StyleSheet } from "react-native";
import { Color, FontFamily } from "../../constants";

const styles = StyleSheet.create({
  label: {
    fontFamily: FontFamily.Light,
  },
  borderBottom: {
    borderBottomColor: Color.border,
    borderBottomWidth: 1,
  },
});

export default styles;
