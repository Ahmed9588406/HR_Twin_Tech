// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-DenE_w3Ic2z8W0E73z5wkVpHv3oK0bY",
  authDomain: "shl-hr.firebaseapp.com",
  projectId: "shl-hr",
  storageBucket: "shl-hr.firebasestorage.app",
  messagingSenderId: "713300932661",
  appId: "1:713300932661:web:154b17f22fef0b4f6a997c",
  measurementId: "G-EHM6TZGWGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);