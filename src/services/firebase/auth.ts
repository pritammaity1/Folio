import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  getAuth,
} from "firebase/auth";
import { firebaseApp } from "./config";

export const auth = getAuth(firebaseApp);

export const googleProvider = new GoogleAuthProvider();

export const configureAuthPersistence = async (rememberMe = true) => {
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence,
  );
};

export const signUpWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const sendPasswordReset = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

export const signOutUser = async () => {
  return signOut(auth);
};
