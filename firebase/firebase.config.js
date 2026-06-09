// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pretypet-abd98.firebaseapp.com",
  projectId: "pretypet-abd98",
  storageBucket: "pretypet-abd98.firebasestorage.app",
  messagingSenderId: "471561119109",
  appId: "1:471561119109:web:643108ef40f308c6b390ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
