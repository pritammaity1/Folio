import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Icon } from "../../../components/ui/Icon/Icon";
import { getMediaById } from "../../../services/firebase/media";
import { getAllPosts } from "../../../services/firebase/posts";
import type { Post } from "../../../types/post";

import PostFilter, {
  type PostSortOption,
  type PostStatusFilter,
} from "../../../features/posts/components/PostFilter";
import PostTable from "../../../features/posts/components/PostTable";

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<PostStatusFilter>("all");
  const [sortBy, setSortBy] = useState<PostSortOption>("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      try {
        setLoading(true);
        setError(null);

        const allPosts = await getAllPosts();

        if (!active) {
          return;
        }

        setPosts(allPosts);

        const mediaEntries = await Promise.all(
          allPosts.map(async (post) => {
            if (!post.coverMediaId) {
              return null;
            }

            try {
              const media = await getMediaById(post.coverMediaId);

              if (!media || media.status !== "active") {
                return null;
              }

              return {
                id: post.coverMediaId,
                url: media.url,
              };
            } catch (mediaError) {
              console.error(
                `Failed to load media for post ${post.id}.`,
                mediaError,
              );

              return null;
            }
          }),
        );

        if (!active) {
          return;
        }

        const nextMediaUrls: Record<string, string> = {};

        mediaEntries.forEach((entry) => {
          if (entry) {
            nextMediaUrls[entry.id] = entry.url;
          }
        });

        setMediaUrls(nextMediaUrls);
      } catch (loadError) {
        console.error("Failed to load posts.", loadError);

        if (active) {
          setError(
            "We couldn't load your stories right now. Please try again.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPosts();

    return () => {
      active = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const nextPosts = posts.filter((post) => {
      const matchesStatus = status === "all" || post.status === status;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        post.title,
        post.excerpt,
        post.slug,
        post.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });

    return [...nextPosts].sort((first, second) => {
      if (sortBy === "title") {
        return first.title.localeCompare(second.title);
      }

      const firstTime = first.updatedAt?.toMillis() ?? 0;
      const secondTime = second.updatedAt?.toMillis() ?? 0;

      return sortBy === "newest"
        ? secondTime - firstTime
        : firstTime - secondTime;
    });
  }, [posts, searchQuery, status, sortBy]);

  const publishedCount = posts.filter(
    (post) => post.status === "published",
  ).length;

  const draftCount = posts.filter((post) => post.status === "draft").length;

  const reviewCount = posts.filter((post) => post.status === "review").length;

  const hasFilters =
    searchQuery.trim().length > 0 || status !== "all" || sortBy !== "newest";

  function clearFilters() {
    setSearchQuery("");
    setStatus("all");
    setSortBy("newest");
  }

  return (
    <main className="min-w-0 flex-1 overflow-x-hidden bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-[var(--canvas-width)] px-5 py-7 sm:px-7 lg:px-9 lg:py-9">
        <section className="border-b border-[var(--color-outline-variant)] pb-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0 max-w-2xl">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                Publication Library
              </p>

              <h1 className="mt-3 font-display text-[42px] leading-[1.04] tracking-[-0.035em] text-[var(--color-on-surface)] sm:text-[50px]">
                Your stories.
              </h1>

              <p className="mt-4 max-w-xl font-body text-[14px] leading-6 text-[var(--color-on-surface-variant)] sm:text-[15px]">
                Write, refine, and manage everything your publication has
                created.
              </p>
            </div>

            <Link
              to="/posts/new"
              className={[
                "inline-flex h-11 shrink-0 items-center justify-center gap-2",
                "rounded-[7px]",
                "bg-[#9A4111]",
                "px-4.5",
                "font-body text-[12px] font-semibold !text-white",
                "shadow-[0_2px_6px_rgba(154,65,17,0.14)]",
                "transition-[background-color,box-shadow,transform]",
                "duration-[var(--motion-fast)]",
                "ease-out",
                "hover:bg-[#8A3A0F]",
                "hover:shadow-[0_5px_14px_rgba(154,65,17,0.2)]",
                "active:translate-y-px",
                "focus-visible:outline-2",
                "focus-visible:outline-[#9A4111]",
                "focus-visible:outline-offset-2",
              ].join(" ")}
            >
              <Icon name="plus" size={16} strokeWidth={2} />

              <span>New Post</span>
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-[22px] leading-none text-[var(--color-on-surface)]">
                {posts.length}
              </span>

              <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                Total
              </span>
            </div>

            <span className="h-4 w-px bg-[var(--color-outline-variant)]" />

            <div className="flex items-center gap-2">
              <span className="font-display text-[22px] leading-none text-[var(--color-on-surface)]">
                {publishedCount}
              </span>

              <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                Published
              </span>
            </div>

            <span className="h-4 w-px bg-[var(--color-outline-variant)]" />

            <div className="flex items-center gap-2">
              <span className="font-display text-[22px] leading-none text-[var(--color-on-surface)]">
                {draftCount}
              </span>

              <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                Drafts
              </span>
            </div>

            {reviewCount > 0 && (
              <>
                <span className="h-4 w-px bg-[var(--color-outline-variant)]" />

                <div className="flex items-center gap-2">
                  <span className="font-display text-[22px] leading-none text-[var(--color-primary)]">
                    {reviewCount}
                  </span>

                  <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                    Review
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="mt-7">
          <PostFilter
            searchQuery={searchQuery}
            status={status}
            sortBy={sortBy}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatus}
            onSortChange={setSortBy}
            onClear={clearFilters}
          />
        </section>

        {loading ? (
          <section className="mt-5 overflow-hidden rounded-[10px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)]">
            <div className="divide-y divide-[var(--color-outline-variant)]">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-16 w-24 shrink-0 animate-pulse rounded-[6px] bg-[var(--color-surface-container-low)]" />

                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-2/5 animate-pulse rounded-full bg-[var(--color-surface-container-low)]" />

                    <div className="mt-3 h-3 w-1/4 animate-pulse rounded-full bg-[var(--color-surface-container-low)]" />
                  </div>

                  <div className="hidden h-6 w-20 animate-pulse rounded-full bg-[var(--color-surface-container-low)] sm:block" />
                </div>
              ))}
            </div>
          </section>
        ) : error ? (
          <section className="mt-5 rounded-[10px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-6 py-16 text-center shadow-[var(--shadow-xs)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
              <Icon name="triangle-alert" size={20} strokeWidth={1.7} />
            </div>

            <p className="mt-4 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
              Unable to load
            </p>

            <h2 className="mt-2 font-display text-[26px] tracking-[-0.02em] text-[var(--color-on-surface)]">
              Your stories are temporarily unavailable.
            </h2>

            <p className="mx-auto mt-3 max-w-md font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
              {error}
            </p>
          </section>
        ) : filteredPosts.length === 0 ? (
          <section className="mt-5 rounded-[10px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-6 py-16 text-center shadow-[var(--shadow-xs)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
              <Icon name="file-text" size={21} strokeWidth={1.6} />
            </div>

            <p className="mt-4 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
              {hasFilters ? "No matches" : "Start writing"}
            </p>

            <h2 className="mt-2 font-display text-[28px] tracking-[-0.025em] text-[var(--color-on-surface)]">
              {hasFilters
                ? "Nothing matches your filters."
                : "Your publication starts here."}
            </h2>

            <p className="mx-auto mt-3 max-w-md font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
              {hasFilters
                ? "Try another search or clear the filters to see your full library."
                : "Create your first story and it will appear in your publication library."}
            </p>

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className={[
                  "mt-5 inline-flex h-10 items-center justify-center gap-2",
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
                <Icon name="rotate-ccw" size={13} strokeWidth={1.9} />
                <span>Clear filters</span>
              </button>
            ) : (
              <Link
                to="/posts/new"
                className={[
                  "mt-5 inline-flex h-10 items-center justify-center gap-2",
                  "rounded-[7px]",
                  "bg-[#9A4111] px-4",
                  "font-body text-[11px] font-semibold !text-white",
                  "transition-[background-color,transform]",
                  "duration-[var(--motion-fast)]",
                  "hover:bg-[#8A3A0F]",
                  "active:translate-y-px",
                ].join(" ")}
              >
                <Icon name="plus" size={14} strokeWidth={2} />
                <span>Create your first post</span>
              </Link>
            )}
          </section>
        ) : (
          <section className="mt-5">
            <div className="mb-3 flex items-center justify-between gap-4 px-1">
              <p className="font-body text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1 ? "story" : "stories"} shown
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-body text-[10px] font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Reset view
                </button>
              )}
            </div>

            <PostTable posts={filteredPosts} mediaUrls={mediaUrls} />
          </section>
        )}
      </div>
    </main>
  );
}

export default Posts;
