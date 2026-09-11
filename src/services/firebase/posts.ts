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
import type { Post, PostStatus } from "../../types/post";

export interface CreatePostInput {
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

export interface UpdatePostInput {
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

const postsCollection = collection(db, "posts");

async function getAuthenticatedToken() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in.");
  }

  return user.getIdToken();
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      body &&
      typeof body === "object" &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : "The request could not be completed.";

    throw new Error(message);
  }

  return body as T;
}

export async function createPost(input: CreatePostInput) {
  const token = await getAuthenticatedToken();

  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
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
      publishedAt: input.publishedAt ? input.publishedAt.toISOString() : null,
    }),
  });

  const body = await parseApiResponse<{
    postId: string;
  }>(response);

  return body.postId;
}

export async function getPost(postId: string) {
  const postRef = doc(postsCollection, postId);

  const snapshot = await getDoc(postRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Post;
}

export async function getPublishedPosts() {
  const publishedPostsQuery = query(
    postsCollection,
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
  );

  const snapshot = await getDocs(publishedPostsQuery);

  return snapshot.docs.map(
    (postSnapshot) =>
      ({
        id: postSnapshot.id,
        ...postSnapshot.data(),
      }) as Post,
  );
}

export async function getAllPosts(authorId: string) {
  const allPostsQuery = query(
    postsCollection,
    where("authorId", "==", authorId),
    orderBy("updatedAt", "desc"),
  );

  const snapshot = await getDocs(allPostsQuery);

  return snapshot.docs.map(
    (postSnapshot) =>
      ({
        id: postSnapshot.id,
        ...postSnapshot.data(),
      }) as Post,
  );
}

export async function updatePost(postId: string, input: UpdatePostInput) {
  const token = await getAuthenticatedToken();

  const response = await fetch("/api/posts", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      postId,

      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      coverMediaId: input.coverMediaId,
      mediaIds: input.mediaIds,
      categoryId: input.categoryId,
      tags: input.tags,
      status: input.status,
      publishedAt:
        input.publishedAt === undefined
          ? undefined
          : input.publishedAt === null
            ? null
            : input.publishedAt.toISOString(),
    }),
  });

  await parseApiResponse<{
    success: true;
  }>(response);
}

export async function deletePost(postId: string) {
  const token = await getAuthenticatedToken();

  const response = await fetch("/api/posts", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      postId,
    }),
  });

  await parseApiResponse<{
    success: true;
  }>(response);
}
