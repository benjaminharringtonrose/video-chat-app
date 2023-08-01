import { StyleSheet } from "react-native";
import { Color, FontFamily } from "../../constants";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  sectionText: {
    fontFamily: FontFamily.Bold,
    fontSize: 22,
    color: Color.text,
    paddingBottom: 10,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Color.grey,
    marginRight: 10,
  },
});

export default styles;
