import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants";

const styles = StyleSheet.create({
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
    opacity: 0.8,
  },
  noResultsDescription: {
    paddingVertical: 40,
    paddingHorizontal: 10,
    textAlign: "center",
    fontFamily: FontFamily.Light,
    fontSize: 18,
    opacity: 0.8,
  },
  lottie: {
    alignSelf: "center",
    width: 150,
    height: 150,
  },
  tophalf: {
    flex: 1,
    justifyContent: "center",
  },
  bottomHalf: {
    flex: 1,
  },
});

export default styles;
