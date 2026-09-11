import { createUploadthing, type FileRouter } from "uploadthing/server";

import { verifyFirebaseIdToken } from "./firebase-auth.js";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f(
    {
      image: {
        maxFileSize: "8MB",
        maxFileCount: 1,
      },
    },
    {
      awaitServerData: false,
    },
  )
    .middleware(async ({ req }) => {
      const authorization = req.headers.get("authorization");

      if (!authorization?.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
      }

      const idToken = authorization.slice("Bearer ".length).trim();

      if (!idToken) {
        throw new Error("Unauthorized");
      }

      const user = await verifyFirebaseIdToken(idToken);

      return {
        userId: user.uid,
        email: user.email ?? null,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.info("Folio UploadThing upload completed", {
        userId: metadata.userId,
        fileKey: file.key,
        fileName: file.name,
      });
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
