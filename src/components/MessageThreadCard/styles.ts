import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  leftTextContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  username: {
    fontFamily: FontFamily.Bold,
    fontSize: 15,
  },
  lastMessage: {
    fontFamily: FontFamily.Light,
  },
  updatedAt: {
    fontFamily: FontFamily.Light,
    paddingRight: 6,
  },
});

export default styles;
