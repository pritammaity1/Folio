import { Icon } from "../../../components/ui/Icon/Icon";
import type { PostStatus } from "../../../types/post";

type PostStatusFilter = "all" | PostStatus;
type PostSortOption = "newest" | "oldest" | "title";

interface PostFilterProps {
  searchQuery: string;
  status: PostStatusFilter;
  sortBy: PostSortOption;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: PostStatusFilter) => void;
  onSortChange: (value: PostSortOption) => void;
  onClear: () => void;
}

function PostFilter({
  searchQuery,
  status,
  sortBy,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onClear,
}: PostFilterProps) {
  const hasFilters = searchQuery.trim().length > 0 || status !== "all";

  return (
    <section
      className={[
        "rounded-[8px]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface)]",
        "shadow-[var(--shadow-xs)]",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <label
          className={[
            "flex h-10 min-w-0 flex-1 items-center",
            "rounded-[7px]",
            "border border-[var(--color-outline-variant)]",
            "bg-[var(--color-background)]",
            "px-3",
            "transition-[border-color,box-shadow]",
            "duration-[var(--motion-fast)]",
            "focus-within:border-[var(--color-primary)]",
            "focus-within:shadow-[0_0_0_3px_rgba(154,65,17,0.06)]",
          ].join(" ")}
        >
          <Icon
            name="search"
            size={15}
            strokeWidth={1.8}
            className="shrink-0 text-[var(--color-on-surface-variant)]"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search posts..."
            aria-label="Search posts"
            className={[
              "ml-2.5 min-w-0 flex-1",
              "border-0 bg-transparent",
              "font-body text-[12px]",
              "text-[var(--color-on-surface)]",
              "outline-none",
              "placeholder:text-[var(--color-outline)]",
            ].join(" ")}
          />

          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              title="Clear search"
              onClick={() => onSearchChange("")}
              className={[
                "ml-2 flex h-6 w-6 shrink-0 items-center justify-center",
                "rounded-full",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface-container-low)]",
                "hover:text-[var(--color-on-surface)]",
              ].join(" ")}
            >
              <Icon name="x" size={12} strokeWidth={2} />
            </button>
          )}
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex h-10 items-center rounded-[7px] border border-[var(--color-outline-variant)] bg-[var(--color-background)] px-3">
            <span className="mr-2.5 shrink-0 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
              Status
            </span>

            <select
              value={status}
              onChange={(event) =>
                onStatusChange(event.target.value as PostStatusFilter)
              }
              aria-label="Filter by status"
              className={[
                "min-w-[118px]",
                "cursor-pointer",
                "border-0 bg-transparent",
                "font-body text-[12px] font-medium",
                "text-[var(--color-on-surface)]",
                "outline-none",
              ].join(" ")}
            >
              <option value="all">All posts</option>
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <Icon
              name="chevron-down"
              size={13}
              strokeWidth={1.8}
              className="ml-2 shrink-0 text-[var(--color-on-surface-variant)]"
            />
          </label>

          <label className="flex h-10 items-center rounded-[7px] border border-[var(--color-outline-variant)] bg-[var(--color-background)] px-3">
            <span className="mr-2.5 shrink-0 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
              Sort
            </span>

            <select
              value={sortBy}
              onChange={(event) =>
                onSortChange(event.target.value as PostSortOption)
              }
              aria-label="Sort posts"
              className={[
                "min-w-[116px]",
                "cursor-pointer",
                "border-0 bg-transparent",
                "font-body text-[12px] font-medium",
                "text-[var(--color-on-surface)]",
                "outline-none",
              ].join(" ")}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title</option>
            </select>

            <Icon
              name="chevron-down"
              size={13}
              strokeWidth={1.8}
              className="ml-2 shrink-0 text-[var(--color-on-surface-variant)]"
            />
          </label>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className={[
              "inline-flex h-10 shrink-0 items-center justify-center gap-1.5",
              "rounded-[7px]",
              "border border-[var(--color-outline-variant)]",
              "bg-transparent px-3.5",
              "font-body text-[11px] font-semibold",
              "text-[var(--color-on-surface-variant)]",
              "transition-[background-color,border-color,color]",
              "duration-[var(--motion-fast)]",
              "hover:border-[var(--color-primary)]",
              "hover:bg-[rgba(154,65,17,0.04)]",
              "hover:text-[var(--color-primary)]",
            ].join(" ")}
          >
            <Icon name="rotate-ccw" size={13} strokeWidth={1.9} />
            <span>Clear</span>
          </button>
        )}
      </div>
    </section>
  );
}

export type { PostSortOption, PostStatusFilter };
export default PostFilter;
