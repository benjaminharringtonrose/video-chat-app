import { StyleSheet } from "react-native";
import { Color, FontFamily } from "../../constants";

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchResult: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  searchResultInner: {
    flexDirection: "row",
    alignItems: "center",
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
});

export default styles;
