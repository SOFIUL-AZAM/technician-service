// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBF_owFlCsGnM4KcrZFGQHwxdkkxvXIZA",
  authDomain: "technician-service-ce7a9.firebaseapp.com",
  projectId: "technician-service-ce7a9",
  storageBucket: "technician-service-ce7a9.appspot.com",
  messagingSenderId: "636586253040",
  appId: "1:636586253040:web:8fd7068eb2bd317ca48035",
  measurementId: "G-6GRJ5BJ4F0"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
