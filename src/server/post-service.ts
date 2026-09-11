import {
  FieldValue,
  Timestamp,
  type Transaction,
} from "firebase-admin/firestore";

import { firebaseAdminDb } from "./firebase-firestore";
import { deleteUnusedMedia } from "./media-storage";
import {
  getAddedMediaIds,
  getRemovedMediaIds,
  getUniqueMediaIds,
} from "./media-reference";
import type { PostStatus } from "../types/post";

interface PostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverMediaId: string | null;
  mediaIds: string[];
  authorId: string;
  categoryId: string | null;
  tags: string[];
  status: PostStatus;
  publishedAt: Date | null;
}

interface UpdatePostInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverMediaId?: string | null;
  mediaIds?: string[];
  categoryId?: string | null;
  tags?: string[];
  status?: PostStatus;
  publishedAt?: Date | null;
}

interface MediaRecord {
  uploadthingKey: string;
  usageCount: number;
  publishedUsageCount: number;
  status: "active" | "deleting";
  isPublic: boolean;
}

function normalizeMediaIds(coverMediaId: string | null, mediaIds: string[]) {
  return getUniqueMediaIds(coverMediaId, mediaIds);
}

function isPublishedStatus(status: unknown) {
  return status === "published";
}

function toPublishedAt(value: Date | null | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return value === null ? null : Timestamp.fromDate(value);
}

async function updateCategoryPostCount(
  transaction: Transaction,
  categoryRef: FirebaseFirestore.DocumentReference,
  categorySnapshot: FirebaseFirestore.DocumentSnapshot,
  delta: number,
) {
  if (!categorySnapshot.exists) {
    throw new Error("Category not found.");
  }

  const data = categorySnapshot.data();

  const currentPostCount =
    typeof data?.postCount === "number" ? data.postCount : 0;

  const nextPostCount = currentPostCount + delta;

  if (nextPostCount < 0) {
    throw new Error("Category post count cannot become negative.");
  }

  transaction.update(categoryRef, {
    postCount: nextPostCount,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

async function updateMediaReferences(
  transaction: Transaction,
  previousMediaIds: string[],
  nextMediaIds: string[],
  previousPublished: boolean,
  nextPublished: boolean,
) {
  const addedMediaIds = getAddedMediaIds(previousMediaIds, nextMediaIds);

  const removedMediaIds = getRemovedMediaIds(previousMediaIds, nextMediaIds);

  const usageDeltas = new Map<string, number>();
  const publishedUsageDeltas = new Map<string, number>();

  for (const mediaId of addedMediaIds) {
    usageDeltas.set(mediaId, (usageDeltas.get(mediaId) ?? 0) + 1);
  }

  for (const mediaId of removedMediaIds) {
    usageDeltas.set(mediaId, (usageDeltas.get(mediaId) ?? 0) - 1);
  }

  if (!previousPublished && nextPublished) {
    for (const mediaId of nextMediaIds) {
      publishedUsageDeltas.set(
        mediaId,
        (publishedUsageDeltas.get(mediaId) ?? 0) + 1,
      );
    }
  }

  if (previousPublished && !nextPublished) {
    for (const mediaId of previousMediaIds) {
      publishedUsageDeltas.set(
        mediaId,
        (publishedUsageDeltas.get(mediaId) ?? 0) - 1,
      );
    }
  }

  if (previousPublished && nextPublished) {
    for (const mediaId of addedMediaIds) {
      publishedUsageDeltas.set(
        mediaId,
        (publishedUsageDeltas.get(mediaId) ?? 0) + 1,
      );
    }

    for (const mediaId of removedMediaIds) {
      publishedUsageDeltas.set(
        mediaId,
        (publishedUsageDeltas.get(mediaId) ?? 0) - 1,
      );
    }
  }

  const affectedIds = Array.from(
    new Set([...usageDeltas.keys(), ...publishedUsageDeltas.keys()]),
  );

  const mediaRefs = affectedIds.map((mediaId) =>
    firebaseAdminDb.collection("media").doc(mediaId),
  );

  const mediaSnapshots = [];

  for (const mediaRef of mediaRefs) {
    mediaSnapshots.push(await transaction.get(mediaRef));
  }

  const mediaById = new Map<
    string,
    {
      ref: FirebaseFirestore.DocumentReference;
      data: MediaRecord;
    }
  >();

  for (let index = 0; index < mediaSnapshots.length; index += 1) {
    const snapshot = mediaSnapshots[index];

    if (!snapshot.exists) {
      throw new Error(`Media asset ${affectedIds[index]} does not exist.`);
    }

    const data = snapshot.data();

    if (
      typeof data?.uploadthingKey !== "string" ||
      typeof data?.usageCount !== "number" ||
      (data.status !== "active" && data.status !== "deleting")
    ) {
      throw new Error(
        `Media asset ${affectedIds[index]} has invalid metadata.`,
      );
    }

    const publishedUsageCount =
      typeof data.publishedUsageCount === "number"
        ? data.publishedUsageCount
        : 0;

    const isPublic =
      typeof data.isPublic === "boolean"
        ? data.isPublic
        : publishedUsageCount > 0;

    mediaById.set(affectedIds[index], {
      ref: mediaRefs[index],
      data: {
        uploadthingKey: data.uploadthingKey,
        usageCount: data.usageCount,
        publishedUsageCount,
        status: data.status,
        isPublic,
      },
    });
  }

  const mediaIdsToDelete: string[] = [];

  for (const mediaId of addedMediaIds) {
    const media = mediaById.get(mediaId);

    if (!media) {
      throw new Error(`Media asset ${mediaId} could not be loaded.`);
    }

    if (media.data.status !== "active") {
      throw new Error(`Media asset ${mediaId} is not available.`);
    }
  }

  for (const mediaId of removedMediaIds) {
    const media = mediaById.get(mediaId);

    if (!media) {
      throw new Error(`Media asset ${mediaId} could not be loaded.`);
    }
  }

  for (const mediaId of affectedIds) {
    const media = mediaById.get(mediaId);

    if (!media) {
      throw new Error(`Media asset ${mediaId} could not be loaded.`);
    }

    const usageDelta = usageDeltas.get(mediaId) ?? 0;
    const publishedUsageDelta = publishedUsageDeltas.get(mediaId) ?? 0;

    const nextUsageCount = Math.max(media.data.usageCount + usageDelta, 0);

    const nextPublishedUsageCount = Math.max(
      media.data.publishedUsageCount + publishedUsageDelta,
      0,
    );

    const nextIsPublic = nextPublishedUsageCount > 0;

    transaction.update(media.ref, {
      usageCount: nextUsageCount,
      publishedUsageCount: nextPublishedUsageCount,
      isPublic: nextIsPublic,
      status: nextUsageCount === 0 ? "deleting" : "active",
      updatedAt: FieldValue.serverTimestamp(),
    });

    if (nextUsageCount === 0) {
      mediaIdsToDelete.push(mediaId);
    }
  }

  return mediaIdsToDelete;
}

async function cleanupUnusedMedia(mediaIds: string[]) {
  const results = await Promise.allSettled(
    mediaIds.map((mediaId) => deleteUnusedMedia(mediaId)),
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error("Failed to delete unused media", {
        mediaId: mediaIds[index],
        error: result.reason,
      });
    }
  });
}

export async function createPost(input: PostInput) {
  const normalizedMediaIds = normalizeMediaIds(
    input.coverMediaId,
    input.mediaIds,
  );

  const postRef = firebaseAdminDb.collection("posts").doc();

  await firebaseAdminDb.runTransaction(async (transaction) => {
    let categoryRef: FirebaseFirestore.DocumentReference | null = null;

    let categorySnapshot: FirebaseFirestore.DocumentSnapshot | null = null;

    if (input.categoryId) {
      categoryRef = firebaseAdminDb
        .collection("categories")
        .doc(input.categoryId);

      categorySnapshot = await transaction.get(categoryRef);

      if (!categorySnapshot.exists) {
        throw new Error("Selected category does not exist.");
      }
    }

    await updateMediaReferences(
      transaction,
      [],
      normalizedMediaIds,
      false,
      isPublishedStatus(input.status),
    );

    if (categoryRef && categorySnapshot) {
      await updateCategoryPostCount(
        transaction,
        categoryRef,
        categorySnapshot,
        1,
      );
    }

    transaction.set(postRef, {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      coverMediaId: input.coverMediaId,
      mediaIds: input.mediaIds,
      authorId: input.authorId,
      categoryId: input.categoryId,
      tags: input.tags,
      status: input.status,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      publishedAt: toPublishedAt(input.publishedAt) ?? null,
    });
  });

  return postRef.id;
}

export async function updatePost(postId: string, input: UpdatePostInput) {
  const postRef = firebaseAdminDb.collection("posts").doc(postId);

  let mediaIdsToDelete: string[] = [];

  await firebaseAdminDb.runTransaction(async (transaction) => {
    const postSnapshot = await transaction.get(postRef);

    if (!postSnapshot.exists) {
      throw new Error("Post not found.");
    }

    const existing = postSnapshot.data();

    const previousCoverMediaId =
      typeof existing?.coverMediaId === "string" ? existing.coverMediaId : null;

    const previousMediaIds = Array.isArray(existing?.mediaIds)
      ? existing.mediaIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];

    const previousCategoryId =
      typeof existing?.categoryId === "string" ? existing.categoryId : null;

    const previousStatus = existing?.status;

    const nextCoverMediaId =
      input.coverMediaId !== undefined
        ? input.coverMediaId
        : previousCoverMediaId;

    const nextMediaIds =
      input.mediaIds !== undefined ? input.mediaIds : previousMediaIds;

    const nextCategoryId =
      input.categoryId !== undefined ? input.categoryId : previousCategoryId;

    const nextStatus =
      input.status !== undefined ? input.status : previousStatus;

    const previousUniqueMediaIds = normalizeMediaIds(
      previousCoverMediaId,
      previousMediaIds,
    );

    const nextUniqueMediaIds = normalizeMediaIds(
      nextCoverMediaId,
      nextMediaIds,
    );

    mediaIdsToDelete = await updateMediaReferences(
      transaction,
      previousUniqueMediaIds,
      nextUniqueMediaIds,
      isPublishedStatus(previousStatus),
      isPublishedStatus(nextStatus),
    );

    let previousCategoryRef: FirebaseFirestore.DocumentReference | null = null;

    let previousCategorySnapshot: FirebaseFirestore.DocumentSnapshot | null =
      null;

    let nextCategoryRef: FirebaseFirestore.DocumentReference | null = null;

    let nextCategorySnapshot: FirebaseFirestore.DocumentSnapshot | null = null;

    if (previousCategoryId) {
      previousCategoryRef = firebaseAdminDb
        .collection("categories")
        .doc(previousCategoryId);

      previousCategorySnapshot = await transaction.get(previousCategoryRef);

      if (!previousCategorySnapshot.exists) {
        throw new Error("The post's current category no longer exists.");
      }
    }

    if (nextCategoryId && nextCategoryId !== previousCategoryId) {
      nextCategoryRef = firebaseAdminDb
        .collection("categories")
        .doc(nextCategoryId);

      nextCategorySnapshot = await transaction.get(nextCategoryRef);

      if (!nextCategorySnapshot.exists) {
        throw new Error("Selected category does not exist.");
      }
    }

    if (
      previousCategoryId &&
      nextCategoryId !== previousCategoryId &&
      previousCategoryRef &&
      previousCategorySnapshot
    ) {
      await updateCategoryPostCount(
        transaction,
        previousCategoryRef,
        previousCategorySnapshot,
        -1,
      );
    }

    if (
      nextCategoryId &&
      nextCategoryId !== previousCategoryId &&
      nextCategoryRef &&
      nextCategorySnapshot
    ) {
      await updateCategoryPostCount(
        transaction,
        nextCategoryRef,
        nextCategorySnapshot,
        1,
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (input.title !== undefined) {
      updateData.title = input.title;
    }

    if (input.slug !== undefined) {
      updateData.slug = input.slug;
    }

    if (input.excerpt !== undefined) {
      updateData.excerpt = input.excerpt;
    }

    if (input.content !== undefined) {
      updateData.content = input.content;
    }

    if (input.coverMediaId !== undefined) {
      updateData.coverMediaId = input.coverMediaId;
    }

    if (input.mediaIds !== undefined) {
      updateData.mediaIds = input.mediaIds;
    }

    if (input.categoryId !== undefined) {
      updateData.categoryId = input.categoryId;
    }

    if (input.tags !== undefined) {
      updateData.tags = input.tags;
    }

    if (input.status !== undefined) {
      updateData.status = input.status;
    }

    if (input.publishedAt !== undefined) {
      updateData.publishedAt = toPublishedAt(input.publishedAt);
    }

    transaction.update(postRef, updateData);
  });

  await cleanupUnusedMedia(mediaIdsToDelete);
}

export async function deletePost(postId: string) {
  let mediaIdsToDelete: string[] = [];

  await firebaseAdminDb.runTransaction(async (transaction) => {
    const postRef = firebaseAdminDb.collection("posts").doc(postId);

    const postSnapshot = await transaction.get(postRef);

    if (!postSnapshot.exists) {
      throw new Error("Post not found.");
    }

    const data = postSnapshot.data();

    const categoryId =
      typeof data?.categoryId === "string" ? data.categoryId : null;

    const coverMediaId =
      typeof data?.coverMediaId === "string" ? data.coverMediaId : null;

    const mediaIds = Array.isArray(data?.mediaIds)
      ? data.mediaIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];

    const postIsPublished = isPublishedStatus(data?.status);

    let categoryRef: FirebaseFirestore.DocumentReference | null = null;

    let categorySnapshot: FirebaseFirestore.DocumentSnapshot | null = null;

    if (categoryId) {
      categoryRef = firebaseAdminDb.collection("categories").doc(categoryId);

      categorySnapshot = await transaction.get(categoryRef);

      if (!categorySnapshot.exists) {
        throw new Error("The post's category no longer exists.");
      }
    }

    const referencedMediaIds = normalizeMediaIds(coverMediaId, mediaIds);

    mediaIdsToDelete = await updateMediaReferences(
      transaction,
      referencedMediaIds,
      [],
      postIsPublished,
      false,
    );

    if (categoryRef && categorySnapshot) {
      await updateCategoryPostCount(
        transaction,
        categoryRef,
        categorySnapshot,
        -1,
      );
    }

    transaction.delete(postRef);
  });

  await cleanupUnusedMedia(mediaIdsToDelete);
}
