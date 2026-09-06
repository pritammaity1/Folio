import type { Timestamp } from "firebase/firestore";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
