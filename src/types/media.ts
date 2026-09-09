import type { Timestamp } from "firebase/firestore";

export type MediaStatus = "active" | "deleting";

export interface MediaAsset {
  id: string;
  uploadthingKey: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  usageCount: number;
  status: MediaStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
