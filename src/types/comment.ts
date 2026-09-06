import type { Timestamp } from "firebase/firestore";

export type CommentStatus = "pending" | "approved" | "rejected";

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  status: CommentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
