import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    paddingVertical: 20,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  tabIndicator: {
    position: "absolute",
    height: 4,
    borderRadius: 2,
    top: -10,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    position: "absolute",
    left: 20,
  },
});

export default styles;
