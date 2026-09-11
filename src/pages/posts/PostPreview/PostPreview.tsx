import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Icon } from "../../../components/ui/Icon/Icon";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import PostStatusBadge from "../../../features/posts/components/PostStatusBadge";
import { getMediaById } from "../../../services/firebase/media";
import { deletePost, getPost } from "../../../services/firebase/posts";
import type { Post } from "../../../types/post";

function formatDate(value: unknown) {
  if (!value) {
    return "—";
  }

  try {
    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (
      typeof value === "object" &&
      value !== null &&
      "toDate" in value &&
      typeof (
        value as {
          toDate?: unknown;
        }
      ).toDate === "function"
    ) {
      date = (
        value as {
          toDate: () => Date;
        }
      ).toDate();
    } else {
      date = new Date(value as string | number);
    }

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "—";
  }
}

function getReadingTime(content: string) {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return 1;
  }

  const wordCount = plainText.split(" ").length;

  return Math.max(1, Math.ceil(wordCount / 200));
}

function PostPreview() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();
  const { user } = useAuth();

  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  const [post, setPost] = useState<Post | null>(null);

  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [notFound, setNotFound] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        const nextPost = await getPost(id);

        if (cancelled) {
          return;
        }

        if (!nextPost) {
          setPost(null);
          setNotFound(true);
          setLoading(false);
          return;
        }

        setPost(nextPost);
        setCoverImageUrl(null);

        if (nextPost.coverMediaId) {
          try {
            const media = await getMediaById(nextPost.coverMediaId);

            if (!cancelled && media && media.status === "active" && media.url) {
              setCoverImageUrl(media.url);
            }
          } catch (mediaError) {
            console.error("Failed to load post cover image.", mediaError);

            if (!cancelled) {
              setCoverImageUrl(null);
            }
          }
        }

        setLoading(false);
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load post:", loadError);

        setPost(null);
        setError("Unable to load this story.");
        setLoading(false);
      }
    }

    void loadPost();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null;

      if (
        actionMenuRef.current &&
        target &&
        !actionMenuRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const readingTime = useMemo(() => {
    if (!post) {
      return 1;
    }

    return getReadingTime(post.content ?? "");
  }, [post]);

  const canEdit = Boolean(user && post && post.authorId === user.uid);

  const canDelete = canEdit;

  function openDeleteDialog() {
    if (!canDelete) {
      toast.error("Only the owner of this story can delete it.");

      return;
    }

    setMenuOpen(false);
    setDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);
  }

  async function handleDelete() {
    if (!post || !user) {
      return;
    }

    if (post.authorId !== user.uid) {
      toast.error("Only the owner of this story can delete it.");

      setDeleteDialogOpen(false);
      return;
    }

    try {
      setDeleting(true);

      await deletePost(post.id);

      toast.success("Story deleted successfully.");

      setDeleteDialogOpen(false);

      navigate("/posts", {
        replace: true,
      });
    } catch (deleteError) {
      console.error("Failed to delete post:", deleteError);

      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete the story.";

      toast.error(message);

      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 animate-pulse rounded bg-black/10" />

            <div className="h-10 w-28 animate-pulse rounded-xl bg-black/10" />
          </div>

          <div className="mt-14 max-w-4xl sm:mt-16">
            <div className="h-4 w-28 animate-pulse rounded bg-black/10" />

            <div className="mt-5 h-16 w-4/5 animate-pulse rounded-xl bg-black/10" />

            <div className="mt-5 h-5 w-3/5 animate-pulse rounded bg-black/10" />

            <div className="mt-5 h-4 w-32 animate-pulse rounded bg-black/10" />
          </div>

          <div className="mt-10 aspect-[16/6.7] animate-pulse rounded-[26px] bg-black/10" />

          <div className="mx-auto mt-12 max-w-[720px] space-y-4">
            <div className="h-5 w-full animate-pulse rounded bg-black/10" />
            <div className="h-5 w-full animate-pulse rounded bg-black/10" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-black/10" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 text-sm font-medium text-black/55 transition-colors hover:text-black"
          >
            <Icon name="arrow-left" size={16} />
            Back to Posts
          </Link>

          <div className="mx-auto mt-20 max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Icon name="triangle-alert" size={19} />
            </div>

            <h1 className="mt-5 text-xl font-semibold tracking-tight text-black">
              Unable to load story
            </h1>

            <p className="mt-2 text-sm leading-6 text-black/60">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 text-sm font-medium text-black/55 transition-colors hover:text-black"
          >
            <Icon name="arrow-left" size={16} />
            Back to Posts
          </Link>

          <div className="mx-auto mt-20 max-w-lg rounded-2xl border border-black/10 bg-white p-9 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              Story not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-black/55">
              This story may have been removed or is no longer available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen">
        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/posts"
              className="inline-flex items-center gap-2 text-sm font-medium text-black/55 transition-colors hover:text-black"
            >
              <Icon name="arrow-left" size={16} />
              Back to Posts
            </Link>

            {canEdit && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/posts/${post.id}/edit`}
                  className="!bg-white inline-flex h-10 items-center gap-2 rounded-xl border border-black/10 px-4 text-sm font-semibold text-black shadow-[0_3px_12px_rgba(0,0,0,0.05)] transition-[background-color,border-color,box-shadow] hover:border-black/15 hover:bg-black/[0.02] hover:shadow-[0_5px_16px_rgba(0,0,0,0.07)]"
                >
                  <Icon name="file-text" size={16} />
                  <span>Edit Story</span>
                </Link>

                {canDelete && (
                  <div ref={actionMenuRef} className="relative">
                    <button
                      type="button"
                      aria-label="Story actions"
                      aria-haspopup="menu"
                      aria-expanded={menuOpen}
                      onClick={() => setMenuOpen((current) => !current)}
                      className="!bg-white inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-black/65 shadow-[0_3px_12px_rgba(0,0,0,0.05)] transition-[background-color,border-color,box-shadow,color] hover:border-black/15 hover:bg-black/[0.02] hover:text-black hover:shadow-[0_5px_16px_rgba(0,0,0,0.07)]"
                    >
                      <span
                        aria-hidden="true"
                        className="text-sm leading-none tracking-[0.17em]"
                      >
                        •••
                      </span>
                    </button>

                    {menuOpen && (
                      <div
                        role="menu"
                        className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-black/10 bg-white p-1 shadow-[0_16px_42px_rgba(0,0,0,0.12)]"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          onClick={openDeleteDialog}
                          className="!bg-transparent !text-red-600 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:!bg-red-50"
                        >
                          <Icon name="trash" size={16} strokeWidth={2} />
                          Delete Story
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <header className="mt-14 max-w-[920px] sm:mt-16">
            <div className="flex flex-wrap items-center gap-3">
              <PostStatusBadge status={post.status} />

              <span className="text-sm text-black/40">
                {formatDate(post.publishedAt ?? post.createdAt)}
              </span>
            </div>

            <h1 className="mt-5 max-w-4xl font-serif text-[46px] font-semibold leading-[0.99] tracking-[-0.045em] text-black sm:text-6xl lg:text-[72px]">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-6 max-w-3xl text-[18px] leading-8 text-black/58 sm:text-[19px]">
                {post.excerpt}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-black/40">
              <span>{readingTime} min read</span>

              {post.tags && post.tags.length > 0 && (
                <>
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 rounded-full bg-black/18"
                  />

                  <span className="truncate">
                    {post.tags.map((tag) => `#${tag}`).join("  ")}
                  </span>
                </>
              )}
            </div>
          </header>

          <section aria-label="Story cover" className="mt-10 sm:mt-12">
            {coverImageUrl ? (
              <figure className="overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-[0_14px_46px_rgba(0,0,0,0.06)]">
                <img
                  src={coverImageUrl}
                  alt={post.title}
                  className="block aspect-[16/6.7] w-full object-cover"
                />
              </figure>
            ) : (
              <div className="relative flex aspect-[16/6.7] items-center justify-center overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-[0_14px_46px_rgba(0,0,0,0.05)]">
                <div aria-hidden="true" className="absolute inset-0">
                  <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.035]" />
                  <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.035]" />
                </div>

                <div className="relative text-center">
                  <div className="font-serif text-[92px] font-semibold leading-none tracking-[-0.08em] text-black/[0.055] sm:text-[108px]">
                    F
                  </div>

                  <div className="-mt-1 text-[9px] font-semibold uppercase tracking-[0.32em] text-black/20">
                    Folio
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="mx-auto mt-14 max-w-[720px] sm:mt-16">
            <div className="mb-9 h-px w-12 bg-black/12" />

            <div
              className="prose prose-neutral max-w-none text-[17px] leading-[1.85] text-black/78 prose-headings:mt-12 prose-headings:font-serif prose-headings:tracking-[-0.02em] prose-headings:text-black prose-p:my-6 prose-p:leading-[1.85] prose-a:text-black prose-a:underline prose-strong:text-black prose-blockquote:border-l-black/20 prose-blockquote:text-black/60 prose-img:my-10 prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{
                __html: post.content ?? "",
              }}
            />
          </section>

          <footer className="mx-auto mt-16 max-w-[720px] border-t border-black/10 pb-10 pt-7">
            <Link
              to="/posts"
              className="inline-flex items-center gap-2 text-sm font-semibold text-black/55 transition-colors hover:text-black"
            >
              <Icon name="arrow-left" size={16} />
              All Stories
            </Link>
          </footer>
        </div>
      </main>

      {deleteDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-story-title"
            aria-describedby="delete-story-description"
            className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-[0_28px_80px_rgba(0,0,0,0.20)] sm:p-7"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Icon name="x" size={19} strokeWidth={2} />
            </div>

            <h2
              id="delete-story-title"
              className="mt-5 text-xl font-semibold tracking-tight text-black"
            >
              Delete this story?
            </h2>

            <p
              id="delete-story-description"
              className="mt-3 text-sm leading-6 text-black/58"
            >
              This will permanently delete the story and clean up any unused
              media associated with it. This action cannot be undone.
            </p>

            <div className="mt-7 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={closeDeleteDialog}
                className="!bg-white rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="!bg-red-600 inline-flex min-w-[122px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold !text-white transition-colors hover:!bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Story"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PostPreview;
