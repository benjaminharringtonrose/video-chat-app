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
import { Collection, QueryKey } from "../types";
import { useRoom } from "../atoms/room";
import { useAuth } from "../atoms/auth";

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
  const [roomJoined, setRoomJoined] = useState(false);

  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const {
    roomId,
    notificationId,
    setRoomId,
    setNotificationId,
    setRemoteCallEnded,
  } = useRoom();

  const { user } = useAuth();

  const peerConnection = useRef(new RTCPeerConnection(configuration)).current;

  const { navigate } = useNavigation<NavProp["navigation"]>();

  useEffect(() => {
    const onTrack = (event: any) => {
      const remote = new MediaStream(undefined);
      event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
        remote.addTrack(track);
      });
      setRemoteStream(remote);
    };

    const onConnectionStateChange = () => {
      switch (peerConnection.connectionState) {
        case "closed":
        case "disconnected":
        case "failed": {
          navigate(Routes.Home);
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
    if (!roomId) return;

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
      peerConnection.removeEventListener("icecandidate", onIceCandidateAdded);
      unsubscribeAnswerCandidates();
      unsubscribeAnswer();
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !roomJoined) return;

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
      peerConnection.removeEventListener("icecandidate", onIceCandidateAdded);
      unsubscribeOfferCandidates();
    };
  }, [roomId, roomJoined]);

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

  const createRoom = async () => {
    try {
      const channelDoc = db.collection(Collection.Rooms).doc();

      setRoomId(channelDoc.id);

      const offerDescription = await peerConnection.createOffer(
        sessionConstraints
      );
      await peerConnection.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await channelDoc.set({ offer });
      return channelDoc.id;
    } catch (e) {
      console.error("startCall Error:", e);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      const channelDoc = db.collection(Collection.Rooms).doc(roomId);
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

      setRoomJoined(true);
    } catch (e) {
      console.error("joinRoom Error:", e);
    }
  };

  const endStream = async (roomId?: string) => {
    if (!roomId) {
      console.warn("endStream: No roomId");
    }
    localStream?.getTracks().forEach((track) => {
      track.stop();
    });

    peerConnection.close();

    console.log(notificationId);

    await db
      .collection(Collection.Notifications)
      .doc(notificationId)
      .update({ calling: false, callEnded: true });

    setLocalStream(undefined);
    setRemoteStream(undefined);
  };

  useEffect(() => {
    if (!roomId || !notificationId) return;
    const unsubscribe = db
      .collection(Collection.Notifications)
      .doc(notificationId)
      .onSnapshot(async (snapshot) => {
        const notification = snapshot.data();
        if (notification?.callEnded) {
          await db.collection(Collection.Rooms).doc(roomId).delete();
          setNotificationId("");
          navigate(Routes.Home);
        }
      });
    return () => unsubscribe();
  }, [roomId, notificationId]);

  return {
    roomId,
    webcamStarted,
    localStream,
    remoteStream,
    startWebcam,
    createRoom,
    joinRoom,
    setRoomId,
    endStream,
  };
};
