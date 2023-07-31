import { StyleSheet } from "react-native";

import { Color, FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    minHeight: 50,
    borderColor: Color.medDarkGrey,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "column",
    zIndex: 1,
    justifyContent: "center",
  },
  labelText: {
    position: "absolute",
    padding: 5,
    fontSize: 12,
    alignSelf: "flex-start",
    fontFamily: FontFamily.Regular,
    top: -12,
    left: 8,
  },
  input: {
    padding: 10,
    fontFamily: FontFamily.Regular,
  },
  errorText: {},
});

export default styles;
