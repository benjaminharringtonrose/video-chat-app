import { Collection } from "../types";
import { db } from "./firebase";

export const deleteRoom = async (roomId?: string) => {
  if (!roomId) return;
  const roomRef = db.collection("rooms").doc(roomId);
  const offerCandidatesRef = roomRef.collection("offerCandidates");
  const answerCandidatesRef = roomRef.collection("answerCandidates");
  const offerCandidates = await offerCandidatesRef.get();
  offerCandidates.forEach(async (candidate) => {
    await offerCandidatesRef.doc(candidate.id).delete();
  });
  const answerCandidates = await answerCandidatesRef.get();
  answerCandidates.forEach(async (candidate) => {
    await answerCandidatesRef.doc(candidate.id).delete();
  });
  await roomRef.delete();
};

export const deleteCall = async (callId?: string) => {
  if (!callId) return;
  await db.collection(Collection.Calls).doc(callId).delete();
};
