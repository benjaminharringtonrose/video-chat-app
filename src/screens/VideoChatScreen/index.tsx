import React, { FC } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { RTCView } from "react-native-webrtc";
import { useWebRTC } from "../../hooks/useWebRTC";
import Button from "../../components/Button";
import { Color } from "../../constants";

const VideoChatScreen: FC = () => {
  const { width, height } = useWindowDimensions();
  const {
    roomId,
    localStream,
    remoteStream,
    webcamStarted,
    startWebcam,
    createRoom,
    joinRoom,
    setRoomId,
  } = useWebRTC();

  const localWidth = width / 3;
  const localHeight = height / 3;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Color.background }}
      behavior="position"
    >
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={{
            position: "absolute",
            width,
            height,
            zIndex: 0,
          }}
          objectFit={"cover"}
          mirror
          zOrder={0}
        />
      )}

      {localStream && (
        <RTCView
          style={{
            width: localWidth,
            height: localHeight,
            position: "absolute",
            left: width - localWidth - 40,
            top: height - localHeight - 240,
            borderRadius: 10,
          }}
          streamURL={localStream.toURL()}
          objectFit={"cover"}
          mirror
          zOrder={1}
        />
      )}
      <View
        style={{
          zIndex: 2,
          position: "absolute",
          top: height - 300,
          marginLeft: 20,
        }}
      >
        {!webcamStarted && (
          <Button
            label={"Start webcam"}
            onPress={startWebcam}
            labelColor={Color.text}
            backgroundColor={Color.primary}
            borderRadius={10}
          />
        )}
        {webcamStarted && (
          <Button
            label={"Create Room"}
            onPress={createRoom}
            labelColor={Color.text}
            backgroundColor={Color.primary}
            borderRadius={10}
            style={{ marginBottom: 20 }}
          />
        )}
        {webcamStarted && (
          <View style={{ flexDirection: "row" }}>
            <View>
              <Button
                label={"Join Room"}
                onPress={joinRoom}
                labelColor={Color.text}
                backgroundColor={Color.primary}
                style={{ marginRight: 20 }}
              />
            </View>
            <TextInput
              value={roomId}
              placeholder={"roomId"}
              style={{
                borderWidth: 1,
                backgroundColor: "white",
                minHeight: 40,
                maxHeight: 50,
              }}
              onChangeText={(newText) => setRoomId(newText)}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default VideoChatScreen;
