import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  localStreamContainer: {
    position: "absolute",
    borderRadius: 10,
    overflow: "hidden",
    left: "60%",
    bottom: "30%",
  },
  endCallContainer: {
    zIndex: 3,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
  },
  endCallButton: {
    backgroundColor: "red",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
