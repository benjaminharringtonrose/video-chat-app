import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  flex: {
    flex: 1,
  },
  topTextContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  messageText: {
    fontFamily: FontFamily.Regular,
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    width: "80%",
  },
  you: {
    fontFamily: FontFamily.Bold,
  },
  date: {
    fontFamily: FontFamily.Light,
    paddingLeft: 10,
  },
});

export default styles;
