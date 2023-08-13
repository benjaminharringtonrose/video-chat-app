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
    paddingBottom: 5,
  },
  lastMessage: {
    fontFamily: FontFamily.Light,
  },
  updatedAt: {
    fontFamily: FontFamily.Light,
    paddingRight: 6,
    paddingBottom: 5,
  },
  unreadCount: {
    paddingRight: 30,
  },
  badgeContainer: {
    position: "absolute",
    left: "70%",
    top: "40%",
    flexDirection: "row",
  },
});

export default styles;
