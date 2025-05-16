import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithRedirect, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo"}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

// Debug: Log Firebase config and env variables at runtime (remove in production)
if (typeof window !== "undefined") {
  // Only log in browser, not during SSR/build
  // eslint-disable-next-line no-console
  console.log("[Firebase Config]", firebaseConfig);
  // eslint-disable-next-line no-console
  console.log("[Env] VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
  // eslint-disable-next-line no-console
  console.log("[Env] VITE_FIREBASE_PROJECT_ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
  // eslint-disable-next-line no-console
  console.log("[Env] VITE_FIREBASE_APP_ID:", import.meta.env.VITE_FIREBASE_APP_ID);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google login
export const signInWithGoogle = async () => {
  const result = await signInWithRedirect(auth, googleProvider);
  return result;
};

// Email/password login
export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Email/password registration
export const registerWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign out
export const signOut = () => {
  return firebaseSignOut(auth);
};

// Auth state listener
export const onAuthChanged = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
