import { auth } from "../firebase/auth";

interface PostApiRequest {
  method: "POST" | "PATCH" | "DELETE";
  body: Record<string, unknown>;
}

async function callPostApi<T>({ method, body }: PostApiRequest): Promise<T> {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    throw new Error("You must be signed in.");
  }

  const idToken = await firebaseUser.getIdToken();

  const response = await fetch("/api/posts", {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof responseBody?.error === "string"
        ? responseBody.error
        : "Post request failed.",
    );
  }

  return responseBody as T;
}

export async function createPost(body: Record<string, unknown>) {
  return callPostApi<{
    postId: string;
  }>({
    method: "POST",
    body,
  });
}

export async function updatePost(body: Record<string, unknown>) {
  return callPostApi<{
    success: boolean;
  }>({
    method: "PATCH",
    body,
  });
}

export async function deletePost(postId: string) {
  return callPostApi<{
    success: boolean;
  }>({
    method: "DELETE",
    body: {
      postId,
    },
  });
}
