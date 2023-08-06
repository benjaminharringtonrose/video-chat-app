import { StyleSheet } from "react-native";
import { Color } from "../../constants";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  timer: {
    zIndex: 3,
    alignItems: "center",
    marginTop: 50,
  },
  lottieContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  lottie: {
    width: 150,
    height: 150,
  },
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
  localStream: {
    borderRadius: 10,
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
  remoteStreamContainer: {
    position: "absolute",
  },
  remoteStream: {
    position: "absolute",
    zIndex: 0,
  },
});

export default styles;
