import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    padding: 10,

    minHeight: 50,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamily.Regular,
  },
});

export default styles;
