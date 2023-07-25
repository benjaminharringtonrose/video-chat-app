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
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
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
  const [callStarted, setCallStarted] = useState(false);
  const [callJoined, setCallJoined] = useState(false);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [channelId, setChannelId] = useState("");

  const peerConnection = useRef(new RTCPeerConnection(configuration)).current;

  useEffect(() => {
    if (!channelId || !webcamStarted) return;

    const channelDoc = db.collection("channels").doc(channelId);
    const offerCandidates = channelDoc.collection("offerCandidates");
    const answerCandidates = channelDoc.collection("answerCandidates");

    peerConnection.addEventListener("track", (event: any) => {
      if (event.streams && event.streams.length > 0) {
        setRemoteStream(event.streams[0]);
        event.streams[0].getTracks().forEach((track: any) => {
          remoteStream?.addTrack(track);
        });
      }
    });

    peerConnection.addEventListener("icecandidate", async (event: any) => {
      if (event.candidate) {
        await offerCandidates.add(event.candidate.toJSON());
        await answerCandidates.add(event.candidate.toJSON());
      }
    });
    () => {
      peerConnection.removeEventListener("track");
      peerConnection.removeEventListener("icecandidate");
    };
  }, [channelId, webcamStarted]);

  useEffect(() => {
    if (!channelId || !callStarted) return;

    const channelDoc = db.collection("channels").doc(channelId);
    const answerCandidates = channelDoc.collection("answerCandidates");

    // When offer answer candidate added, add to peer connection
    const unsubscribe = answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          } catch (e) {
            console.error(e);
          }
        }
      });
    });
    () => unsubscribe();
  }, [channelId, callStarted]);

  useEffect(() => {
    if (!channelId || !callJoined) return;

    const channelDoc = db.collection("channels").doc(channelId);

    const offerCandidates = channelDoc.collection("offerCandidates");

    // When offer candidate added, add to peer connection
    const unsubscribe = offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          } catch (e) {
            console.error(e);
          }
        }
      });
    });

    () => unsubscribe();
  }, [channelId, callJoined]);

  const startWebcam = async () => {
    try {
      const local = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      local.getTracks().forEach((track) => {
        peerConnection.addTrack(track, local);
      });
      setLocalStream(local);
      const remote = new MediaStream(undefined);
      setRemoteStream(remote);
      peerConnection.getSenders().forEach((sender) => {
        let track = sender.track;
        if (track) {
          remote.addTrack(track);
        }
      });
      setWebcamStarted(true);
    } catch (e: any) {
      console.error("startWebcam Error:", e);
    }
  };

  const startCall = async () => {
    try {
      const channelDoc = db.collection("channels").doc();

      setChannelId(channelDoc.id);

      const offerDescription = await peerConnection.createOffer(
        sessionConstraints
      );
      await peerConnection.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await channelDoc.set({ offer });

      setCallStarted(true);
    } catch (e) {
      console.error("startCall Error:", e);
    }
  };

  const joinCall = async () => {
    try {
      const channelDoc = db.collection("channels").doc(channelId);
      const channelDocument = await channelDoc.get();
      const channelData = channelDocument.data();

      const offerDescription = channelData?.offer;

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );
      const answerDescription = await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await channelDoc.update({ answer });

      setCallJoined(true);
    } catch (e) {
      console.error("joinCall Error:", e);
    }
  };

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
