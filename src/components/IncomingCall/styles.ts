import { StyleSheet } from "react-native";
import { Color, FontFamily } from "../../constants";

const styles = StyleSheet.create({
  declineCallButton: {
    backgroundColor: "red",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptCallButton: {
    backgroundColor: "green",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  blurView: {
    marginHorizontal: 10,
    borderRadius: 15,
    padding: 10,
    overflow: "hidden",
  },
  outerRow: {
    flexDirection: "row",
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
  },
  usernameText: {
    fontFamily: FontFamily.Bold,
    paddingLeft: 10,
  },
});

export default styles;
