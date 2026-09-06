import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../../components/ui/Icon/Icon";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { TopPerformingPosts } from "../../../features/dashboard/components/TopPerformingPosts";
import { RecentActivity } from "../../../features/dashboard/components/RecentActivity";
import ReaderActivity from "../../../features/dashboard/components/ReaderActivity";

const metrics = [
  {
    label: "TOTAL VIEWS",
    value: "124,820",
    detail: "vs last week",
    change: "+18.4%",
  },
  {
    label: "PUBLISHED POSTS",
    value: "248",
    detail: "this month",
    change: "+12",
  },
  {
    label: "DRAFTS IN PROGRESS",
    value: "18",
    detail: "4 ready for review",
  },
  {
    label: "ENGAGEMENT RATE",
    value: "72.4%",
    detail: "avg 4m 18s read",
    change: "+4.2%",
  },
];

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

function Dashboard() {
  const { user } = useAuth();

  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const greeting = getGreeting(currentTime.getHours());

  const userName = user ? getUserName(user) : "Editor";

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-w-0 flex-1 overflow-x-hidden bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-[var(--canvas-width)] px-5 py-7 sm:px-7 lg:px-9">
        <section className="border-b border-[var(--color-outline-variant)] pb-8">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <p className="mt-1 font-body text-[14px] text-[var(--color-on-surface-variant)]">
                {formattedDate}
              </p>

              <h1 className="mt-2 font-display text-[40px] leading-[1.08] tracking-[-0.035em] text-[var(--color-on-surface)] sm:text-[48px]">
                {greeting}, {userName} <span aria-hidden="true">👋</span>
              </h1>

              <p className="mt-2 max-w-[680px] font-body text-[16px] leading-6 text-[var(--color-on-surface-variant)]">
                Here’s your content overview and publication performance for
                today.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link
                to="/media"
                className={[
                  "inline-flex h-11 items-center justify-center gap-2",
                  "rounded-[var(--radius-md)]",
                  "border border-[var(--color-outline)]",
                  "bg-[var(--color-surface)]",
                  "px-4",
                  "font-body text-[13px] font-semibold",
                  "text-[var(--color-on-surface)]",
                  "shadow-[var(--shadow-xs)]",
                  "transition-[background-color,border-color,color,transform]",
                  "duration-[var(--motion-fast)]",
                  "ease-[var(--ease-standard)]",
                  "hover:border-[var(--color-primary)]",
                  "hover:bg-[var(--color-surface-container-low)]",
                  "hover:text-[var(--color-primary)]",
                  "active:translate-y-px",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[var(--color-primary)]",
                  "focus-visible:outline-offset-2",
                ].join(" ")}
              >
                <Icon name="upload" size={17} strokeWidth={1.9} />
                <span>Upload Media</span>
              </Link>

              <Link
                to="/posts/new"
                className={[
                  "inline-flex h-11 items-center justify-center gap-2",
                  "rounded-[var(--radius-md)]",
                  "bg-[var(--color-primary)]",
                  "px-4",
                  "font-body text-[13px] font-semibold",
                  "text-[var(--color-on-primary)]",
                  "shadow-[var(--shadow-xs)]",
                  "transition-[background-color,transform,box-shadow]",
                  "duration-[var(--motion-fast)]",
                  "ease-[var(--ease-standard)]",
                  "hover:bg-[var(--color-primary-container)]",
                  "hover:shadow-[var(--shadow-sm)]",
                  "active:translate-y-px",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[var(--color-primary)]",
                  "focus-visible:outline-offset-2",
                ].join(" ")}
              >
                <Icon name="plus" size={17} strokeWidth={2} />
                <span>Create Post</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className={[
                "relative min-h-[190px]",
                "rounded-[var(--radius-md)]",
                "border border-[var(--color-outline-variant)]",
                "bg-[var(--color-surface)]",
                "p-5",
                "shadow-[var(--shadow-xs)]",
                "transition-[border-color,box-shadow,transform]",
                "duration-[var(--motion-fast)]",
                "ease-[var(--ease-standard)]",
                "hover:border-[var(--color-outline)]",
                "hover:shadow-[var(--shadow-sm)]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                  {metric.label}
                </p>

                {metric.change && (
                  <span className="shrink-0 rounded-full bg-[var(--color-surface-container-low)] px-2.5 py-1 font-body text-[11px] font-semibold text-[var(--color-success)]">
                    {metric.change}
                  </span>
                )}
              </div>

              <p className="mt-3 font-display text-[38px] leading-none tracking-[-0.03em] text-[var(--color-on-surface)]">
                {metric.value}
              </p>

              <p className="mt-2 font-body text-[14px] text-[var(--color-on-surface-variant)]">
                {metric.detail}
              </p>

              {metric.label === "ENGAGEMENT RATE" && (
                <div className="mt-7">
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-container)]">
                    <div
                      className="h-full w-[72.4%] rounded-full bg-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>

        <section
          className={[
            "mt-7 overflow-hidden",
            "rounded-[var(--radius-md)]",
            "border border-[var(--color-outline-variant)]",
            "bg-[var(--color-surface)]",
            "shadow-[var(--shadow-xs)]",
          ].join(" ")}
        >
          <ReaderActivity />
        </section>

        <section className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <TopPerformingPosts />
          <RecentActivity />
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
