import { doc, getDoc } from "firebase/firestore";

import { db } from "./firestore";

export interface PublicAuthor {
  id: string;
  name: string;
}

const publicAuthorsCollectionName = "publicAuthors";

export async function getUserName(userId: string) {
  if (!userId) {
    return null;
  }

  const authorRef = doc(db, publicAuthorsCollectionName, userId);
  const snapshot = await getDoc(authorRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  if (typeof data.name !== "string" || !data.name.trim()) {
    return null;
  }

  return data.name.trim();
}
