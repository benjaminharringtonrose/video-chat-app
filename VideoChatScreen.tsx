import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Button,
} from "react-native";
import {
  RTCView,
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from "react-native-webrtc";
import { db } from "./api/firebase";

const configuration: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

let sessionConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true,
  },
};

const VideoChatScreen: React.FC = () => {
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [channelId, setChannelId] = useState("");
  const peerConnection = useRef(new RTCPeerConnection(configuration));

  useEffect(() => {
    if (!channelId) return;

    const channelDoc = db.collection("channels").doc(channelId);
    const offers = channelDoc.collection("offers");
    const answers = channelDoc.collection("answers");

    const unsubscribeOffers = offers.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    const unsubscribeAnswers = answers.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    () => {
      unsubscribeOffers();
      unsubscribeAnswers();
    };
  }, [channelId]);

  useEffect(() => {
    if (!channelId) return;
    const channelDoc = db.collection("channels").doc(channelId);
    const offers = channelDoc.collection("offers");
    const answers = channelDoc.collection("answers");

    peerConnection.current.addEventListener("track", (event: any) => {
      console.log("triggered", event);
      if (event.streams && event.streams.length > 0) {
        console.log("triggered");
        setRemoteStream(event.streams[0]);
      }
    });

    peerConnection.current.addEventListener(
      "icecandidate",
      async (event: any) => {
        if (event.candidate) {
          await offers.add(event.candidate.toJSON());
          await answers.add(event.candidate.toJSON());
        }
      }
    );
  }, []);

  const startWebcam = async () => {
    try {
      const localStream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const audioTracks = localStream.getAudioTracks();
      peerConnection.current.addTrack(audioTracks[0], localStream);
      setLocalStream(localStream);

      const remoteStream = new MediaStream(undefined);
      setRemoteStream(remoteStream);

      setWebcamStarted(true);
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const startCall = async () => {
    const channelDoc = db.collection("channels").doc();
    setChannelId(channelDoc.id);

    const offerDescription = await peerConnection.current.createOffer(
      sessionConstraints
    );
    await peerConnection.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await channelDoc.set({ offer });
  };

  const joinCall = async () => {
    const channelDoc = db.collection("channels").doc(channelId);
    const channelDocument = await channelDoc.get();
    const channelData = channelDocument.data();

    const offerDescription = channelData?.offer;

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await channelDoc.update({ answer });
  };

  console.log("webcamStarted", webcamStarted);
  console.log("remoteStream", remoteStream);

  return (
    <KeyboardAvoidingView style={styles.body} behavior="position">
      <SafeAreaView>
        {localStream && (
          <RTCView
            style={styles.stream}
            streamURL={localStream?.toURL()}
            objectFit="cover"
            mirror
          />
        )}

        {remoteStream && (
          <RTCView
            streamURL={remoteStream?.toURL()}
            style={styles.stream}
            objectFit="cover"
            mirror
          />
        )}
        <View>
          {!webcamStarted && (
            <Button title="Start webcam" onPress={startWebcam} />
          )}
          {webcamStarted && <Button title="Start call" onPress={startCall} />}
          {webcamStarted && (
            <View style={{ flexDirection: "row" }}>
              <Button title="Join call" onPress={joinCall} />
              <TextInput
                value={channelId}
                placeholder="callId"
                style={{ borderWidth: 1, padding: 5 }}
                onChangeText={(newText) => setChannelId(newText)}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  stream: {
    flex: 2,
    width: 200,
    height: 200,
  },
  buttons: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
});

export default VideoChatScreen;
