import { verifyFirebaseIdToken } from "../src/server/firebase-auth";
import { deleteMedia, registerMedia } from "../src/server/media-service";

async function authenticate(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    throw new Error("Unauthorized");
  }

  return verifyFirebaseIdToken(token);
}

export default {
  async fetch(request: Request) {
    try {
      const user = await authenticate(request);

      if (request.method === "POST") {
        const body = await request.json();

        if (
          typeof body.uploadthingKey !== "string" ||
          typeof body.url !== "string" ||
          typeof body.fileName !== "string" ||
          typeof body.mimeType !== "string" ||
          typeof body.size !== "number"
        ) {
          return Response.json(
            { error: "Invalid media data." },
            { status: 400 },
          );
        }

        const media = await registerMedia({
          uploadthingKey: body.uploadthingKey,
          url: body.url,
          fileName: body.fileName,
          mimeType: body.mimeType,
          size: body.size,
          uploadedBy: user.uid,
        });

        return Response.json({
          mediaId: media.id,
        });
      }

      if (request.method === "DELETE") {
        const body = await request.json();

        if (typeof body.mediaId !== "string" || !body.mediaId.trim()) {
          return Response.json(
            { error: "A media ID is required." },
            { status: 400 },
          );
        }

        await deleteMedia({
          mediaId: body.mediaId,
          userId: user.uid,
        });

        return Response.json({
          success: true,
        });
      }

      return Response.json({ error: "Method not allowed." }, { status: 405 });
    } catch (error) {
      console.error("Media API error", error);

      const message =
        error instanceof Error ? error.message : "Internal server error.";

      const status =
        message === "Unauthorized"
          ? 401
          : message.includes("not allowed") ||
              message.includes("still being used")
            ? 403
            : message.includes("not found")
              ? 404
              : 500;

      return Response.json({ error: message }, { status });
    }
  },
};
