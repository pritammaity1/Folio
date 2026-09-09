import type { Timestamp } from "firebase/firestore";

export type PostStatus =
  | "draft"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

export interface Post {
  id: string;
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;
}
