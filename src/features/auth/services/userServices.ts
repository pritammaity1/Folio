import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { type User as FirebaseUser } from "firebase/auth";

import { db } from "../../../services/firebase/firestore";

export async function ensureUserProfile(firebaseUser: FirebaseUser) {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    return;
  }

  await setDoc(userRef, {
    name:
      firebaseUser.displayName?.trim() ||
      firebaseUser.email?.split("@")[0] ||
      "User",
    email: firebaseUser.email ?? "",
    photoURL: firebaseUser.photoURL ?? null,
    role: "author",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
