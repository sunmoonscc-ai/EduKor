import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'koredu-lms',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if Firebase config is properly provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
);

let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('🔥 Firebase initialized successfully with project:', firebaseConfig.projectId);
  } catch (err) {
    console.warn('⚠️ Firebase init warning:', err);
  }
} else {
  console.info('ℹ️ Firebase is running in local demo mode. Add VITE_FIREBASE_* keys to .env to connect live Firestore.');
}

export {
  app,
  db,
  auth,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
};
