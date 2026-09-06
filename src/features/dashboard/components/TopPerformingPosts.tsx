import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon/Icon";

export function TopPerformingPosts() {
  return (
    <article
      className={[
        "overflow-hidden rounded-[var(--radius-md)]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface)]",
        "shadow-[var(--shadow-xs)]",
        "transition-[transform,box-shadow,border-color]",
        "duration-[var(--motion-normal)]",
        "ease-[var(--ease-standard)]",
        "animate-[card-enter_500ms_var(--ease-standard)_both]",
        "hover:-translate-y-0.5",
        "hover:shadow-[var(--shadow-md)]",
        "hover:border-[var(--color-outline)]",
        "active:translate-y-0",
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
            "transition-[background-color, color, transform]",
            "duration-[var(--motion-fast)]",
            "ease-[var(--ease-standard)]",
            "hover:bg-[var(--color-surface-container-low)]",
            "hover:text-[var(--color-primary-container)]",
            "active:translate-x-px",
            "focus-visible:outline-2",
            "focus-visible:outline-[var(--color-primary)]",
            "focus-visible:outline-offset-2",
          ].join(" ")}
        >
          <Icon name="chevron-right" size={19} strokeWidth={1.9} />
        </Link>
      </div>

      <div className="flex min-h-[270px] flex-col items-center justify-center px-6 py-10 text-center">
        <div
          className={[
            "flex h-12 w-12 items-center justify-center",
            "rounded-full",
            "bg-[var(--color-surface-container-low)]",
            "text-[var(--color-on-surface-variant)]",
          ].join(" ")}
        >
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
            "ease-[var(--ease-standard)]",
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
  );
}
