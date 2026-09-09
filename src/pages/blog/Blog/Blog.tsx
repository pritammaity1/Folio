import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Timestamp } from "firebase/firestore";

import { Icon } from "../../../components/ui/Icon/Icon";
import { getPublishedPosts } from "../../../services/firebase/posts";
import type { Post } from "../../../types/post";

function formatPublishedDate(value: Timestamp | null) {
  if (!value) {
    return "Recently published";
  }

  return value.toDate().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
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

function BlogSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[var(--canvas-width)] px-5 pb-16 pt-12 sm:px-8 lg:px-10 lg:pb-24 lg:pt-16">
      <div className="h-3 w-24 animate-pulse rounded-full bg-[var(--color-surface-container-low)]" />

      <div className="mt-4 h-12 w-full max-w-2xl animate-pulse rounded-[8px] bg-[var(--color-surface-container-low)]" />

      <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded-[8px] bg-[var(--color-surface-container-low)]" />

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.8fr)]">
        <div className="h-[430px] animate-pulse rounded-[12px] bg-[var(--color-surface-container-low)]" />

        <div className="space-y-4">
          <div className="h-[130px] animate-pulse rounded-[10px] bg-[var(--color-surface-container-low)]" />
          <div className="h-[130px] animate-pulse rounded-[10px] bg-[var(--color-surface-container-low)]" />
          <div className="h-[130px] animate-pulse rounded-[10px] bg-[var(--color-surface-container-low)]" />
        </div>
      </div>
    </div>
  );
}

function Blog() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      try {
        setLoading(true);
        setError(null);

        const publishedPosts = await getPublishedPosts();

        if (active) {
          setPosts(publishedPosts);
        }
      } catch (loadError) {
        console.error("Failed to load published posts.", loadError);

        if (active) {
          setError("We couldn't load the stories right now. Please try again.");
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
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return posts;
    }

    return posts.filter((post) => {
      const searchableText = [post.title, post.excerpt, post.tags.join(" ")]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [posts, search]);

  const featuredPost = filteredPosts[0] ?? null;
  const latestPosts = filteredPosts.slice(1);

  if (loading) {
    return (
      <div className="min-h-dvh bg-[var(--color-background)] text-[var(--color-on-surface)]">
        <main>
          <BlogSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main>
        <section className="border-b border-[var(--color-outline-variant)]">
          <div className="mx-auto w-full max-w-[var(--canvas-width)] px-5 pb-10 pt-12 sm:px-8 lg:px-10 lg:pb-14 lg:pt-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                  Folio Journal
                </p>

                <h1 className="mt-3 font-display text-[44px] leading-[1.04] tracking-[-0.035em] text-[var(--color-on-surface)] sm:text-[54px] lg:text-[64px]">
                  Stories worth sitting with.
                </h1>

                <p className="mt-5 max-w-2xl font-body text-[16px] leading-7 text-[var(--color-on-surface-variant)] sm:text-[18px] sm:leading-8">
                  Notes, ideas, and perspectives published by the Folio
                  community.
                </p>
              </div>

              <label className="flex h-11 w-full max-w-sm items-center rounded-[7px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3.5 shadow-[var(--shadow-xs)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_3px_rgba(154,65,17,0.06)]">
                <Icon
                  name="search"
                  size={16}
                  strokeWidth={1.8}
                  className="shrink-0 text-[var(--color-on-surface-variant)]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search stories"
                  aria-label="Search stories"
                  className="ml-2.5 min-w-0 flex-1 border-0 bg-transparent font-body text-[12px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)]"
                />
              </label>
            </div>
          </div>
        </section>

        {error ? (
          <section className="mx-auto w-full max-w-[var(--canvas-width)] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-xl border-l-2 border-[var(--color-primary)] pl-5">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                Unable to load
              </p>

              <h2 className="mt-2 font-display text-[30px] leading-tight tracking-[-0.025em] text-[var(--color-on-surface)]">
                The journal is taking a moment.
              </h2>

              <p className="mt-3 font-body text-[14px] leading-6 text-[var(--color-on-surface-variant)]">
                {error}
              </p>
            </div>
          </section>
        ) : filteredPosts.length === 0 ? (
          <section className="mx-auto w-full max-w-[var(--canvas-width)] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
                <Icon name="book-open" size={20} strokeWidth={1.6} />
              </div>

              <p className="mt-5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                {posts.length === 0 ? "The journal is quiet" : "No matches"}
              </p>

              <h2 className="mt-2 font-display text-[30px] leading-tight tracking-[-0.025em] text-[var(--color-on-surface)]">
                {posts.length === 0
                  ? "Published stories will appear here."
                  : "Try another search."}
              </h2>

              <p className="mt-3 font-body text-[14px] leading-6 text-[var(--color-on-surface-variant)]">
                {posts.length === 0
                  ? "When a story is published from the editor, it will appear here automatically."
                  : "Search titles, excerpts, or tags to find another story."}
              </p>
            </div>
          </section>
        ) : (
          <>
            <section className="mx-auto w-full max-w-[var(--canvas-width)] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.8fr)]">
                {featuredPost && (
                  <article
                    className="group cursor-pointer overflow-hidden rounded-[12px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)] transition-[transform,box-shadow] duration-[var(--motion-normal)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
                    onClick={() => navigate(`/posts/${featuredPost.id}`)}
                  >
                    <div className="grid min-h-[430px] lg:grid-cols-[1.15fr_0.85fr]">
                      <div className="relative min-h-[280px] overflow-hidden bg-[var(--color-surface-container-low)]">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span className="font-display text-[96px] font-semibold italic leading-none text-[var(--color-outline)]/40">
                              F
                            </span>

                            <p className="mt-3 font-body text-[10px] uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
                              Folio Journal
                            </p>
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,28,32,0.12)] to-transparent opacity-0 transition-opacity duration-[var(--motion-normal)] group-hover:opacity-100" />
                      </div>

                      <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-9">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            {featuredPost.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-[rgba(154,65,17,0.08)] px-2.5 py-1 font-body text-[10px] font-semibold text-[var(--color-primary)]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <h2 className="mt-5 font-display text-[32px] leading-[1.08] tracking-[-0.03em] text-[var(--color-on-surface)] sm:text-[38px]">
                            {featuredPost.title}
                          </h2>

                          <p className="mt-4 font-body text-[14px] leading-6 text-[var(--color-on-surface-variant)] sm:text-[15px] sm:leading-7">
                            {featuredPost.excerpt}
                          </p>
                        </div>

                        <div className="mt-8 flex items-end justify-between gap-4 border-t border-[var(--color-outline-variant)] pt-5">
                          <div>
                            <p className="font-body text-[11px] font-medium text-[var(--color-on-surface)]">
                              Published story
                            </p>

                            <p className="mt-1 font-body text-[10px] text-[var(--color-on-surface-variant)]">
                              {formatPublishedDate(featuredPost.publishedAt)} ·{" "}
                              {getReadingTime(featuredPost.content)} min read
                            </p>
                          </div>

                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] transition-[background-color,border-color,transform] duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white">
                            <Icon
                              name="arrow-right"
                              size={16}
                              strokeWidth={1.8}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                <div className="flex flex-col rounded-[12px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)]">
                  <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] px-5 py-4 sm:px-6">
                    <div>
                      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                        Latest Stories
                      </p>

                      <h2 className="mt-1 font-display text-[22px] tracking-[-0.02em] text-[var(--color-on-surface)]">
                        From the journal
                      </h2>
                    </div>

                    <span className="font-body text-[10px] font-medium tabular-nums text-[var(--color-on-surface-variant)]">
                      {latestPosts.length}{" "}
                      {latestPosts.length === 1 ? "story" : "stories"}
                    </span>
                  </div>

                  <div className="flex-1 divide-y divide-[var(--color-outline-variant)]">
                    {latestPosts.length === 0 ? (
                      <div className="flex min-h-[280px] items-center justify-center px-6 text-center">
                        <p className="max-w-xs font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
                          This is the newest published story. More stories will
                          appear here as they are published.
                        </p>
                      </div>
                    ) : (
                      latestPosts.slice(0, 5).map((post, index) => (
                        <article
                          key={post.id}
                          className="group cursor-pointer px-5 py-5 transition-[background-color] duration-[var(--motion-fast)] hover:bg-[var(--color-surface-container-low)] sm:px-6"
                          onClick={() => navigate(`/posts/${post.id}`)}
                        >
                          <div className="flex gap-4">
                            <span className="pt-0.5 font-display text-[18px] text-[var(--color-outline)]">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <div className="min-w-0 flex-1">
                              <h3 className="font-display text-[20px] leading-6 tracking-[-0.018em] text-[var(--color-on-surface)] transition-colors duration-[var(--motion-fast)] group-hover:text-[var(--color-primary)]">
                                {post.title}
                              </h3>

                              <p className="mt-2 line-clamp-2 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                                {post.excerpt}
                              </p>

                              <p className="mt-3 font-body text-[10px] text-[var(--color-on-surface-variant)]">
                                {formatPublishedDate(post.publishedAt)} ·{" "}
                                {getReadingTime(post.content)} min read
                              </p>
                            </div>

                            <Icon
                              name="arrow-right"
                              size={15}
                              strokeWidth={1.7}
                              className="mt-1 shrink-0 text-[var(--color-outline)] transition-[color,transform] duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]"
                            />
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>

            {latestPosts.length > 5 && (
              <section className="border-t border-[var(--color-outline-variant)]">
                <div className="mx-auto w-full max-w-[var(--canvas-width)] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-on-surface-variant)]">
                        From the archive
                      </p>

                      <h2 className="mt-2 font-display text-[30px] tracking-[-0.025em] text-[var(--color-on-surface)]">
                        More stories
                      </h2>
                    </div>

                    <span className="hidden font-body text-[11px] text-[var(--color-on-surface-variant)] sm:block">
                      {latestPosts.length - 5} more published{" "}
                      {latestPosts.length - 5 === 1 ? "story" : "stories"}
                    </span>
                  </div>

                  <div className="mt-7 grid gap-x-8 md:grid-cols-2 lg:grid-cols-3">
                    {latestPosts.slice(5).map((post) => (
                      <article
                        key={post.id}
                        className="group cursor-pointer border-b border-[var(--color-outline-variant)] py-6"
                        onClick={() => navigate(`/posts/${post.id}`)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                              {formatPublishedDate(post.publishedAt)}
                            </p>

                            <h3 className="mt-2 font-display text-[22px] leading-7 tracking-[-0.02em] text-[var(--color-on-surface)] transition-colors duration-[var(--motion-fast)] group-hover:text-[var(--color-primary)]">
                              {post.title}
                            </h3>

                            <p className="mt-2 line-clamp-2 font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
                              {post.excerpt}
                            </p>
                          </div>

                          <Icon
                            name="arrow-right"
                            size={15}
                            className="mt-1 shrink-0 text-[var(--color-outline)] transition-colors duration-[var(--motion-fast)] group-hover:text-[var(--color-primary)]"
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Blog;
