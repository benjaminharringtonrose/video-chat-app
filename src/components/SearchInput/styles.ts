import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    minHeight: 50,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamily.Regular,
    fontSize: 16,
  },
});

export default styles;
