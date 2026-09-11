import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";

import { db } from "../../../services/firebase/firestore";

interface UserProfileInput {
  name?: string;
}

export async function ensureUserProfile(
  firebaseUser: FirebaseUser,
  profile: UserProfileInput = {},
) {
  const authorName =
    profile.name?.trim() ||
    firebaseUser.displayName?.trim() ||
    firebaseUser.email?.split("@")[0] ||
    "User";

  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      name: authorName,
      email: firebaseUser.email ?? "",
      photoURL: firebaseUser.photoURL ?? null,
      role: "author",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  const publicAuthorRef = doc(db, "publicAuthors", firebaseUser.uid);

  await setDoc(
    publicAuthorRef,
    {
      name: authorName,
    },
    { merge: true },
  );
}

export async function updateUserName(firebaseUser: FirebaseUser, name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Name cannot be empty.");
  }

  const userRef = doc(db, "users", firebaseUser.uid);
  const publicAuthorRef = doc(db, "publicAuthors", firebaseUser.uid);

  await updateDoc(userRef, {
    name: trimmedName,
    updatedAt: serverTimestamp(),
  });

  await setDoc(
    publicAuthorRef,
    {
      name: trimmedName,
    },
    { merge: true },
  );
}
