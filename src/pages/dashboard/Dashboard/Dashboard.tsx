import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Icon } from "../../../components/ui/Icon/Icon";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import PostStatusBadge from "../../../features/posts/components/PostStatusBadge";
import { getAllPosts } from "../../../services/firebase/posts";
import type { Post } from "../../../types/post";

function getGreeting(hour: number) {
  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  if (hour < 21) {
    return "Good evening";
  }

  return "Good night";
}

function getUserName(user: {
  displayName?: string | null;
  email?: string | null;
}) {
  if (user.displayName?.trim()) {
    return user.displayName.trim();
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "Editor";
}

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

function getTimestampMillis(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "toMillis" in value &&
    typeof (
      value as {
        toMillis?: unknown;
      }
    ).toMillis === "function"
  ) {
    return (
      value as {
        toMillis: () => number;
      }
    ).toMillis();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (
      value as {
        toDate?: unknown;
      }
    ).toDate === "function"
  ) {
    return (
      value as {
        toDate: () => Date;
      }
    )
      .toDate()
      .getTime();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "string" || typeof value === "number") {
    const timestamp = new Date(value).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  return 0;
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <article
      className={[
        "rounded-[var(--radius-md)]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface)]",
        "p-5",
        "shadow-[var(--shadow-xs)]",
      ].join(" ")}
    >
      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
        {label}
      </p>

      <p className="mt-3 font-display text-[34px] leading-10 tracking-[-0.025em] text-[var(--color-on-surface)]">
        {value}
      </p>

      <p className="mt-2 font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
        {description}
      </p>
    </article>
  );
}

function EmptyStories() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
        <Icon name="posts" size={21} strokeWidth={1.7} />
      </div>

      <p className="mt-4 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
        Editorial workspace
      </p>

      <h3 className="mt-2 font-display text-[24px] tracking-[-0.02em] text-[var(--color-on-surface)]">
        Your publication starts here.
      </h3>

      <p className="mx-auto mt-2 max-w-md text-center font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
        Create your first story and it will appear here as your publication
        grows.
      </p>

      <Link
        to="/posts/new"
        className={[
          "mt-5 inline-flex h-10 items-center",
          "justify-center gap-2",
          "rounded-[7px]",
          "bg-[var(--color-primary)] px-4",
          "font-body text-[11px] font-semibold !text-white",
          "transition-[background-color,transform]",
          "duration-[var(--motion-fast)]",
          "hover:bg-[var(--color-primary-container)]",
          "active:translate-y-px",
        ].join(" ")}
      >
        <Icon name="plus" size={14} strokeWidth={2} />
        Create your first post
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const [currentTime, setCurrentTime] = useState(() => new Date());

  const [posts, setPosts] = useState<Post[]>([]);

  const [loadingPosts, setLoadingPosts] = useState(true);

  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      if (!user?.uid) {
        if (active) {
          setPosts([]);
          setPostsError(null);
          setLoadingPosts(false);
        }

        return;
      }

      try {
        setLoadingPosts(true);
        setPostsError(null);

        const nextPosts = await getAllPosts(user.uid);

        if (!active) {
          return;
        }

        setPosts(nextPosts);
      } catch (error) {
        console.error("Failed to load dashboard posts.", error);

        if (active) {
          setPostsError("We couldn't load your stories right now.");
          setPosts([]);
        }
      } finally {
        if (active) {
          setLoadingPosts(false);
        }
      }
    }

    void loadPosts();

    return () => {
      active = false;
    };
  }, [user?.uid]);

  const greeting = getGreeting(currentTime.getHours());

  const userName = user ? getUserName(user) : "Editor";

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const publishedCount = useMemo(
    () => posts.filter((post) => post.status === "published").length,
    [posts],
  );

  const draftCount = useMemo(
    () => posts.filter((post) => post.status === "draft").length,
    [posts],
  );

  const reviewCount = useMemo(
    () => posts.filter((post) => post.status === "review").length,
    [posts],
  );

  const recentPosts = useMemo(() => {
    return [...posts]
      .sort(
        (first, second) =>
          getTimestampMillis(second.updatedAt ?? second.createdAt) -
          getTimestampMillis(first.updatedAt ?? first.createdAt),
      )
      .slice(0, 6);
  }, [posts]);

  const attentionCount = draftCount + reviewCount;

  return (
    <main className="min-h-full">
      <div className="mx-auto w-full max-w-[var(--canvas-width)] px-[var(--content-padding)] py-7 lg:py-9">
        <header className="border-b border-[var(--color-outline-variant)] pb-8">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                Editorial workspace
              </p>

              <p className="mt-2 font-body text-[13px] text-[var(--color-on-surface-variant)]">
                {formattedDate}
              </p>

              <h1 className="mt-3 font-display text-[38px] leading-[1.08] tracking-[-0.035em] text-[var(--color-on-surface)] sm:text-[46px]">
                {greeting}, {userName}
              </h1>

              <p className="mt-3 max-w-2xl font-body text-[14px] leading-6 text-[var(--color-on-surface-variant)]">
                Your stories, drafts, and publication workspace at a glance.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                to="/media"
                className={[
                  "inline-flex h-10 items-center justify-center gap-2",
                  "rounded-[7px]",
                  "border border-[var(--color-outline-variant)]",
                  "bg-[var(--color-surface)] px-4",
                  "font-body text-[11px] font-semibold",
                  "text-[var(--color-on-surface)]",
                  "shadow-[var(--shadow-xs)]",
                  "transition-[background-color,border-color,box-shadow]",
                  "duration-[var(--motion-fast)]",
                  "hover:border-[var(--color-outline)]",
                  "hover:bg-[var(--color-surface-container-low)]",
                  "hover:shadow-[var(--shadow-sm)]",
                ].join(" ")}
              >
                <Icon name="upload" size={16} />
                Upload Media
              </Link>

              <Link
                to="/posts/new"
                className={[
                  "inline-flex h-10 items-center justify-center gap-2",
                  "rounded-[7px]",
                  "bg-[var(--color-primary)] px-4",
                  "font-body text-[11px] font-semibold",
                  "!text-[#fff7f0]",
                  "shadow-[var(--shadow-sm)]",
                  "transition-[background-color,box-shadow,transform]",
                  "duration-[var(--motion-fast)]",
                  "hover:bg-[var(--color-primary-container)]",
                  "hover:shadow-[var(--shadow-md)]",
                  "active:translate-y-px",
                ].join(" ")}
              >
                <Icon name="plus" size={16} className="text-[#fff7f0]" />
                Create Post
              </Link>
            </div>
          </div>
        </header>

        <section
          aria-label="Content overview"
          className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <MetricCard
            label="Total Stories"
            value={posts.length}
            description="Stories in your workspace"
          />

          <MetricCard
            label="Published"
            value={publishedCount}
            description="Live editorial stories"
          />

          <MetricCard
            label="Drafts"
            value={draftCount}
            description="Stories still in progress"
          />

          <MetricCard
            label="In Review"
            value={reviewCount}
            description="Stories waiting for review"
          />
        </section>

        <section className="mt-7 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)]">
          <div className="flex flex-col gap-3 border-b border-[var(--color-outline-variant)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                Publication Library
              </p>

              <h2 className="mt-1 font-display text-[24px] leading-7 tracking-[-0.02em] text-[var(--color-on-surface)]">
                Recent stories
              </h2>
            </div>

            <Link
              to="/posts"
              className="inline-flex items-center gap-1.5 self-start font-body text-[11px] font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-container)] sm:self-auto"
            >
              View all stories
              <Icon name="chevron-right" size={15} />
            </Link>
          </div>

          {postsError ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
                <Icon name="triangle-alert" size={19} strokeWidth={1.7} />
              </div>

              <p className="mt-4 font-body text-[13px] text-[var(--color-error)]">
                {postsError}
              </p>

              <Link
                to="/posts"
                className="mt-4 inline-flex items-center gap-1.5 font-body text-[11px] font-semibold text-[var(--color-primary)]"
              >
                Open Posts
                <Icon name="chevron-right" size={14} />
              </Link>
            </div>
          ) : loadingPosts ? (
            <div className="divide-y divide-[var(--color-outline-variant)]">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 px-5 py-5 sm:px-6"
                >
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-container-low)]" />

                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-[42%] animate-pulse rounded bg-[var(--color-surface-container-low)]" />

                    <div className="mt-2 h-3 w-[24%] animate-pulse rounded bg-[var(--color-surface-container-low)]" />
                  </div>

                  <div className="hidden h-6 w-20 animate-pulse rounded-full bg-[var(--color-surface-container-low)] sm:block" />
                </div>
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <EmptyStories />
          ) : (
            <div className="divide-y divide-[var(--color-outline-variant)]">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--color-surface-container-low)] sm:px-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-container-low)]">
                    <span className="font-display text-lg italic text-[var(--color-outline)]">
                      F
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-[13px] font-semibold text-[var(--color-on-surface)] sm:text-[14px]">
                      {post.title || "Untitled story"}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2">
                      <span className="font-body text-[11px] text-[var(--color-on-surface-variant)]">
                        Updated {formatDate(post.updatedAt ?? post.createdAt)}
                      </span>

                      {post.tags?.length > 0 && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-[var(--color-outline)]" />

                          <span className="max-w-[180px] truncate font-body text-[11px] text-[var(--color-on-surface-variant)]">
                            #{post.tags[0]}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="hidden shrink-0 sm:block">
                    <PostStatusBadge status={post.status} />
                  </div>

                  <Icon
                    name="chevron-right"
                    size={16}
                    className="shrink-0 text-[var(--color-outline)] transition-[color,transform] duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:text-[var(--color-on-surface-variant)]"
                  />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)]">
            <div className="border-b border-[var(--color-outline-variant)] px-5 py-5 sm:px-6">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                Writing desk
              </p>

              <h2 className="mt-1 font-display text-[23px] leading-7 tracking-[-0.02em] text-[var(--color-on-surface)]">
                Continue writing
              </h2>
            </div>

            <div className="px-5 py-6 sm:px-6">
              {attentionCount > 0 ? (
                <>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-container-low)] text-[var(--color-primary)]">
                      <Icon name="file-text" size={18} />
                    </div>

                    <div>
                      <p className="font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                        {attentionCount}{" "}
                        {attentionCount === 1 ? "story" : "stories"} need
                        attention
                      </p>

                      <p className="mt-1 font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
                        {draftCount > 0
                          ? `${draftCount} ${
                              draftCount === 1 ? "draft" : "drafts"
                            } in progress`
                          : "No drafts"}

                        {reviewCount > 0
                          ? ` · ${reviewCount} ${
                              reviewCount === 1 ? "story" : "stories"
                            } in review`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {draftCount > 0 && (
                      <Link
                        to="/posts?status=draft"
                        className="inline-flex items-center gap-2 rounded-[7px] bg-[var(--color-surface-container-low)] px-3.5 py-2.5 font-body text-[11px] font-semibold text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-high)]"
                      >
                        View drafts
                        <Icon name="chevron-right" size={14} />
                      </Link>
                    )}

                    {reviewCount > 0 && (
                      <Link
                        to="/posts?status=review"
                        className="inline-flex items-center gap-2 rounded-[7px] bg-[var(--color-primary)] px-3.5 py-2.5 font-body text-[11px] font-semibold text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-container)]"
                      >
                        Review queue
                        <Icon name="chevron-right" size={14} />
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-container-low)] text-[var(--color-success)]">
                      <Icon name="check-circle" size={18} />
                    </div>

                    <div>
                      <p className="font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                        Your writing desk is clear.
                      </p>

                      <p className="mt-1 font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
                        Start a new story whenever you're ready.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/posts/new"
                    className="mt-6 inline-flex items-center gap-2 rounded-[7px] bg-[var(--color-primary)] px-4 py-2.5 font-body text-[11px] font-semibold text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-container)]"
                  >
                    <Icon name="plus" size={14} />
                    Start a story
                  </Link>
                </>
              )}
            </div>
          </article>

          <article className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)]">
            <div className="border-b border-[var(--color-outline-variant)] px-5 py-5 sm:px-6">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                Workspace
              </p>

              <h2 className="mt-1 font-display text-[23px] leading-7 tracking-[-0.02em] text-[var(--color-on-surface)]">
                Editorial tools
              </h2>
            </div>

            <div className="grid grid-cols-2">
              <Link
                to="/posts/new"
                className="group border-b border-r border-[var(--color-outline-variant)] p-5 transition-colors hover:bg-[var(--color-surface-container-low)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-container-low)] text-[var(--color-primary)]">
                  <Icon name="new-post" size={17} />
                </div>

                <p className="mt-4 font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                  New Post
                </p>

                <p className="mt-1 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                  Start a new story
                </p>
              </Link>

              <Link
                to="/media"
                className="group border-b border-[var(--color-outline-variant)] p-5 transition-colors hover:bg-[var(--color-surface-container-low)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-container-low)] text-[var(--color-primary)]">
                  <Icon name="media" size={17} />
                </div>

                <p className="mt-4 font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                  Media Library
                </p>

                <p className="mt-1 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                  Manage editorial assets
                </p>
              </Link>

              <Link
                to="/posts"
                className="group border-r border-[var(--color-outline-variant)] p-5 transition-colors hover:bg-[var(--color-surface-container-low)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-container-low)] text-[var(--color-primary)]">
                  <Icon name="posts" size={17} />
                </div>

                <p className="mt-4 font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                  All Stories
                </p>

                <p className="mt-1 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                  Manage your publication
                </p>
              </Link>

              <Link
                to="/settings"
                className="group p-5 transition-colors hover:bg-[var(--color-surface-container-low)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-container-low)] text-[var(--color-primary)]">
                  <Icon name="settings" size={17} />
                </div>

                <p className="mt-4 font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                  Settings
                </p>

                <p className="mt-1 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                  Configure your workspace
                </p>
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
