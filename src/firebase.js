import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
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

// 디버깅용 로그
console.log('🔧 Firebase Config Check:', {
  apiKey: firebaseConfig.apiKey ? '✓' : '✗',
  authDomain: firebaseConfig.authDomain ? '✓' : '✗',
  projectId: firebaseConfig.projectId ? '✓' : '✗',
  storageBucket: firebaseConfig.storageBucket ? '✓' : '✗',
  messagingSenderId: firebaseConfig.messagingSenderId ? '✓' : '✗',
  appId: firebaseConfig.appId ? '✓' : '✗',
  isConfigured: isFirebaseConfigured
});

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('🔥 Firebase initialized successfully with project:', firebaseConfig.projectId);
  } catch (err) {
    console.error('❌ Firebase init error:', err);
    console.warn('⚠️ Firebase init warning:', err);
  }
} else {
  console.warn('⚠️ Firebase is NOT configured. Using local demo mode.');
  console.warn('📝 Add VITE_FIREBASE_* keys to .env to enable Firestore');
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
  updateDoc,
  deleteDoc,
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
