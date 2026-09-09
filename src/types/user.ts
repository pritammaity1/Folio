import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "editor" | "author";

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string | null;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
