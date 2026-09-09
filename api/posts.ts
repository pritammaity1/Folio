import { verifyFirebaseIdToken } from "../src/server/firebase-auth";
import { firebaseAdminDb } from "../src/server/firebase-firestore";
import { createPost, deletePost, updatePost } from "../src/server/post-service";
import type { PostStatus } from "../src/types/post";

type AuthenticatedUser = {
  uid: string;
  role: "admin" | "editor" | "author";
};

const validStatuses: PostStatus[] = [
  "draft",
  "review",
  "scheduled",
  "published",
  "archived",
];

async function authenticate(request: Request): Promise<AuthenticatedUser> {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = await verifyFirebaseIdToken(token);

  const userSnapshot = await firebaseAdminDb
    .collection("users")
    .doc(decoded.uid)
    .get();

  if (!userSnapshot.exists) {
    throw new Error("User profile not found.");
  }

  const role = userSnapshot.data()?.role;

  if (role !== "admin" && role !== "editor" && role !== "author") {
    throw new Error("Invalid user role.");
  }

  return {
    uid: decoded.uid,
    role,
  };
}

function isValidStatus(value: unknown): value is PostStatus {
  return (
    typeof value === "string" && validStatuses.includes(value as PostStatus)
  );
}

function canManageAnyPost(role: AuthenticatedUser["role"]) {
  return role === "admin" || role === "editor";
}

export default {
  async fetch(request: Request) {
    try {
      const user = await authenticate(request);

      if (request.method === "POST") {
        const body = await request.json();

        const {
          title,
          slug,
          excerpt,
          content,
          coverMediaId,
          mediaIds,
          categoryId,
          tags,
          status,
          publishedAt,
        } = body;

        if (
          typeof title !== "string" ||
          typeof slug !== "string" ||
          typeof excerpt !== "string" ||
          typeof content !== "string" ||
          !(coverMediaId === null || typeof coverMediaId === "string") ||
          !Array.isArray(mediaIds) ||
          !mediaIds.every((value: unknown) => typeof value === "string") ||
          !(categoryId === null || typeof categoryId === "string") ||
          !Array.isArray(tags) ||
          !tags.every((value: unknown) => typeof value === "string") ||
          !isValidStatus(status)
        ) {
          return Response.json(
            {
              error: "Invalid post data.",
            },
            { status: 400 },
          );
        }

        if (
          !canManageAnyPost(user.role) &&
          (status === "published" ||
            status === "scheduled" ||
            status === "archived" ||
            body.authorId !== user.uid)
        ) {
          return Response.json(
            {
              error: "You are not allowed to create this post.",
            },
            { status: 403 },
          );
        }

        if (user.role === "author" && body.authorId !== user.uid) {
          return Response.json(
            {
              error: "Authors can only create posts for themselves.",
            },
            { status: 403 },
          );
        }

        if (user.role === "author" && !["draft", "review"].includes(status)) {
          return Response.json(
            {
              error: "Authors can only create drafts or review posts.",
            },
            { status: 403 },
          );
        }

        const postId = await createPost({
          title,
          slug,
          excerpt,
          content,
          coverMediaId,
          mediaIds,
          authorId: user.uid,
          categoryId,
          tags,
          status,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        });

        return Response.json({ postId }, { status: 201 });
      }

      if (request.method === "PATCH") {
        const body = await request.json();

        const postId = typeof body.postId === "string" ? body.postId : null;

        if (!postId) {
          return Response.json(
            {
              error: "postId is required.",
            },
            { status: 400 },
          );
        }

        const existingPost = await firebaseAdminDb
          .collection("posts")
          .doc(postId)
          .get();

        if (!existingPost.exists) {
          return Response.json(
            {
              error: "Post not found.",
            },
            { status: 404 },
          );
        }

        const existing = existingPost.data();

        if (user.role === "author" && existing?.authorId !== user.uid) {
          return Response.json(
            {
              error: "You can only edit your own posts.",
            },
            { status: 403 },
          );
        }

        if (
          user.role === "author" &&
          !["draft", "review"].includes(existing?.status)
        ) {
          return Response.json(
            {
              error: "This post can no longer be edited by its author.",
            },
            { status: 403 },
          );
        }

        if (body.status !== undefined && !isValidStatus(body.status)) {
          return Response.json(
            {
              error: "Invalid post status.",
            },
            { status: 400 },
          );
        }

        if (
          user.role === "author" &&
          body.status !== undefined &&
          !["draft", "review"].includes(body.status)
        ) {
          return Response.json(
            {
              error: "Authors cannot publish or schedule posts.",
            },
            { status: 403 },
          );
        }

        await updatePost(postId, {
          title: typeof body.title === "string" ? body.title : undefined,
          slug: typeof body.slug === "string" ? body.slug : undefined,
          excerpt: typeof body.excerpt === "string" ? body.excerpt : undefined,
          content: typeof body.content === "string" ? body.content : undefined,
          coverMediaId:
            body.coverMediaId !== undefined ? body.coverMediaId : undefined,
          mediaIds: Array.isArray(body.mediaIds) ? body.mediaIds : undefined,
          categoryId:
            body.categoryId !== undefined ? body.categoryId : undefined,
          tags: Array.isArray(body.tags) ? body.tags : undefined,
          status: body.status !== undefined ? body.status : undefined,
          publishedAt:
            body.publishedAt !== undefined
              ? body.publishedAt
                ? new Date(body.publishedAt)
                : null
              : undefined,
        });

        return Response.json({
          success: true,
        });
      }

      if (request.method === "DELETE") {
        const body = await request.json();

        const postId = typeof body.postId === "string" ? body.postId : null;

        if (!postId) {
          return Response.json(
            {
              error: "postId is required.",
            },
            { status: 400 },
          );
        }

        const postSnapshot = await firebaseAdminDb
          .collection("posts")
          .doc(postId)
          .get();

        if (!postSnapshot.exists) {
          return Response.json(
            {
              error: "Post not found.",
            },
            { status: 404 },
          );
        }

        const post = postSnapshot.data();

        if (
          user.role === "author" &&
          (post?.authorId !== user.uid || post?.status !== "draft")
        ) {
          return Response.json(
            {
              error: "Authors can only delete their own drafts.",
            },
            { status: 403 },
          );
        }

        if (!canManageAnyPost(user.role)) {
          return Response.json(
            {
              error: "You are not allowed to delete this post.",
            },
            { status: 403 },
          );
        }

        await deletePost(postId);

        return Response.json({
          success: true,
        });
      }

      return Response.json(
        {
          error: "Method not allowed.",
        },
        { status: 405 },
      );
    } catch (error) {
      console.error("Post API error", error);

      return Response.json(
        {
          error:
            error instanceof Error ? error.message : "Internal server error.",
        },
        { status: 500 },
      );
    }
  },
};
