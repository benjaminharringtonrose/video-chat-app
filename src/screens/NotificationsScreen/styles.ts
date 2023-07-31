import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  noResultsContainer: {
    borderRadius: 10,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    paddingBottom: 20,
    paddingHorizontal: 10,
    textAlign: "center",
    fontFamily: FontFamily.Medium,
    fontSize: 24,
  },
});

export default styles;
