import { useEffect, useRef, useState } from "react";
import {
  RTCView,
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStreamTrack,
} from "react-native-webrtc";

import { db } from "../../api/firebase";

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

export const useWebRTC = () => {
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [callJoined, setCallJoined] = useState(false);

  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const [channelId, setChannelId] = useState("");

  const peerConnection = useRef(new RTCPeerConnection(configuration)).current;

  useEffect(() => {
    const onTrack = (event: any) => {
      const remote = new MediaStream(undefined);

      event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
        remote.addTrack(track);
      });

      setRemoteStream(remote);
    };

    peerConnection.addEventListener("track", onTrack);

    return () => peerConnection.removeEventListener("track", onTrack);
  }, []);

  useEffect(() => {
    if (!channelId) return;

    const channelDoc = db.collection("channels").doc(channelId);
    const offerCandidates = channelDoc.collection("offerCandidates");
    const answerCandidates = channelDoc.collection("answerCandidates");

    const onIceCandidate = async (event: any) => {
      if (event.candidate) {
        await offerCandidates.add(event.candidate.toJSON());
      }
    };

    peerConnection.addEventListener("icecandidate", onIceCandidate);

    const unsubscribeAnswer = channelDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!peerConnection.remoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        peerConnection.setRemoteDescription(answerDescription);
      }
    });

    const unsubscribeAnswerCandidates = answerCandidates.onSnapshot(
      (snapshot) => {
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
      }
    );

    return () => {
      peerConnection.removeEventListener("icecandidate", onIceCandidate);
      unsubscribeAnswerCandidates();
      unsubscribeAnswer();
    };
  }, [channelId]);
};
