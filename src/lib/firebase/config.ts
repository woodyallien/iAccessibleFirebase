// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5PFP-8bzqCknwPAajRQInFdS1cClAqwk",
  authDomain: "iaccessible-4bd62.firebaseapp.com",
  projectId: "iaccessible-4bd62",
  storageBucket: "iaccessible-4bd62.firebasestorage.app",
  messagingSenderId: "866806920101",
  appId: "1:866806920101:web:ae2862b508b1ce5dc6ae4c",
  measurementId: "G-CMKGX2GJD0"
};

let app: FirebaseApp;
// Ensure Firebase is initialized only once
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Check if we should use emulators (typically for local development)
// This variable should be set in your .env.local file for Next.js (e.g., NEXT_PUBLIC_USE_EMULATORS=true)
if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  console.log("Firebase config: Connecting to LOCAL emulators.");
  try {
    // Ensure these ports match your firebase.json emulator configuration
    // Auth: 9099, Functions: 5001, Firestore: 8080, Storage: 9199 (as per your setup)
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "localhost", 8080);
    connectFunctionsEmulator(functions, "localhost", 5001);
    connectStorageEmulator(storage, "localhost", 9199);
    console.log("Successfully configured to use Auth, Firestore, Functions, and Storage emulators.");
  } catch (error) {
    console.error("Error connecting to Firebase emulators:", error);
  }
} else {
  console.log("Firebase config: Connecting to PRODUCTION Firebase services.");
}

let analytics;
// Initialize Analytics only in the browser and typically not when using emulators,
// or based on specific environment checks to avoid polluting production analytics.
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_EMULATORS !== 'true') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized for production.");
    } else {
      console.log("Firebase Analytics is not supported in this environment.");
    }
  });
}

export { app, auth, db, functions, storage, analytics };