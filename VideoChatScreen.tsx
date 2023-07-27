import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Text,
  Button,
} from "react-native";
import {
  RTCView,
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStreamTrack,
} from "react-native-webrtc";
import { db } from "./api/firebase";

interface IICECandidateParams {
  candidate?: string | undefined;
  sdpMLineIndex?: null | undefined;
  sdpMid?: null | undefined;
}

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

  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const [channelId, setChannelId] = useState("");

  const peerConnection = useRef(new RTCPeerConnection(configuration)).current;

  useEffect(() => {
    if (!channelId || !webcamStarted) return;
    console.log("WEBCAM STARTED");

    const addRemoteTracks = (event: any) => {
      if (event.streams && event.streams.length > 0) {
        event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
          remoteStream?.addTrack(track);
        });
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnection.addEventListener("track", addRemoteTracks);

    return () => {
      peerConnection.removeEventListener("track", addRemoteTracks);
    };
  }, [channelId, webcamStarted]);

  useEffect(() => {
    if (!channelId || !callStarted) return;
    console.log("CALL STARTED");

    const channelDoc = db.collection("channels").doc(channelId);
    const offerCandidates = channelDoc.collection("offerCandidates");
    const answerCandidates = channelDoc.collection("answerCandidates");

    const handleIceCandidate = async (event: any) => {
      if (event.candidate) {
        console.log("offer candidate added as ICE candidate");
        await offerCandidates.add(event.candidate.toJSON());
      }
    };

    peerConnection.addEventListener("icecandidate", handleIceCandidate);

    // Listen for remote answer
    const unsubscribeAnswer = channelDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!peerConnection.remoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        peerConnection.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    const unsubscribeAnswerCandidates = answerCandidates.onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            try {
              console.log("answer candidate added as ICE candidate");
              await peerConnection.addIceCandidate(new RTCIceCandidate(data));
            } catch (e) {
              console.error(e);
            }
          }
        });
      }
    );

    return () => {
      peerConnection.removeEventListener("icecandidate", handleIceCandidate);
      unsubscribeAnswerCandidates();
      unsubscribeAnswer();
    };
  }, [channelId, callStarted]);

  useEffect(() => {
    if (!channelId || !callJoined) return;
    console.log("CALL JOINED");

    const channelDoc = db.collection("channels").doc(channelId);
    const offerCandidates = channelDoc.collection("offerCandidates");
    const answerCandidates = channelDoc.collection("answerCandidates");

    const handleIceCandidate = async (event: any) => {
      if (event.candidate) {
        console.log("answer candidate added");
        await answerCandidates.add(event.candidate.toJSON());
      }
    };

    // When offer candidate added, add to peer connection
    const unsubscribeOfferCandidates = offerCandidates.onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            try {
              console.log("offer candidate added as ICE candidate");
              await peerConnection.addIceCandidate(new RTCIceCandidate(data));
            } catch (e) {
              console.error(e);
            }
          }
        });
      }
    );

    return () => {
      peerConnection.removeEventListener("icecandidate", handleIceCandidate);
      unsubscribeOfferCandidates();
    };
  }, [channelId, callJoined]);

  const startWebcam = async () => {
    try {
      const local = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      local.getTracks().forEach((track) => {
        peerConnection.addTrack(track, local);
      });

      setLocalStream(local);

      const remote = new MediaStream(undefined);
      setRemoteStream(remote);

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

  console.log("remoteStream", remoteStream?._tracks.length);

  return (
    <KeyboardAvoidingView style={styles.body} behavior="position">
      <SafeAreaView>
        {localStream && (
          <RTCView
            style={styles.stream}
            streamURL={localStream.toURL()}
            objectFit="cover"
            mirror
          />
        )}

        {remoteStream && (
          <RTCView
            streamURL={remoteStream.toURL()}
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
    borderWidth: 1,
    borderColor: "red",
  },
  buttons: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
});

export default VideoChatScreen;
