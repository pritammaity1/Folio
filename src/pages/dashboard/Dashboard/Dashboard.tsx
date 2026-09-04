import { Link } from "react-router-dom";
import { Icon } from "../../../components/ui/Icon/Icon";

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

const timeRanges = ["7D", "30D", "90D", "1Y"];

export function Dashboard() {
  return (
    <main className="min-w-0 flex-1 overflow-x-hidden bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-[var(--canvas-width)] px-5 py-7 sm:px-7 lg:px-9">
        <section className="border-b border-[var(--color-outline-variant)] pb-8">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <p className="font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                Kinfolk Editorial Desk · Live Dispatch
              </p>

              <p className="mt-1 font-body text-[14px] text-[var(--color-on-surface-variant)]">
                Saturday, September 5, 2026
              </p>

              <h1 className="mt-2 font-display text-[40px] leading-[1.08] tracking-[-0.035em] text-[var(--color-on-surface)] sm:text-[48px]">
                Good morning, Pritam 👋
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
          <div className="flex flex-col gap-5 border-b border-[var(--color-outline-variant)] px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                CONTENT PERFORMANCE
              </p>

              <h2 className="mt-1 font-display text-[27px] leading-tight tracking-[-0.02em] text-[var(--color-on-surface)]">
                Reader activity
              </h2>
            </div>

            <div className="inline-flex w-fit items-center rounded-[var(--radius-md)] bg-[var(--color-surface-container-low)] p-1">
              {timeRanges.map((range) => {
                const active = range === "90D";

                return (
                  <button
                    key={range}
                    type="button"
                    className={[
                      "min-w-[54px] rounded-[var(--radius-sm)] px-3 py-2",
                      "font-body text-[13px] font-semibold",
                      "transition-[background-color,color,box-shadow]",
                      "duration-[var(--motion-fast)]",
                      active
                        ? [
                            "bg-[var(--color-surface)]",
                            "text-[var(--color-primary)]",
                            "shadow-[var(--shadow-xs)]",
                          ].join(" ")
                        : [
                            "text-[var(--color-on-surface-variant)]",
                            "hover:bg-[var(--color-surface)]",
                            "hover:text-[var(--color-on-surface)]",
                          ].join(" "),
                      "focus-visible:outline-2",
                      "focus-visible:outline-[var(--color-primary)]",
                      "focus-visible:outline-offset-1",
                    ].join(" ")}
                  >
                    {range}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div
              className={[
                "flex min-h-[300px] flex-col items-center justify-center",
                "rounded-[var(--radius-md)]",
                "bg-[var(--color-surface-container-low)]",
                "px-6 py-12 text-center",
              ].join(" ")}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-xs)]">
                <Icon name="activity" size={23} strokeWidth={1.8} />
              </div>

              <h3 className="mt-4 font-body text-[14px] font-semibold text-[var(--color-on-surface)]">
                Analytics are ready for Firestore data
              </h3>

              <p className="mt-1 max-w-[430px] font-body text-[13px] leading-5 text-[var(--color-on-surface-variant)]">
                Reader activity will appear here once publishing analytics are
                connected.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-2 font-body text-[12px] text-[var(--color-on-surface-variant)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                  Daily Views
                </span>

                <span className="inline-flex items-center gap-2 font-body text-[12px] text-[var(--color-on-surface-variant)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-secondary)]" />
                  Unique Readers
                </span>
              </div>

              <span className="font-body text-[12px] font-medium text-[var(--color-on-surface-variant)]">
                90D overview
              </span>
            </div>
          </div>
        </section>

        <section className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <article
            className={[
              "overflow-hidden rounded-[var(--radius-md)]",
              "border border-[var(--color-outline-variant)]",
              "bg-[var(--color-surface)]",
              "shadow-[var(--shadow-xs)]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] px-5 py-5 sm:px-6">
              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                  TOP PERFORMING POSTS
                </p>

                <h2 className="mt-1 font-display text-[25px] leading-tight tracking-[-0.02em] text-[var(--color-on-surface)]">
                  Reader favorites
                </h2>
              </div>

              <Link
                to="/posts"
                aria-label="View posts"
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  "text-[var(--color-primary)]",
                  "transition-[background-color,color,transform]",
                  "duration-[var(--motion-fast)]",
                  "hover:bg-[var(--color-surface-container-low)]",
                  "active:translate-x-px",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[var(--color-primary)]",
                ].join(" ")}
              >
                <Icon name="chevron-right" size={19} strokeWidth={1.9} />
              </Link>
            </div>

            <div className="flex min-h-[270px] flex-col items-center justify-center px-6 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
                <Icon name="posts" size={22} strokeWidth={1.7} />
              </div>

              <p className="mt-4 font-body text-[14px] text-[var(--color-on-surface-variant)]">
                Published stories will appear here.
              </p>

              <Link
                to="/posts"
                className={[
                  "mt-5 inline-flex items-center gap-2",
                  "rounded-[var(--radius-md)]",
                  "bg-[var(--color-primary)]",
                  "px-4 py-2.5",
                  "font-body text-[13px] font-semibold",
                  "text-[var(--color-on-primary)]",
                  "transition-[background-color,transform,box-shadow]",
                  "duration-[var(--motion-fast)]",
                  "hover:bg-[var(--color-primary-container)]",
                  "hover:shadow-[var(--shadow-sm)]",
                  "active:translate-y-px",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[var(--color-primary)]",
                  "focus-visible:outline-offset-2",
                ].join(" ")}
              >
                <span>View posts</span>
                <Icon name="chevron-right" size={16} strokeWidth={2} />
              </Link>
            </div>
          </article>

          <article
            className={[
              "overflow-hidden rounded-[var(--radius-md)]",
              "border border-[var(--color-outline-variant)]",
              "bg-[var(--color-surface)]",
              "shadow-[var(--shadow-xs)]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] px-5 py-5 sm:px-6">
              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                  RECENT ACTIVITY
                </p>

                <h2 className="mt-1 font-display text-[25px] leading-tight tracking-[-0.02em] text-[var(--color-on-surface)]">
                  Editorial timeline
                </h2>
              </div>

              <Link
                to="/analytics"
                aria-label="View analytics"
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  "text-[var(--color-primary)]",
                  "transition-[background-color,color,transform]",
                  "duration-[var(--motion-fast)]",
                  "hover:bg-[var(--color-surface-container-low)]",
                  "active:translate-x-px",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[var(--color-primary)]",
                ].join(" ")}
              >
                <Icon name="chevron-right" size={19} strokeWidth={1.9} />
              </Link>
            </div>

            <div className="flex min-h-[270px] flex-col items-center justify-center px-6 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-primary)]">
                <Icon name="activity" size={22} strokeWidth={1.7} />
              </div>

              <p className="mt-4 font-body text-[14px] text-[var(--color-on-surface-variant)]">
                Editorial activity will appear here.
              </p>

              <Link
                to="/analytics"
                className={[
                  "mt-5 inline-flex items-center gap-2",
                  "rounded-[var(--radius-md)]",
                  "bg-[var(--color-primary)]",
                  "px-4 py-2.5",
                  "font-body text-[13px] font-semibold",
                  "text-[var(--color-on-primary)]",
                  "transition-[background-color,transform,box-shadow]",
                  "duration-[var(--motion-fast)]",
                  "hover:bg-[var(--color-primary-container)]",
                  "hover:shadow-[var(--shadow-sm)]",
                  "active:translate-y-px",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[var(--color-primary)]",
                  "focus-visible:outline-offset-2",
                ].join(" ")}
              >
                <span>View analytics</span>
                <Icon name="chevron-right" size={16} strokeWidth={2} />
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
