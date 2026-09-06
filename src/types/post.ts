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
  featuredImage: string | null;
  autherId: string;
  categoryId: string | null;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;
}
