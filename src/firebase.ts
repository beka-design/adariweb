import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Safely attempt to load the local config file using Vite's glob import.
// This will NOT throw an error if the file is missing (e.g., on Vercel).
const configFiles = import.meta.glob('../firebase-applet-config.json', { eager: true });
const localConfig = (configFiles['../firebase-applet-config.json'] as any)?.default || {};

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || localConfig.measurementId || ""
};

const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || localConfig.firestoreDatabaseId;

// Final check to help you debug in the browser console
if (!firebaseConfig.apiKey && import.meta.env.DEV) {
    console.warn("Firebase API Key is missing. If you are developing locally, ensure firebase-applet-config.json exists or .env is configured.");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firestoreDatabaseId);

export default app;
