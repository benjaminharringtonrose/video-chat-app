import { StyleSheet } from "react-native";
import { Color } from "../../constants";

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
    backgroundColor: Color.white,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Color.lightGrey,
    padding: 10,
    borderRadius: 10,
  },
  searchResultButton: {
    backgroundColor: Color.primary,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  friends: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.white,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Color.lightGrey,
    padding: 10,
  },
  friendRequest: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Color.white,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Color.lightGrey,
    padding: 10,
  },
  addButton: {
    color: Color.white,
    fontWeight: "600",
  },
});

export default styles;
