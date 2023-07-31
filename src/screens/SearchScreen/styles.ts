import { StyleSheet } from "react-native";
import { Color } from "../../constants";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginHorizontal: 10,
  },
  searchInput: {
    marginTop: 10,
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
  },
  searchResultButton: {
    backgroundColor: Color.primary,
    padding: 10,
    borderRadius: 10,
  },
  noResultsContainer: {
    backgroundColor: Color.white,
    borderRadius: 10,
    marginTop: 20,
  },
  noResultsText: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    textAlign: "center",
  },
});

export default styles;
