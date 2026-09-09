import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "./firestore";

import type { Post, PostStatus } from "../../types/post";

interface CreatePostInput {
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

const postsCollection = collection(db, "posts");

export async function createPost(postId: string, input: CreatePostInput) {
  const postRef = doc(postsCollection, postId);

  await setDoc(postRef, {
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
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: input.publishedAt,
  });

  return postId;
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

export async function updatePost(postId: string, input: UpdatePostInput) {
  const postRef = doc(postsCollection, postId);

  await updateDoc(postRef, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(postId: string) {
  const postRef = doc(postsCollection, postId);

  await deleteDoc(postRef);
}

export async function getAllPosts() {
  const allPostsQuery = query(postsCollection, orderBy("updatedAt", "desc"));

  const snapshot = await getDocs(allPostsQuery);

  return snapshot.docs.map(
    (postSnapshot) =>
      ({
        id: postSnapshot.id,
        ...postSnapshot.data(),
      }) as Post,
  );
}
