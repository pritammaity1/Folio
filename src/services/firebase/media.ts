import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { auth } from "./auth";
import { db } from "./firestore";

export interface MediaAsset {
  id: string;
  uploadthingKey: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  usageCount: number;
  publishedUsageCount: number;
  status: "active" | "deleting";
  isPublic: boolean;
}

const mediaCollection = collection(db, "media");

function parseMediaAsset(
  id: string,
  data: Record<string, unknown>,
): MediaAsset | null {
  if (
    typeof data.url !== "string" ||
    typeof data.uploadthingKey !== "string" ||
    typeof data.fileName !== "string" ||
    typeof data.mimeType !== "string" ||
    typeof data.size !== "number" ||
    typeof data.uploadedBy !== "string" ||
    typeof data.usageCount !== "number" ||
    (data.status !== "active" && data.status !== "deleting")
  ) {
    return null;
  }

  const publishedUsageCount =
    typeof data.publishedUsageCount === "number" ? data.publishedUsageCount : 0;

  const isPublic =
    typeof data.isPublic === "boolean"
      ? data.isPublic
      : publishedUsageCount > 0;

  return {
    id,
    uploadthingKey: data.uploadthingKey,
    url: data.url,
    fileName: data.fileName,
    mimeType: data.mimeType,
    size: data.size,
    uploadedBy: data.uploadedBy,
    usageCount: data.usageCount,
    publishedUsageCount,
    status: data.status,
    isPublic,
  };
}

export async function getMediaById(mediaId: string) {
  if (!mediaId.trim()) {
    return null;
  }

  const mediaRef = doc(mediaCollection, mediaId);

  const snapshot = await getDoc(mediaRef);

  if (!snapshot.exists()) {
    return null;
  }

  return parseMediaAsset(snapshot.id, snapshot.data());
}

export async function getMediaAssets(
  userId: string,
  canManageAllMedia = false,
) {
  if (!userId.trim()) {
    return [];
  }

  const mediaQuery = canManageAllMedia
    ? query(
        mediaCollection,
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
      )
    : query(
        mediaCollection,
        where("uploadedBy", "==", userId),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
      );

  const snapshot = await getDocs(mediaQuery);

  return snapshot.docs
    .map((mediaSnapshot) =>
      parseMediaAsset(mediaSnapshot.id, mediaSnapshot.data()),
    )
    .filter((media): media is MediaAsset => media !== null);
}

export async function getCurrentUserMedia() {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be signed in.");
  }

  return getMediaAssets(currentUser.uid, false);
}
