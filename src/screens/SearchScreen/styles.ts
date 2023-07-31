import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchInput: {
    marginTop: 10,
  },
  noResultsContainer: {
    borderRadius: 10,
    marginTop: 20,
  },
  noResultsText: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    textAlign: "center",
    fontFamily: FontFamily.Bold,
    fontSize: 24,
    opacity: 0.8,
  },
});

export default styles;
