import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 20,
    bottom: 10,
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
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: "absolute",
    left: 15,
    bottom: 10,
    backgroundColor: "#e91e63",
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    left: 25,
    backgroundColor: "#e91e63",
  },
});

export default styles;
