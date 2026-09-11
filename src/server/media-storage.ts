import { utapi } from "./uploadthing-api.js";
import { firebaseAdminDb } from "./firebase-firestore.js";

export async function deleteUnusedMedia(mediaId: string) {
  const mediaRef = firebaseAdminDb.collection("media").doc(mediaId);

  const mediaSnapshot = await mediaRef.get();

  if (!mediaSnapshot.exists) {
    return;
  }

  const media = mediaSnapshot.data();

  if (!media) {
    return;
  }

  if (media.status !== "deleting") {
    return;
  }

  if (media.usageCount !== 0) {
    return;
  }

  await utapi.deleteFiles(media.uploadthingKey);

  await mediaRef.delete();
}
