import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { firebaseApp } from "./config";

export const auth = getAuth(firebaseApp);

export const googleProvider = new GoogleAuthProvider();

// Keep the user's authentication session across browser sessions.
export const configureAuthPersistence = async () => {
  await setPersistence(auth, browserLocalPersistence);
};

//creating new account using email and password

export const signUpWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in with an existing account using email and password

export const signInWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// sign in with google

export const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

//sign out

export const signOutUser = async () => {
  return signOut(auth);
};
