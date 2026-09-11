import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth } from "../../../services/firebase/auth";
import { db } from "../../../services/firebase/firestore";
import type { MediaAsset } from "../../../types/media";

const mediaCollection = collection(db, "media");

async function getCurrentUserRole() {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return null;
  }

  const userSnapshot = await getDoc(doc(db, "users", currentUser.uid));

  if (!userSnapshot.exists()) {
    return null;
  }

  const role = userSnapshot.data()?.role;

  if (role !== "author" && role !== "editor" && role !== "admin") {
    return null;
  }

  return role as "author" | "editor" | "admin";
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be signed in to view your media.");
  }

  const role = await getCurrentUserRole();

  if (!role) {
    throw new Error("Your user profile could not be verified.");
  }

  const mediaQuery =
    role === "admin" || role === "editor"
      ? query(mediaCollection, where("status", "==", "active"))
      : query(
          mediaCollection,
          where("uploadedBy", "==", currentUser.uid),
          where("status", "==", "active"),
        );

  const snapshot = await getDocs(mediaQuery);

  return snapshot.docs
    .map(
      (document) =>
        ({
          id: document.id,
          ...document.data(),
        }) as MediaAsset,
    )
    .sort(
      (first, second) =>
        second.createdAt.toMillis() - first.createdAt.toMillis(),
    );
}

export async function getMediaById(
  mediaId: string,
): Promise<MediaAsset | null> {
  if (!mediaId.trim()) {
    return null;
  }

  const mediaRef = doc(mediaCollection, mediaId);

  const snapshot = await getDoc(mediaRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as MediaAsset;
}
