import { StyleSheet } from "react-native";
import { Color, FontFamily } from "../../constants";

const styles = StyleSheet.create({
  friends: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.background,
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  spaceBetween: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  friendLabel: {
    paddingLeft: 10,
    color: Color.text,
    fontFamily: FontFamily.Bold,
  },
});

export default styles;
