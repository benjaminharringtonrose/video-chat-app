import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    minHeight: 50,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontFamily: FontFamily.Bold,
  },
});

export default styles;
