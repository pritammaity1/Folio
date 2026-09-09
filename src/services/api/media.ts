import { auth } from "../firebase/auth";

interface RegisterMediaInput {
  uploadthingKey: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export async function registerMedia(input: RegisterMediaInput) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const token = await user.getIdToken();

  const response = await fetch("/api/media", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "Failed to register media.",
    );
  }

  return body as {
    mediaId: string;
  };
}

export async function deleteMedia(mediaId: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const token = await user.getIdToken();

  const response = await fetch("/api/media", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mediaId,
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "Failed to delete media.",
    );
  }

  return body as {
    success: true;
  };
}
