export type UserRole = "admin" | "editor" | "author";

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string | null;
  createdAt: import("firebase/firestore").Timestamp;
  updatedAt: import("firebase/firestore").Timestamp;
}
