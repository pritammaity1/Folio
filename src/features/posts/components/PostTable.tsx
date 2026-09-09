import { useNavigate } from "react-router-dom";

import { Icon } from "../../../components/ui/Icon/Icon";
import PostStatusBadge from "./PostStatusBadge";
import type { Post } from "../../../types/post";

interface PostTableProps {
  posts: Post[];
  mediaUrls?: Record<string, string>;
}

function formatDate(value: Post["updatedAt"]) {
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

function PostTable({ posts, mediaUrls = {} }: PostTableProps) {
  const navigate = useNavigate();

  return (
    <section
      className={[
        "overflow-hidden rounded-[10px]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface)]",
        "shadow-[var(--shadow-xs)]",
      ].join(" ")}
    >
      <div className="hidden lg:block">
        <div className="grid grid-cols-[minmax(0,1.8fr)_150px_150px_44px] items-center border-b border-[var(--color-outline-variant)] px-5 py-3.5">
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
            Story
          </span>

          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
            Status
          </span>

          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
            Updated
          </span>

          <span className="sr-only">Actions</span>
        </div>

        <div className="divide-y divide-[var(--color-outline-variant)]">
          {posts.map((post) => {
            const coverImageUrl = post.coverMediaId
              ? mediaUrls[post.coverMediaId]
              : undefined;

            return (
              <article
                key={post.id}
                className="group grid cursor-pointer grid-cols-[minmax(0,1.8fr)_150px_150px_44px] items-center px-5 py-4 transition-[background-color] duration-[var(--motion-fast)] hover:bg-[var(--color-surface-container-low)]"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <div className="flex min-w-0 items-center gap-4 pr-6">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[6px] bg-[var(--color-surface-container-low)]">
                    {coverImageUrl ? (
                      <div
                        role="img"
                        aria-label={post.title}
                        style={{
                          backgroundImage: `url("${coverImageUrl}")`,
                        }}
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-[30px] italic text-[var(--color-outline)]">
                          F
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-display text-[18px] leading-6 tracking-[-0.015em] text-[var(--color-on-surface)] transition-colors duration-[var(--motion-fast)] group-hover:text-[var(--color-primary)]">
                      {post.title}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="font-body text-[10px] text-[var(--color-on-surface-variant)]">
                        {getReadingTime(post.content)} min read
                      </span>

                      {post.tags.length > 0 && (
                        <>
                          <span
                            className="h-1 w-1 rounded-full bg-[var(--color-outline)]"
                            aria-hidden="true"
                          />

                          <span className="truncate font-body text-[10px] text-[var(--color-on-surface-variant)]">
                            #{post.tags[0]}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <PostStatusBadge status={post.status} />
                </div>

                <div>
                  <p className="font-body text-[11px] text-[var(--color-on-surface)]">
                    {formatDate(post.updatedAt)}
                  </p>

                  <p className="mt-0.5 font-body text-[10px] text-[var(--color-on-surface-variant)]">
                    Last updated
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={`Open ${post.title}`}
                  title="Open story"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/posts/${post.id}`);
                  }}
                  className={[
                    "flex h-8 w-8 items-center justify-center",
                    "rounded-full",
                    "text-[var(--color-on-surface-variant)]",
                    "transition-[background-color,color,transform]",
                    "duration-[var(--motion-fast)]",
                    "hover:-translate-y-px",
                    "hover:bg-[var(--color-surface)]",
                    "hover:text-[var(--color-primary)]",
                    "focus-visible:outline-2",
                    "focus-visible:outline-[var(--color-primary)]",
                    "focus-visible:outline-offset-2",
                  ].join(" ")}
                >
                  <Icon name="arrow-up-right" size={14} strokeWidth={1.8} />
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <div className="lg:hidden">
        <div className="divide-y divide-[var(--color-outline-variant)]">
          {posts.map((post) => {
            const coverImageUrl = post.coverMediaId
              ? mediaUrls[post.coverMediaId]
              : undefined;

            return (
              <article
                key={post.id}
                className="group cursor-pointer p-4 transition-[background-color] duration-[var(--motion-fast)] hover:bg-[var(--color-surface-container-low)]"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <div className="flex gap-4">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[6px] bg-[var(--color-surface-container-low)]">
                    {coverImageUrl ? (
                      <div
                        role="img"
                        aria-label={post.title}
                        style={{
                          backgroundImage: `url("${coverImageUrl}")`,
                        }}
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-[30px] italic text-[var(--color-outline)]">
                          F
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-2 font-display text-[18px] leading-6 tracking-[-0.015em] text-[var(--color-on-surface)]">
                        {post.title}
                      </h3>

                      <Icon
                        name="arrow-up-right"
                        size={14}
                        strokeWidth={1.8}
                        className="mt-1 shrink-0 text-[var(--color-outline)] transition-colors duration-[var(--motion-fast)] group-hover:text-[var(--color-primary)]"
                      />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <PostStatusBadge status={post.status} />

                      <span className="font-body text-[10px] text-[var(--color-on-surface-variant)]">
                        {formatDate(post.updatedAt)}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-1 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                      {post.excerpt || "No excerpt added yet."}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {posts.length === 0 && (
        <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
            <Icon name="file-text" size={21} strokeWidth={1.6} />
          </div>

          <h3 className="mt-4 font-display text-[22px] tracking-[-0.02em] text-[var(--color-on-surface)]">
            No stories here yet.
          </h3>

          <p className="mt-2 max-w-sm font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
            Published and saved stories will appear here as your publication
            grows.
          </p>
        </div>
      )}
    </section>
  );
}

export default PostTable;
