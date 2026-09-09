import { firebaseAdminDb } from "./firebase-firestore";

interface RegisterMediaInput {
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

export async function registerMedia(input: RegisterMediaInput) {
  const id = createMediaDocumentId(input.uploadthingKey);

  const mediaRef = firebaseAdminDb.collection("media").doc(id);

  const existing = await mediaRef.get();

  if (existing.exists) {
    const existingData = existing.data();

    if (existingData?.uploadedBy !== input.uploadedBy) {
      throw new Error("This media asset belongs to another user.");
    }

    return {
      id,
      ...input,
      usageCount: existingData.usageCount ?? 0,
      status: existingData.status ?? "active",
    };
  }

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
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id,
    ...input,
    usageCount: 0,
    status: "active",
  };
}
interface DeleteMediaInput {
  mediaId: string;
  userId: string;
}

export async function deleteMedia(input: DeleteMediaInput) {
  const mediaRef = firebaseAdminDb.collection("media").doc(input.mediaId);

  await firebaseAdminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(mediaRef);

    if (!snapshot.exists) {
      throw new Error("Media asset not found.");
    }

    const media = snapshot.data();

    if (!media) {
      throw new Error("Media asset data is missing.");
    }

    if (media.uploadedBy !== input.userId) {
      throw new Error("You are not allowed to delete this media asset.");
    }

    const usageCount =
      typeof media.usageCount === "number" ? media.usageCount : 0;

    if (usageCount > 0) {
      throw new Error(
        "This media asset is still being used by one or more stories.",
      );
    }

    transaction.update(mediaRef, {
      status: "deleting",
      updatedAt: new Date(),
    });
  });

  const { deleteUnusedMedia } = await import("./media-storage");

  await deleteUnusedMedia(input.mediaId);
}
