export { Color } from "./Color";
export { usStates, latinText, multiSelectData, radioButtonData } from "./Data";
export { Styles } from "./Styles";
export { FontFamily } from "./FontFamily";

export const rtcConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceTransportPolicy: "all",
  iceCandidatePoolSize: 2,
};

export const sessionConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true,
  },
};
