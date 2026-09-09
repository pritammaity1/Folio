import { doc, getDoc } from "firebase/firestore";

import { db } from "./firestore";

interface MediaAsset {
  id: string;
  uploadthingKey: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  usageCount: number;
  status: "active" | "deleting";
}

const mediaCollection = "media";

export async function getMediaById(mediaId: string) {
  if (!mediaId.trim()) {
    return null;
  }

  const mediaRef = doc(db, mediaCollection, mediaId);
  const snapshot = await getDoc(mediaRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

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

  return {
    id: snapshot.id,
    uploadthingKey: data.uploadthingKey,
    url: data.url,
    fileName: data.fileName,
    mimeType: data.mimeType,
    size: data.size,
    uploadedBy: data.uploadedBy,
    usageCount: data.usageCount,
    status: data.status,
  } satisfies MediaAsset;
}
