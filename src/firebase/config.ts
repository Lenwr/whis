// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDvku5euLyzqnmYr_gKdgv1ObsXrYtc2wY",
    authDomain: "whis-e77ee.firebaseapp.com",
    projectId: "whis-e77ee",
    storageBucket: "whis-e77ee.firebasestorage.app",
    messagingSenderId: "846886631218",
    appId: "1:846886631218:web:13221bca8178495289892b"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
