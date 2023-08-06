import Voice, {
  SpeechStartEvent,
  SpeechEndEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";
import { useEffect, useState } from "react";

export const useSpeechRecognition = () => {
  const [speechResults, setSpeechResults] = useState("");

  const startSpeechRecognition = async () => {
    await Voice.start("en-US");
  };

  const stopSpeechRecognition = async () => {
    await Voice.stop();
  };

  const onSpeechStart = (e: SpeechStartEvent) => {
    console.log("speechStart successful", e);
  };

  const onSpeechEnd = (e: SpeechEndEvent) => {
    console.log("stop handler", e);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    const text = e.value?.[0] as string;
    setSpeechResults(text);
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return {
    speechResults,
    startSpeechRecognition,
    stopSpeechRecognition,
  };
};
