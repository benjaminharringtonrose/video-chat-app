import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSdAOb0LC-MTgR1Xy_H9RCQbiwNBnnjeU",
  authDomain: "video-chat-app-841bf.firebaseapp.com",
  projectId: "video-chat-app-841bf",
  storageBucket: "video-chat-app-841bf.appspot.com",
  messagingSenderId: "649604954515",
  appId: "1:649604954515:web:d3e4e652e9fde5f7089066",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();
