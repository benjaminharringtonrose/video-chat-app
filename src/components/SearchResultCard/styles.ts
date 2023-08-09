import { StyleSheet } from "react-native";
import { Color, FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
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
  searchResultLabel: {
    flex: 1,
    paddingLeft: 10,
    fontFamily: FontFamily.Light,
  },
  searchResultInner: {
    flex: 1,
    flexDirection: "row",
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
