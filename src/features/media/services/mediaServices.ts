import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../../../services/firebase/firestore";
import type { MediaAsset } from "../../../types/media";

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const mediaQuery = query(
    collection(db, "media"),
    where("status", "==", "active"),
  );

  const snapshot = await getDocs(mediaQuery);

  return snapshot.docs
    .map(
      (document) =>
        ({
          id: document.id,
          ...document.data(),
        }) as MediaAsset,
    )
    .sort(
      (first, second) =>
        second.createdAt.toMillis() - first.createdAt.toMillis(),
    );
}

export async function getMediaById(
  mediaId: string,
): Promise<MediaAsset | null> {
  const mediaQuery = query(
    collection(db, "media"),
    where("__name__", "==", mediaId),
  );

  const snapshot = await getDocs(mediaQuery);

  const document = snapshot.docs[0];

  if (!document) {
    return null;
  }

  return {
    id: document.id,
    ...document.data(),
  } as MediaAsset;
}
