import { StyleSheet } from "react-native";

import { Color } from "../../constants/Color";
import { FontFamily } from "../../constants";

const CardElevation = {
  shadowColor: Color.grey,
  shadowOffset: {
    width: 2,
    height: 2,
  },
  shadowOpacity: 0.5,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  titleText: {
    fontFamily: FontFamily.Bold,
  },
  descriptionText: {
    marginTop: 5,
    fontFamily: FontFamily.Regular,
    fontSize: 12,
    marginBottom: 20,
  },
});

export default styles;
