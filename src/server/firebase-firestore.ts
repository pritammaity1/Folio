import { FieldValue, getFirestore } from "firebase-admin/firestore";

import { firebaseAdminApp } from "./firebase-auth";

export const firebaseAdminDb = getFirestore(firebaseAdminApp);

interface CreateMediaDocumentInput {
  uploadthingKey: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
}

function createMediaDocumentId(uploadthingKey: string) {
  return encodeURIComponent(uploadthingKey);
}

export async function createMediaDocument(input: CreateMediaDocumentInput) {
  const id = createMediaDocumentId(input.uploadthingKey);

  const mediaRef = firebaseAdminDb.collection("media").doc(id);

  const now = FieldValue.serverTimestamp();

  await mediaRef.set({
    id,
    uploadthingKey: input.uploadthingKey,
    url: input.url,
    fileName: input.fileName,
    mimeType: input.mimeType,
    size: input.size,
    uploadedBy: input.uploadedBy,
    usageCount: 0,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    ...input,
  };
}
