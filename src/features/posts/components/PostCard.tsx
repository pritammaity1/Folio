import { useNavigate } from "react-router-dom";

import { Icon } from "../../../components/ui/Icon/Icon";
import PostStatusBadge from "./PostStatusBadge";
import type { Post } from "../../../types/post";

interface PostCardProps {
  post: Post;
  coverImageUrl?: string | null;
}

function formatDate(value: Post["createdAt"]) {
  if (!value) {
    return "Recently";
  }

  return value.toDate().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getReadingTime(content: string) {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = plainText ? plainText.split(" ").length : 0;

  return Math.max(1, Math.ceil(wordCount / 200));
}

function PostCard({ post, coverImageUrl = null }: PostCardProps) {
  const navigate = useNavigate();

  function handleOpen() {
    navigate(`/posts/${post.id}`);
  }

  function handleEdit(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    navigate(`/posts/${post.id}/edit`);
  }

  return (
    <article
      onClick={handleOpen}
      className={[
        "group cursor-pointer",
        "overflow-hidden rounded-[10px]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface)]",
        "shadow-[var(--shadow-xs)]",
        "transition-[transform,box-shadow,border-color]",
        "duration-[var(--motion-normal)]",
        "ease-[var(--ease-standard)]",
        "hover:-translate-y-0.5",
        "hover:border-[var(--color-outline)]",
        "hover:shadow-[var(--shadow-sm)]",
      ].join(" ")}
    >
      <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="relative min-h-[190px] overflow-hidden bg-[var(--color-surface-container-low)] md:min-h-[220px]">
          {coverImageUrl ? (
            <div
              role="img"
              aria-label={post.title}
              style={{
                backgroundImage: `url("${coverImageUrl}")`,
              }}
              className={[
                "absolute inset-0",
                "bg-cover bg-center bg-no-repeat",
                "transition-transform duration-500 ease-out",
                "group-hover:scale-[1.025]",
              ].join(" ")}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="font-display text-[72px] font-semibold italic leading-none text-[var(--color-outline)]/45">
                  F
                </span>

                <p className="mt-2 font-body text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                  Folio
                </p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,28,32,0.16)] to-transparent opacity-0 transition-opacity duration-[var(--motion-normal)] group-hover:opacity-100" />
        </div>

        <div className="flex min-w-0 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <PostStatusBadge status={post.status} />

                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--color-surface-container-low)] px-2.5 py-1 font-body text-[9px] font-medium text-[var(--color-on-surface-variant)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                aria-label={`Edit ${post.title}`}
                title="Edit post"
                onClick={handleEdit}
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center",
                  "rounded-full",
                  "text-[var(--color-on-surface-variant)]",
                  "transition-[background-color,color,transform]",
                  "duration-[var(--motion-fast)]",
                  "hover:-translate-y-px",
                  "hover:bg-[var(--color-surface-container-low)]",
                  "hover:text-[var(--color-primary)]",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[var(--color-primary)]",
                  "focus-visible:outline-offset-2",
                ].join(" ")}
              >
                <Icon name="pencil" size={14} strokeWidth={1.8} />
              </button>
            </div>

            <h2
              className={[
                "mt-4",
                "font-display text-[27px] leading-[1.08]",
                "tracking-[-0.025em]",
                "text-[var(--color-on-surface)]",
                "transition-colors duration-[var(--motion-fast)]",
                "group-hover:text-[var(--color-primary)]",
              ].join(" ")}
            >
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="mt-3 line-clamp-2 max-w-2xl font-body text-[13px] leading-6 text-[var(--color-on-surface-variant)]">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-outline-variant)] pt-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-body text-[10px] text-[var(--color-on-surface-variant)]">
                {formatDate(post.updatedAt)}
              </span>

              <span className="h-1 w-1 rounded-full bg-[var(--color-outline)]" />

              <span className="font-body text-[10px] text-[var(--color-on-surface-variant)]">
                {getReadingTime(post.content)} min read
              </span>

              {post.tags.length > 2 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[var(--color-outline)]" />

                  <span className="font-body text-[10px] text-[var(--color-on-surface-variant)]">
                    +{post.tags.length - 2} tags
                  </span>
                </>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 font-body text-[10px] font-semibold text-[var(--color-on-surface-variant)] transition-[color,transform] duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]">
              <span>Open story</span>

              <Icon name="arrow-right" size={13} strokeWidth={1.9} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
