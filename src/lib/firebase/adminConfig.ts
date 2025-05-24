// src/lib/firebase/adminConfig.ts
import * as admin from 'firebase-admin';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'iaccessible-4bd62'; // Fallback to your known project ID

if (!admin.apps.length) {
  // Check specifically for the Auth emulator host environment variable
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    console.log(`[Admin SDK] Initializing for EMULATOR environment. Auth Host: ${process.env.FIREBASE_AUTH_EMULATOR_HOST}, Project ID: ${projectId}`);
    try {
      admin.initializeApp({
        projectId: projectId,
        // Note: For emulators, explicit credentials are often not needed if FIREBASE_AUTH_EMULATOR_HOST is set.
        // The Admin SDK should automatically detect and connect to the emulators.
      });
      console.log("[Admin SDK] Successfully initialized for EMULATOR environment.");
    } catch (error) {
      console.error("[Admin SDK] Error initializing for EMULATOR environment:", error);
      // Potentially re-throw or handle if essential services can't be used
    }
  } else {
    // Logic for deployed/production environment
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;
    if (serviceAccountJson) {
      console.log("[Admin SDK] Initializing for PRODUCTION environment with service account.");
      try {
        const serviceAccount = JSON.parse(serviceAccountJson);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id || projectId, // Prefer project_id from service account
        });
        console.log("[Admin SDK] Successfully initialized for PRODUCTION environment.");
      } catch (error) {
        console.error("[Admin SDK] Error initializing for PRODUCTION with service account:", error);
        // Fallback or throw error if critical
      }
    } else {
      console.warn("[Admin SDK] Running in non-emulator mode, but FIREBASE_SERVICE_ACCOUNT_KEY_JSON is not set. Some Admin SDK features may not work.");
      // Initialize without explicit credentials if projectId is known, relying on Application Default Credentials if available in the environment
      if (projectId) {
        try {
            admin.initializeApp({ projectId });
            console.log("[Admin SDK] Initialized with projectId only (non-emulator, no service account).");
        } catch(error) {
            console.error("[Admin SDK] Failed to initialize with projectId only:", error);
        }
      } else {
        console.error("[Admin SDK] Cannot initialize: No emulator host, no service account, and no project ID.");
      }
    }
  }
} else {
  console.log("[Admin SDK] Already initialized.");
}

export default admin;
