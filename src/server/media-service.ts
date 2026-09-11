import { firebaseAdminDb } from "./firebase-firestore";

type UserRole = "author" | "editor" | "admin";

interface RegisterMediaInput {
  uploadthingKey: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
}

interface DeleteMediaInput {
  mediaId: string;
  userId: string;
}

interface SetMediaPublicInput {
  mediaId: string;
  userId: string;
  isPublic: boolean;
}

function createMediaDocumentId(uploadthingKey: string) {
  return encodeURIComponent(uploadthingKey);
}

async function getUserRole(userId: string): Promise<UserRole | null> {
  const userSnapshot = await firebaseAdminDb
    .collection("users")
    .doc(userId)
    .get();

  if (!userSnapshot.exists) {
    return null;
  }

  const role = userSnapshot.data()?.role;

  if (role !== "author" && role !== "editor" && role !== "admin") {
    return null;
  }

  return role;
}

function canManageAllMedia(role: UserRole | null) {
  return role === "editor" || role === "admin";
}

export async function registerMedia(input: RegisterMediaInput) {
  const id = createMediaDocumentId(input.uploadthingKey);

  const mediaRef = firebaseAdminDb.collection("media").doc(id);

  const existing = await mediaRef.get();

  if (existing.exists) {
    const existingData = existing.data();

    if (!existingData) {
      throw new Error("Media asset data is missing.");
    }

    if (existingData.uploadedBy !== input.uploadedBy) {
      throw new Error("This media asset belongs to another user.");
    }

    return {
      id,
      ...input,
      usageCount:
        typeof existingData.usageCount === "number"
          ? existingData.usageCount
          : 0,
      status:
        typeof existingData.status === "string"
          ? existingData.status
          : "active",
      isPublic:
        typeof existingData.isPublic === "boolean"
          ? existingData.isPublic
          : false,
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
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id,
    ...input,
    usageCount: 0,
    status: "active",
    isPublic: false,
  };
}

export async function setMediaPublic(input: SetMediaPublicInput) {
  const role = await getUserRole(input.userId);

  if (!role) {
    throw new Error("You do not have permission to manage media.");
  }

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

    const isOwner = media.uploadedBy === input.userId;
    const canManageAll = canManageAllMedia(role);

    if (!isOwner && !canManageAll) {
      throw new Error("You are not allowed to change this media asset.");
    }

    if (media.status !== "active") {
      throw new Error("Only active media assets can change visibility.");
    }

    transaction.update(mediaRef, {
      isPublic: input.isPublic,
      updatedAt: new Date(),
    });
  });
}

export async function deleteMedia(input: DeleteMediaInput) {
  const role = await getUserRole(input.userId);

  if (!role) {
    throw new Error("You do not have permission to manage media.");
  }

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

    const isOwner = media.uploadedBy === input.userId;
    const canManageAll = canManageAllMedia(role);

    if (!isOwner && !canManageAll) {
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
      isPublic: false,
      updatedAt: new Date(),
    });
  });

  const { deleteUnusedMedia } = await import("./media-storage");

  await deleteUnusedMedia(input.mediaId);
}
