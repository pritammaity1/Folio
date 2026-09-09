import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Icon } from "../../../components/ui/Icon/Icon";
import PostStatusBadge from "../../../features/posts/components/PostStatusBadge";
import { getMediaById } from "../../../services/firebase/media";
import { getPost } from "../../../services/firebase/posts";
import type { Post } from "../../../types/post";

function formatDate(value: Post["updatedAt"]) {
  if (!value) {
    return "Recently";
  }

  return value.toDate().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getReadingTime(content: string) {
  const plainText = content.replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;

  return Math.max(1, Math.ceil(wordCount / 200));
}

function PostPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

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

        if (!active) {
          return;
        }

        if (!nextPost) {
          setPost(null);
          setNotFound(true);
          return;
        }

        setPost(nextPost);

        if (nextPost.coverMediaId) {
          try {
            const media = await getMediaById(nextPost.coverMediaId);

            if (active && media && media.status === "active" && media.url) {
              setCoverImageUrl(media.url);
            }
          } catch (mediaError) {
            console.error("Failed to load post cover image.", mediaError);
          }
        }
      } catch (loadError) {
        console.error("Failed to load post.", loadError);

        if (active) {
          setError("We couldn't load this story right now. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPost();

    return () => {
      active = false;
    };
  }, [id]);

  const readingTime = useMemo(
    () => (post ? getReadingTime(post.content) : 1),
    [post],
  );

  if (loading) {
    return (
      <main className="min-w-0 flex-1 bg-[var(--color-background)]">
        <div className="mx-auto w-full max-w-[var(--canvas-width)] px-5 py-7 sm:px-7 lg:px-9 lg:py-9">
          <div className="mx-auto max-w-[920px]">
            <div className="h-8 w-28 animate-pulse rounded-full bg-[var(--color-surface-container-low)]" />

            <div className="mt-8 h-14 w-4/5 animate-pulse rounded-md bg-[var(--color-surface-container-low)]" />

            <div className="mt-4 h-5 w-3/5 animate-pulse rounded-md bg-[var(--color-surface-container-low)]" />

            <div className="mt-8 aspect-[16/7.2] w-full animate-pulse rounded-[9px] bg-[var(--color-surface-container-low)]" />

            <div className="mx-auto mt-10 max-w-[760px] space-y-3">
              <div className="h-4 w-full animate-pulse rounded-full bg-[var(--color-surface-container-low)]" />
              <div className="h-4 w-11/12 animate-pulse rounded-full bg-[var(--color-surface-container-low)]" />
              <div className="h-4 w-4/5 animate-pulse rounded-full bg-[var(--color-surface-container-low)]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-w-0 flex-1 bg-[var(--color-background)]">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-[var(--canvas-width)] items-center justify-center px-5 py-12 sm:px-7 lg:px-9">
          <section className="w-full max-w-lg rounded-[10px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-6 py-14 text-center shadow-[var(--shadow-xs)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
              <Icon name="triangle-alert" size={20} strokeWidth={1.7} />
            </div>

            <p className="mt-4 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
              Unable to load
            </p>

            <h1 className="mt-2 font-display text-[28px] tracking-[-0.025em] text-[var(--color-on-surface)]">
              This story could not be loaded.
            </h1>

            <p className="mt-3 font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => navigate("/posts")}
              className={[
                "mt-6 inline-flex h-10 items-center justify-center gap-2",
                "rounded-[7px]",
                "border border-[var(--color-outline-variant)]",
                "bg-[var(--color-surface)] px-4",
                "font-body text-[11px] font-semibold",
                "text-[var(--color-on-surface)]",
                "transition-[background-color,border-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:border-[var(--color-primary)]",
                "hover:text-[var(--color-primary)]",
              ].join(" ")}
            >
              <Icon name="arrow-left" size={14} strokeWidth={1.9} />
              <span>Back to Posts</span>
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="min-w-0 flex-1 bg-[var(--color-background)]">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-[var(--canvas-width)] items-center justify-center px-5 py-12 sm:px-7 lg:px-9">
          <section className="w-full max-w-lg rounded-[10px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-6 py-14 text-center shadow-[var(--shadow-xs)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
              <Icon name="file-text" size={21} strokeWidth={1.6} />
            </div>

            <p className="mt-4 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
              Story not found
            </p>

            <h1 className="mt-2 font-display text-[28px] tracking-[-0.025em] text-[var(--color-on-surface)]">
              We couldn't find this story.
            </h1>

            <p className="mt-3 font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
              The story may have been deleted or the link may no longer be
              valid.
            </p>

            <button
              type="button"
              onClick={() => navigate("/posts")}
              className={[
                "mt-6 inline-flex h-10 items-center justify-center gap-2",
                "rounded-[7px]",
                "bg-[var(--color-primary)] px-4",
                "font-body text-[11px] font-semibold",
                "text-[var(--color-on-primary)]",
                "transition-[background-color,transform]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-primary-container)]",
                "active:translate-y-px",
              ].join(" ")}
            >
              <Icon name="arrow-left" size={14} strokeWidth={1.9} />
              <span>Back to Posts</span>
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 flex-1 bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-[var(--canvas-width)] px-5 py-7 sm:px-7 lg:px-9 lg:py-9">
        <div className="mx-auto max-w-[1040px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/posts")}
              className={[
                "inline-flex h-9 items-center gap-2",
                "rounded-[6px]",
                "border border-[var(--color-outline-variant)]",
                "bg-[var(--color-surface)] px-3",
                "font-body text-[10px] font-semibold",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,border-color,color,transform]",
                "duration-[var(--motion-fast)]",
                "hover:border-[var(--color-outline)]",
                "hover:bg-[var(--color-surface-container-low)]",
                "hover:text-[var(--color-on-surface)]",
                "active:translate-x-[-1px]",
              ].join(" ")}
            >
              <Icon name="arrow-left" size={14} strokeWidth={1.9} />
              <span>Back to Posts</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                to={`/posts/${post.id}/edit`}
                className={[
                  "inline-flex h-9 items-center gap-2",
                  "rounded-[6px]",
                  "border border-[var(--color-outline-variant)]",
                  "bg-[var(--color-surface)] px-3",
                  "font-body text-[10px] font-semibold",
                  "text-[var(--color-on-surface)]",
                  "transition-[background-color,border-color,color]",
                  "duration-[var(--motion-fast)]",
                  "hover:border-[var(--color-primary)]",
                  "hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                <Icon name="file-text" size={13} strokeWidth={1.8} />
                <span>Edit Story</span>
              </Link>
            </div>
          </div>

          <article className="mt-7 overflow-hidden rounded-[10px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)]">
            {coverImageUrl ? (
              <div
                role="img"
                aria-label={post.title}
                style={{
                  backgroundImage: `url("${coverImageUrl}")`,
                }}
                className="aspect-[16/7.2] w-full bg-cover bg-center bg-no-repeat"
              />
            ) : (
              <div className="flex aspect-[16/5.5] w-full items-center justify-center bg-[var(--color-surface-container-low)]">
                <span className="font-display text-[72px] italic tracking-[-0.05em] text-[var(--color-outline)]">
                  F
                </span>
              </div>
            )}

            <div className="px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <div className="flex flex-wrap items-center gap-3">
                <PostStatusBadge status={post.status} />

                <span className="h-1 w-1 rounded-full bg-[var(--color-outline)]" />

                <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                  Updated {formatDate(post.updatedAt)}
                </span>
              </div>

              <h1 className="mt-6 max-w-[920px] font-display text-[clamp(42px,6vw,72px)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--color-on-surface)]">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-6 max-w-[800px] font-display text-[19px] italic leading-[1.6] text-[var(--color-on-surface-variant)] sm:text-[21px]">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[var(--color-outline-variant)] py-4">
                <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                  {readingTime} min read
                </span>

                {post.publishedAt && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[var(--color-outline)]" />

                    <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                      Published{" "}
                      {post.publishedAt.toDate().toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </>
                )}

                {post.slug && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[var(--color-outline)]" />

                    <span className="font-body text-[10px] text-[var(--color-on-surface-variant)]">
                      /{post.slug}
                    </span>
                  </>
                )}
              </div>

              {post.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-2.5 py-1 font-body text-[10px] font-medium text-[var(--color-on-surface-variant)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mx-auto mt-10 max-w-[760px] border-t border-[var(--color-outline-variant)] pt-9 sm:mt-12 sm:pt-11">
                <div className="whitespace-pre-wrap font-display text-[18px] leading-[1.85] text-[var(--color-on-surface)] sm:text-[19px]">
                  {post.content || "This story has no content yet."}
                </div>
              </div>

              <div className="mx-auto mt-12 flex max-w-[760px] items-center justify-between border-t border-[var(--color-outline-variant)] pt-6">
                <Link
                  to="/posts"
                  className="inline-flex items-center gap-2 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-primary)]"
                >
                  <Icon name="arrow-left" size={13} strokeWidth={1.9} />
                  <span>All Stories</span>
                </Link>

                <Link
                  to={`/posts/${post.id}/edit`}
                  className="inline-flex items-center gap-2 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-primary)] transition-[color,transform] duration-[var(--motion-fast)] hover:translate-x-0.5 hover:text-[var(--color-primary-container)]"
                >
                  <span>Edit Story</span>
                  <Icon name="arrow-right" size={13} strokeWidth={1.9} />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

export default PostPreview;
