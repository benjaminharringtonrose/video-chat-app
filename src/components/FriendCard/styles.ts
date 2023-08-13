import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
  friends: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
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
    fontFamily: FontFamily.Bold,
  },
});

export default styles;
