import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  avatar: {
    paddingRight: 10,
  },
  flex: {
    flex: 1,
  },
  topTextContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  username: {
    fontFamily: FontFamily.Bold,
    paddingRight: 10,
  },
  date: {
    fontFamily: FontFamily.Light,
    fontSize: 12,
  },
  messageText: {
    fontFamily: FontFamily.Regular,
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    width: "80%",
  },
});

export default styles;
