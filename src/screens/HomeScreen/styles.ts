import { StyleSheet } from "react-native";
import { Color, FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  sectionHeaderText: {
    paddingLeft: 10,
    fontFamily: FontFamily.Light,
  },
  noResultsContainer: {
    borderRadius: 10,
    margin: 10,
  },
  noResultsText: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    textAlign: "center",
    fontFamily: FontFamily.Light,
  },
});

export default styles;
