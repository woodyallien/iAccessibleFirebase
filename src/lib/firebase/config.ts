// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5PFP-8bzqCknwPAajRQInFdS1cClAqwk",
  authDomain: "iaccessible-4bd62.firebaseapp.com",
  projectId: "iaccessible-4bd62",
  storageBucket: "iaccessible-4bd62.firebasestorage.app",
  messagingSenderId: "866806920101",
  appId: "1:866806920101:web:ae2862b508b1ce5dc6ae4c",
  measurementId: "G-CMKGX2GJD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
