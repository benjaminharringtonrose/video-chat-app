import { useEffect, useRef, useState } from "react";
import {
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStreamTrack,
} from "react-native-webrtc";

import { db } from "../api/firebase";
import { useNavigation } from "@react-navigation/native";
import { NavProp, Routes } from "../navigation/types";
import { CallMode, Collection, ICall } from "../types";
import { useRoom } from "../atoms/room";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useAuth } from "../atoms/auth";

const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 2,
};

let sessionConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true,
  },
};

export const useWebRTC = () => {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const {
    roomId,
    webcamStarted,
    currentCall,
    callMode,
    setWebcamStarted,
    setIncomingCall,
    setOutgoingCall,
    setShowRemoteStream,
    setCurrentCall,
  } = useRoom();

  const { user } = useAuth();

  const peerConnection = useRef<RTCPeerConnection>(
    new RTCPeerConnection(configuration)
  ).current;

  const { navigate } = useNavigation<NavProp["navigation"]>();

  useEffect(() => {
    const onTrack = (event: any) => {
      const remote = new MediaStream(undefined);
      event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
        remote.addTrack(track);
      });
      setRemoteStream(remote);
      setShowRemoteStream(true);
    };

    const onConnectionStateChange = async () => {
      switch (peerConnection?.connectionState) {
        case "disconnected": {
          localStream?.getTracks().forEach((track) => {
            track.stop();
          });
          peerConnection.close();
          setLocalStream(undefined);
          setRemoteStream(undefined);
          setShowRemoteStream(false);
          navigate(Routes.Home);
          console.log("DISCONNECTED");
          break;
        }
        case "failed": {
          console.log("FAILED");
          break;
        }
        default:
          break;
      }
    };

    peerConnection.addEventListener(
      "connectionstatechange",
      onConnectionStateChange
    );

    peerConnection.addEventListener("track", onTrack);

    return () => {
      peerConnection.removeEventListener("track", onTrack);
      peerConnection.removeEventListener(
        "connectionstatechange",
        onConnectionStateChange
      );
    };
  }, []);

  useEffect(() => {
    if (!roomId || callMode !== CallMode.Host) return;

    const room = db.collection(Collection.Rooms).doc(roomId);
    const offerCandidates = room.collection(Collection.OfferCandidates);
    const answerCandidates = room.collection(Collection.AnswerCandidates);

    const onIceCandidateAdded = async (event: any) => {
      if (event.candidate) {
        await offerCandidates.add(event.candidate.toJSON());
      }
    };

    peerConnection.addEventListener("icecandidate", onIceCandidateAdded);

    const unsubscribeAnswer = room.onSnapshot((snapshot) => {
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
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      }
    );

    return () => {
      peerConnection.removeEventListener("icecandidate", onIceCandidateAdded);
      unsubscribeAnswerCandidates();
      unsubscribeAnswer();
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId || callMode !== CallMode.Join) return;

    joinRoom(roomId);

    const room = db.collection(Collection.Rooms).doc(roomId);
    const offerCandidates = room.collection(Collection.OfferCandidates);
    const answerCandidates = room.collection(Collection.AnswerCandidates);

    const onIceCandidateAdded = async (event: any) => {
      if (event.candidate) {
        await answerCandidates.add(event.candidate.toJSON());
      }
    };

    peerConnection.addEventListener("icecandidate", onIceCandidateAdded);

    const unsubscribeOfferCandidates = offerCandidates.onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      }
    );

    return () => {
      peerConnection.removeEventListener("icecandidate", onIceCandidateAdded);
      unsubscribeOfferCandidates();
    };
  }, [roomId, callMode]);

  const startWebcam = async () => {
    try {
      const local = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      local.getTracks().forEach((track) => {
        peerConnection.addTrack(track, local);
      });

      const remote = new MediaStream(undefined);
      setRemoteStream(remote);

      setLocalStream(local);

      setWebcamStarted(true);
    } catch (e: any) {
      console.error("startWebcam Error:", e);
    }
  };

  const createRoom = async (roomId: string) => {
    try {
      const roomDoc = db.collection(Collection.Rooms).doc(roomId);

      setOutgoingCall(true);

      const offerDescription = await peerConnection.createOffer(
        sessionConstraints
      );
      await peerConnection.setLocalDescription(offerDescription);
      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };
      await roomDoc.set({
        offer,
        calling: true,
        callAnswered: false,
        callEnded: false,
      });
    } catch (e) {
      console.error("startCall Error:", e);
    }
  };

  const sendCallInvite = async (roomId?: string, friendId?: string) => {
    if (!roomId) {
      return console.warn("No roomId");
    }
    const callDoc = db.collection(Collection.Calls).doc();
    const call: ICall = {
      id: callDoc.id,
      senderUsername: user?.username,
      senderId: user?.uid,
      receiverId: friendId,
      roomId,
      createdAt: new Date().toISOString(),
    };
    setCurrentCall(call);
    await callDoc.set(call);
  };

  const joinRoom = async (roomId: string) => {
    try {
      const roomDoc = db.collection(Collection.Rooms).doc(roomId);

      setIncomingCall(false);

      await roomDoc.update({
        calling: false,
        callAnswered: true,
      });

      const snapshot = await roomDoc.get();
      const room = snapshot.data();

      const offerDescription = room?.offer;

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await roomDoc.update({ answer });
    } catch (e) {
      console.error("joinRoom Error:", e);
    }
  };

  const endStream = async ({ roomId }: { roomId?: string }) => {
    if (!roomId) {
      console.warn("endStream: No roomId");
    }
    try {
      console.log("currentCall?.id", currentCall?.id ?? "none");
      setOutgoingCall(false);
      const roomDoc = db.collection(Collection.Rooms).doc(roomId);
      const callDoc = db.collection(Collection.Calls).doc(currentCall?.id);

      await callDoc.delete();
      await roomDoc.update({
        calling: false,
        callEnded: true,
      });
      setLocalStream(undefined);
      setRemoteStream(undefined);
      setShowRemoteStream(false);

      localStream?.getTracks().forEach((track) => {
        track.stop();
      });
      peerConnection.close();
    } catch (e) {
      console.log("endStream Error:", e);
    }
  };

  return {
    roomId,
    webcamStarted,
    localStream,
    remoteStream,
    startWebcam,
    createRoom,
    sendCallInvite,
    joinRoom,
    endStream,
  };
};
