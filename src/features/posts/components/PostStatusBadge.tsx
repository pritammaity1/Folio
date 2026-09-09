import type { PostStatus } from "../../../types/post";

interface PostStatusBadgeProps {
  status: PostStatus;
}

const statusLabels: Record<PostStatus, string> = {
  draft: "Draft",
  review: "In Review",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

function PostStatusBadge({ status }: PostStatusBadgeProps) {
  const label = statusLabels[status];

  const statusClass =
    status === "published"
      ? [
          "border-[rgba(42,112,68,0.16)]",
          "bg-[rgba(42,112,68,0.08)]",
          "text-[#2A7044]",
        ]
      : status === "draft"
        ? [
            "border-[var(--color-outline-variant)]",
            "bg-[var(--color-surface-container-low)]",
            "text-[var(--color-on-surface-variant)]",
          ]
        : status === "review"
          ? [
              "border-[rgba(154,65,17,0.14)]",
              "bg-[rgba(154,65,17,0.08)]",
              "text-[var(--color-primary)]",
            ]
          : status === "scheduled"
            ? [
                "border-[rgba(83,95,111,0.16)]",
                "bg-[rgba(83,95,111,0.08)]",
                "text-[var(--color-secondary)]",
              ]
            : [
                "border-[var(--color-outline-variant)]",
                "bg-[var(--color-surface-container-low)]",
                "text-[var(--color-on-surface-variant)]",
              ];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-full",
        "border",
        "px-2.5 py-1",
        "font-body text-[10px] font-semibold",
        "tracking-[0.01em]",
        ...statusClass,
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          status === "published"
            ? "bg-[#2A7044]"
            : status === "review"
              ? "bg-[var(--color-primary)]"
              : status === "scheduled"
                ? "bg-[var(--color-secondary)]"
                : "bg-[var(--color-outline)]",
        ].join(" ")}
        aria-hidden="true"
      />

      {label}
    </span>
  );
}

export default PostStatusBadge;
