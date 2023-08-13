import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
  inputContainer: {
    minHeight: 50,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamily.Regular,
    fontSize: 16,
    paddingLeft: 10,
  },
});

export default styles;
