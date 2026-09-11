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

function isValidStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isValidNullableString(value: unknown) {
  return value === null || typeof value === "string";
}

function parseDate(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string" && !(value instanceof Date)) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
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
          !isValidNullableString(coverMediaId) ||
          !isValidStringArray(mediaIds) ||
          !isValidNullableString(categoryId) ||
          !isValidStringArray(tags) ||
          !isValidStatus(status)
        ) {
          return Response.json(
            {
              error: "Invalid post data.",
            },
            { status: 400 },
          );
        }

        const requestedAuthorId =
          typeof body.authorId === "string" ? body.authorId : user.uid;

        if (user.role === "author" && requestedAuthorId !== user.uid) {
          return Response.json(
            {
              error: "Authors can only create posts for themselves.",
            },
            { status: 403 },
          );
        }

        if (
          user.role === "author" &&
          !["draft", "review", "published"].includes(status)
        ) {
          return Response.json(
            {
              error:
                "Authors can only create draft, review, or published posts.",
            },
            { status: 403 },
          );
        }

        if (status === "published" && !content.replace(/<[^>]*>/g, "").trim()) {
          return Response.json(
            {
              error: "Published posts must contain content.",
            },
            { status: 400 },
          );
        }

        const parsedPublishedAt =
          publishedAt === undefined || publishedAt === null
            ? null
            : parseDate(publishedAt);

        if (
          publishedAt !== undefined &&
          publishedAt !== null &&
          !parsedPublishedAt
        ) {
          return Response.json(
            {
              error: "Invalid publishedAt value.",
            },
            { status: 400 },
          );
        }

        const postId = await createPost({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content,
          coverMediaId,
          mediaIds,
          authorId: canManageAnyPost(user.role) ? requestedAuthorId : user.uid,
          categoryId,
          tags,
          status,
          publishedAt:
            status === "published" ? (parsedPublishedAt ?? new Date()) : null,
        });

        return Response.json({ postId }, { status: 201 });
      }

      if (request.method === "PATCH") {
        const body = await request.json();

        const postId =
          typeof body.postId === "string" ? body.postId.trim() : "";

        if (!postId) {
          return Response.json(
            {
              error: "postId is required.",
            },
            { status: 400 },
          );
        }

        const postRef = firebaseAdminDb.collection("posts").doc(postId);

        const existingPost = await postRef.get();

        if (!existingPost.exists) {
          return Response.json(
            {
              error: "Post not found.",
            },
            { status: 404 },
          );
        }

        const existing = existingPost.data();

        if (!existing) {
          return Response.json(
            {
              error: "Post data is missing.",
            },
            { status: 500 },
          );
        }

        if (!canManageAnyPost(user.role) && existing.authorId !== user.uid) {
          return Response.json(
            {
              error: "You can only edit your own posts.",
            },
            { status: 403 },
          );
        }

        if (
          body.authorId !== undefined &&
          (typeof body.authorId !== "string" ||
            body.authorId !== existing.authorId)
        ) {
          return Response.json(
            {
              error: "Changing the post author is not allowed.",
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

        const nextStatus =
          body.status !== undefined ? body.status : existing.status;

        if (
          user.role === "author" &&
          !["draft", "review", "published"].includes(nextStatus)
        ) {
          return Response.json(
            {
              error: "Authors cannot use this post status.",
            },
            { status: 403 },
          );
        }

        if (nextStatus === "published") {
          const nextContent =
            typeof body.content === "string"
              ? body.content
              : typeof existing.content === "string"
                ? existing.content
                : "";

          if (!nextContent.replace(/<[^>]*>/g, "").trim()) {
            return Response.json(
              {
                error: "Published posts must contain content.",
              },
              { status: 400 },
            );
          }
        }

        if (
          body.coverMediaId !== undefined &&
          !isValidNullableString(body.coverMediaId)
        ) {
          return Response.json(
            {
              error: "Invalid coverMediaId.",
            },
            { status: 400 },
          );
        }

        if (body.mediaIds !== undefined && !isValidStringArray(body.mediaIds)) {
          return Response.json(
            {
              error: "Invalid mediaIds.",
            },
            { status: 400 },
          );
        }

        if (
          body.categoryId !== undefined &&
          !isValidNullableString(body.categoryId)
        ) {
          return Response.json(
            {
              error: "Invalid categoryId.",
            },
            { status: 400 },
          );
        }

        if (body.tags !== undefined && !isValidStringArray(body.tags)) {
          return Response.json(
            {
              error: "Invalid tags.",
            },
            { status: 400 },
          );
        }

        let nextPublishedAt: Date | null | undefined;

        if (body.publishedAt !== undefined) {
          if (body.publishedAt === null) {
            nextPublishedAt = null;
          } else {
            nextPublishedAt = parseDate(body.publishedAt);

            if (!nextPublishedAt) {
              return Response.json(
                {
                  error: "Invalid publishedAt value.",
                },
                { status: 400 },
              );
            }
          }
        }

        if (nextStatus === "published" && body.publishedAt === undefined) {
          nextPublishedAt = existing.publishedAt?.toDate?.() ?? new Date();
        }

        if (nextStatus !== "published" && body.status !== undefined) {
          nextPublishedAt = null;
        }

        await updatePost(postId, {
          title: typeof body.title === "string" ? body.title.trim() : undefined,

          slug: typeof body.slug === "string" ? body.slug.trim() : undefined,

          excerpt:
            typeof body.excerpt === "string" ? body.excerpt.trim() : undefined,

          content: typeof body.content === "string" ? body.content : undefined,

          coverMediaId:
            body.coverMediaId !== undefined ? body.coverMediaId : undefined,

          mediaIds: body.mediaIds !== undefined ? body.mediaIds : undefined,

          categoryId:
            body.categoryId !== undefined ? body.categoryId : undefined,

          tags: body.tags !== undefined ? body.tags : undefined,

          status: body.status !== undefined ? body.status : undefined,

          publishedAt:
            body.publishedAt !== undefined || nextStatus === "published"
              ? (nextPublishedAt ?? null)
              : undefined,
        });

        return Response.json({
          success: true,
        });
      }

      if (request.method === "DELETE") {
        const body = await request.json();

        const postId =
          typeof body.postId === "string" ? body.postId.trim() : "";

        if (!postId) {
          return Response.json(
            {
              error: "postId is required.",
            },
            { status: 400 },
          );
        }

        const postRef = firebaseAdminDb.collection("posts").doc(postId);

        const postSnapshot = await postRef.get();

        if (!postSnapshot.exists) {
          return Response.json(
            {
              error: "Post not found.",
            },
            { status: 404 },
          );
        }

        const post = postSnapshot.data();

        if (!post) {
          return Response.json(
            {
              error: "Post data is missing.",
            },
            { status: 500 },
          );
        }

        if (post.authorId !== user.uid) {
          return Response.json(
            {
              error: "Only the owner of this story can delete it.",
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

      const message =
        error instanceof Error ? error.message : "Internal server error.";

      let status = 500;

      if (message === "Unauthorized") {
        status = 401;
      } else if (message.includes("not found")) {
        status = 404;
      } else if (
        message.includes("not allowed") ||
        message.includes("permission")
      ) {
        status = 403;
      }

      return Response.json(
        {
          error: message,
        },
        { status },
      );
    }
  },
};
