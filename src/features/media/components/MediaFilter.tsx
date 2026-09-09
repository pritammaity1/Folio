import { Icon } from "../../../components/ui/Icon/Icon";

export type MediaFilterType = "all" | "images";

export type MediaSortOption = "newest" | "oldest" | "name";

interface MediaFilterProps {
  search: string;
  type: MediaFilterType;
  sort: MediaSortOption;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: MediaFilterType) => void;
  onSortChange: (value: MediaSortOption) => void;
}

export function MediaFilter({
  search,
  type,
  sort,
  onSearchChange,
  onTypeChange,
  onSortChange,
}: MediaFilterProps) {
  return (
    <div
      className={[
        "flex flex-col gap-3",
        "rounded-[var(--radius-md)]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface)]",
        "p-3",
        "sm:p-4",
        "lg:flex-row lg:items-center",
      ].join(" ")}
    >
      <div className="relative min-w-0 flex-1">
        <Icon
          name="search"
          size={17}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search media..."
          aria-label="Search media"
          className={[
            "h-10 w-full",
            "rounded-[var(--radius-sm)]",
            "border border-[var(--color-outline-variant)]",
            "bg-[var(--color-surface-container-low)]",
            "pl-10 pr-3",
            "font-body text-[13px]",
            "text-[var(--color-on-surface)]",
            "placeholder:text-[var(--color-on-surface-variant)]",
            "outline-none",
            "transition-[border-color,background-color]",
            "duration-[var(--motion-fast)]",
            "focus:border-[var(--color-primary)]",
            "focus:bg-[var(--color-surface)]",
          ].join(" ")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          className={[
            "inline-flex items-center",
            "rounded-[var(--radius-sm)]",
            "bg-[var(--color-surface-container-low)]",
            "p-1",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => onTypeChange("all")}
            aria-pressed={type === "all"}
            className={[
              "rounded-[var(--radius-sm)] px-3 py-1.5",
              "font-body text-[12px] font-semibold",
              "transition-[background-color,color,box-shadow]",
              "duration-[var(--motion-fast)]",
              type === "all"
                ? [
                    "!bg-[var(--color-surface)]",
                    "!text-[var(--color-primary)]",
                    "shadow-[var(--shadow-xs)]",
                  ].join(" ")
                : [
                    "text-[var(--color-on-surface-variant)]",
                    "hover:text-[var(--color-primary)]",
                  ].join(" "),
            ].join(" ")}
          >
            All files
          </button>

          <button
            type="button"
            onClick={() => onTypeChange("images")}
            aria-pressed={type === "images"}
            className={[
              "rounded-[var(--radius-sm)] px-3 py-1.5",
              "font-body text-[12px] font-semibold",
              "transition-[background-color,color,box-shadow]",
              "duration-[var(--motion-fast)]",
              type === "images"
                ? [
                    "!bg-[var(--color-primary)]",
                    "!text-[var(--color-on-primary)]",
                    "shadow-[var(--shadow-xs)]",
                  ].join(" ")
                : [
                    "text-[var(--color-on-surface-variant)]",
                    "hover:text-[var(--color-primary)]",
                  ].join(" "),
            ].join(" ")}
          >
            Images
          </button>
        </div>

        <label className="relative">
          <span className="sr-only">Sort media</span>

          <select
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value as MediaSortOption)
            }
            className={[
              "h-9 appearance-none",
              "rounded-[var(--radius-sm)]",
              "border border-[var(--color-outline-variant)]",
              "bg-[var(--color-surface)]",
              "pl-3 pr-8",
              "font-body text-[12px] font-semibold",
              "text-[var(--color-on-surface)]",
              "outline-none",
              "transition-[border-color,background-color]",
              "duration-[var(--motion-fast)]",
              "hover:border-[var(--color-primary)]/30",
              "focus:border-[var(--color-primary)]",
              "focus:bg-[var(--color-surface)]",
            ].join(" ")}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name A–Z</option>
          </select>

          <Icon
            name="chevron-down"
            size={14}
            strokeWidth={1.8}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
          />
        </label>
      </div>
    </div>
  );
}

export default MediaFilter;
