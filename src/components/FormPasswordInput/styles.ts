import { StyleSheet } from "react-native";

import { Color, FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 50,
    borderColor: Color.lightGrey,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "column",
    justifyContent: "center",
  },
  labelText: {
    position: "absolute",
    padding: 5,
    fontSize: 12,
    alignSelf: "flex-start",
    fontFamily: FontFamily.Regular,
    top: -24,
    left: 8,
  },
  input: {
    padding: 5,
    flex: 1,
  },
  errorText: {},
  paddingHorizontal: {
    paddingHorizontal: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
  },
});

export default styles;
