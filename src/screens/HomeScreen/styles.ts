import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  sectionHeaderText: {
    paddingLeft: 10,
    fontFamily: FontFamily.Light,
  },
  noResultsContainer: {
    flex: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  noResultsTitle: {
    paddingHorizontal: 10,
    textAlign: "center",
    fontFamily: FontFamily.Bold,
    fontSize: 24,
  },
  noResultsDescription: {
    paddingVertical: 40,
    paddingHorizontal: 10,
    textAlign: "center",
    fontFamily: FontFamily.Light,
    fontSize: 18,
  },
});

export default styles;
