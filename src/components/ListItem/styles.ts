import { StyleSheet } from "react-native";
import { Color, FontFamily } from "../../constants";

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchResults: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  searchResultButton: {
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  friends: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.background,
    marginTop: 10,
    padding: 10,
  },
  friendRequest: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 10,
  },
  addButton: {
    fontFamily: FontFamily.SemiBold,
  },
});

export default styles;
