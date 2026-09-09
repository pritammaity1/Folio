import { useEffect } from "react";
import { Icon } from "../../../components/ui/Icon/Icon";
import type { MediaAsset } from "../../../types/media";

interface MediaPreviewProps {
  media: MediaAsset | null;
  onClose: () => void;
  onDelete?: (media: MediaAsset) => void;
  deleting?: boolean;
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(timestamp: MediaAsset["createdAt"]) {
  return timestamp.toDate().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatMimeType(mimeType: string) {
  return mimeType
    .replace("/", " / ")
    .split(" ")
    .map((part) => {
      if (!part) {
        return part;
      }

      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

export function MediaPreview({
  media,
  onClose,
  onDelete,
  deleting = false,
}: MediaPreviewProps) {
  useEffect(() => {
    if (!media) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !deleting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [media, onClose, deleting]);

  if (!media) {
    return null;
  }

  const isImage = media.mimeType.startsWith("image/");
  const isUsed = media.usageCount > 0;

  return (
    <div
      className={[
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        "bg-black/35 p-4",
        "backdrop-blur-[2px]",
      ].join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${media.fileName}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) {
          onClose();
        }
      }}
    >
      <div
        className={[
          "flex w-full max-w-[960px] max-h-[calc(100vh-2rem)]",
          "flex-col overflow-hidden",
          "rounded-[var(--radius-md)]",
          "border border-[var(--color-outline-variant)]",
          "bg-[var(--color-surface)]",
          "shadow-[var(--shadow-lg)]",
          "animate-[fade-in_150ms_ease-out]",
          "lg:flex-row",
        ].join(" ")}
      >
        <section
          className={[
            "relative flex min-h-[280px] items-center justify-center",
            "bg-[var(--color-surface-container-low)]",
            "p-5",
            "lg:min-h-[600px] lg:flex-1",
          ].join(" ")}
        >
          <div className="flex h-full w-full items-center justify-center">
            {isImage ? (
              <img
                src={media.url}
                alt={media.fileName}
                className={[
                  "max-h-[60vh] max-w-full",
                  "rounded-[var(--radius-sm)]",
                  "object-contain",
                  "lg:max-h-[560px]",
                ].join(" ")}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <div
                  className={[
                    "flex h-20 w-20 items-center justify-center",
                    "rounded-[var(--radius-md)]",
                    "bg-[var(--color-surface)]",
                    "text-[var(--color-primary)]",
                    "shadow-[var(--shadow-sm)]",
                  ].join(" ")}
                >
                  <Icon name="file-text" size={32} strokeWidth={1.6} />
                </div>

                <span className="font-body text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                  {formatMimeType(media.mimeType)}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            aria-label="Close preview"
            className={[
              "absolute right-4 top-4",
              "flex h-9 w-9 items-center justify-center",
              "rounded-full",
              "border border-[var(--color-outline-variant)]",
              "bg-[var(--color-surface)]/90",
              "text-[var(--color-on-surface)]",
              "shadow-[var(--shadow-xs)]",
              "backdrop-blur-sm",
              "transition-[background-color,color,transform]",
              "duration-[var(--motion-fast)]",
              "hover:bg-[var(--color-surface-container-low)]",
              "active:scale-95",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:outline-2",
              "focus-visible:outline-[var(--color-primary)]",
              "focus-visible:outline-offset-2",
            ].join(" ")}
          >
            <Icon name="x" size={17} strokeWidth={1.9} />
          </button>
        </section>

        <aside
          className={[
            "flex w-full flex-col",
            "border-t border-[var(--color-outline-variant)]",
            "bg-[var(--color-surface)]",
            "lg:w-[330px] lg:border-l lg:border-t-0",
          ].join(" ")}
        >
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <div>
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                Media asset
              </p>

              <h2
                className={[
                  "mt-2 break-words",
                  "font-display text-[25px] leading-[1.15]",
                  "tracking-[-0.02em]",
                  "text-[var(--color-on-surface)]",
                ].join(" ")}
              >
                {media.fileName}
              </h2>
            </div>

            <div className="mt-6 space-y-0">
              <div className="border-t border-[var(--color-outline-variant)] py-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-body text-[12px] text-[var(--color-on-surface-variant)]">
                    File type
                  </span>

                  <span className="text-right font-body text-[12px] font-semibold text-[var(--color-on-surface)]">
                    {formatMimeType(media.mimeType)}
                  </span>
                </div>
              </div>

              <div className="border-t border-[var(--color-outline-variant)] py-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-body text-[12px] text-[var(--color-on-surface-variant)]">
                    File size
                  </span>

                  <span className="font-body text-[12px] font-semibold text-[var(--color-on-surface)]">
                    {formatFileSize(media.size)}
                  </span>
                </div>
              </div>

              <div className="border-t border-[var(--color-outline-variant)] py-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-body text-[12px] text-[var(--color-on-surface-variant)]">
                    Uploaded
                  </span>

                  <span className="max-w-[170px] text-right font-body text-[12px] font-semibold leading-5 text-[var(--color-on-surface)]">
                    {formatDate(media.createdAt)}
                  </span>
                </div>
              </div>

              <div className="border-t border-[var(--color-outline-variant)] py-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-body text-[12px] text-[var(--color-on-surface-variant)]">
                    Usage
                  </span>

                  <span
                    className={[
                      "rounded-full px-2 py-1",
                      "font-body text-[10px] font-semibold uppercase tracking-[0.05em]",
                      isUsed
                        ? "bg-[var(--color-surface-container-low)] text-[var(--color-primary)]"
                        : "bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]",
                    ].join(" ")}
                  >
                    {isUsed
                      ? `${media.usageCount} ${
                          media.usageCount === 1 ? "reference" : "references"
                        }`
                      : "Unused"}
                  </span>
                </div>
              </div>

              <div className="border-t border-[var(--color-outline-variant)] py-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-body text-[12px] text-[var(--color-on-surface-variant)]">
                    Status
                  </span>

                  <span className="font-body text-[12px] font-semibold text-[var(--color-on-surface)]">
                    {media.status === "active" ? "Active" : "Deleting"}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={[
                "mt-6 rounded-[var(--radius-sm)]",
                "bg-[var(--color-surface-container-low)]",
                "p-4",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div
                  className={[
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center",
                    "rounded-full",
                    "bg-[var(--color-surface)]",
                    "text-[var(--color-primary)]",
                  ].join(" ")}
                >
                  <Icon name="image" size={14} strokeWidth={1.7} />
                </div>

                <div>
                  <p className="font-body text-[12px] font-semibold text-[var(--color-on-surface)]">
                    Editorial asset
                  </p>

                  <p className="mt-1 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                    Media referenced by published or draft stories is protected
                    from accidental deletion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={[
              "border-t border-[var(--color-outline-variant)]",
              "p-5 sm:p-6",
            ].join(" ")}
          >
            {isUsed ? (
              <p className="font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                This asset is currently referenced by {media.usageCount}{" "}
                {media.usageCount === 1 ? "story" : "stories"}.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => onDelete?.(media)}
                disabled={deleting || media.status === "deleting"}
                className={[
                  "!flex !h-10 !w-full !items-center !justify-center !gap-2",
                  "!rounded-[var(--radius-sm)]",
                  "!border-0",
                  "!bg-red-600",
                  "!font-body !text-[12px] !font-semibold",
                  "!text-white",
                  "transition-[background-color,transform]",
                  "duration-[var(--motion-fast)]",
                  "hover:!bg-red-700",
                  "active:!bg-red-800",
                  "active:translate-y-px",
                  "disabled:!cursor-not-allowed disabled:!bg-red-300",
                  "focus-visible:outline-2",
                  "focus-visible:outline-red-600",
                  "focus-visible:outline-offset-2",
                ].join(" ")}
              >
                <Icon name="x" size={14} strokeWidth={2} />

                <span>
                  {deleting ? "Deleting asset..." : "Delete unused asset"}
                </span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MediaPreview;
