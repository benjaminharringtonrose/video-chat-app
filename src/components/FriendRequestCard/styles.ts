import { StyleSheet } from "react-native";
import { Color, FontFamily } from "../../constants";

const styles = StyleSheet.create({
  friendRequest: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  friendRequestLabel: {
    flex: 1,
    paddingLeft: 10,
    fontFamily: FontFamily.Light,
    color: Color.text,
  },
  friendRequestInner: {
    flex: 1,
    flexDirection: "row",
  },
  friendRequestUsername: {
    fontFamily: FontFamily.Bold,
    color: Color.text,
  },
  searchResultButton: {
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  addButton: {
    fontFamily: FontFamily.SemiBold,
  },
});

export default styles;
