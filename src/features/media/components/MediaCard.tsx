import { Icon } from "../../../components/ui/Icon/Icon";
import type { MediaAsset } from "../../../types/media";

interface MediaCardProps {
  media: MediaAsset;
  onPreview?: (media: MediaAsset) => void;
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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getFileExtension(fileName: string) {
  const extension = fileName.split(".").pop();

  if (!extension) {
    return "FILE";
  }

  return extension.toUpperCase();
}

export function MediaCard({ media, onPreview }: MediaCardProps) {
  const isImage = media.mimeType.startsWith("image/");

  return (
    <article
      className={[
        "group overflow-hidden",
        "rounded-[var(--radius-md)]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface)]",
        "shadow-[var(--shadow-xs)]",
        "transition-[transform,box-shadow,border-color]",
        "duration-[var(--motion-normal)]",
        "ease-[var(--ease-standard)]",
        "hover:-translate-y-0.5",
        "hover:border-[var(--color-primary)]/30",
        "hover:shadow-[var(--shadow-sm)]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onPreview?.(media)}
        className={[
          "relative block w-full overflow-hidden",
          "bg-[var(--color-surface-container-low)]",
          "focus-visible:outline-2",
          "focus-visible:outline-[var(--color-primary)]",
          "focus-visible:outline-offset-[-2px]",
        ].join(" ")}
        aria-label={`Preview ${media.fileName}`}
      >
        <div className="aspect-[4/3] w-full">
          {isImage ? (
            <img
              src={media.url}
              alt={media.fileName}
              loading="lazy"
              className={[
                "h-full w-full object-cover",
                "transition-[transform]",
                "duration-[var(--motion-slow)]",
                "ease-[var(--ease-standard)]",
                "group-hover:scale-[1.02]",
              ].join(" ")}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <div
                className={[
                  "flex h-12 w-12 items-center justify-center",
                  "rounded-[var(--radius-sm)]",
                  "bg-[var(--color-surface)]",
                  "text-[var(--color-primary)]",
                  "shadow-[var(--shadow-xs)]",
                ].join(" ")}
              >
                <Icon name="file-text" size={22} strokeWidth={1.7} />
              </div>

              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                {getFileExtension(media.fileName)}
              </span>
            </div>
          )}

          <span
            className={[
              "absolute right-3 top-3",
              "rounded-full",
              "border border-white/20",
              "bg-black/55",
              "px-2 py-1",
              "font-body text-[10px] font-semibold uppercase tracking-[0.06em]",
              "text-white",
              "backdrop-blur-sm",
            ].join(" ")}
          >
            {isImage ? "Image" : getFileExtension(media.fileName)}
          </span>
        </div>
      </button>

      <div className="space-y-4 p-4">
        <div className="min-w-0">
          <h3
            className={[
              "truncate",
              "font-body text-[13px] font-semibold",
              "text-[var(--color-on-surface)]",
            ].join(" ")}
            title={media.fileName}
          >
            {media.fileName}
          </h3>

          <div className="mt-2 flex items-center gap-2 font-body text-[11px] text-[var(--color-on-surface-variant)]">
            <span>{formatFileSize(media.size)}</span>

            <span
              className="h-1 w-1 rounded-full bg-[var(--color-outline)]"
              aria-hidden="true"
            />

            <span>{formatDate(media.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-outline-variant)] pt-3">
          <span className="font-body text-[11px] text-[var(--color-on-surface-variant)]">
            {media.usageCount === 0
              ? "Unused"
              : `${media.usageCount} ${media.usageCount === 1 ? "use" : "uses"}`}
          </span>

          <button
            type="button"
            onClick={() => onPreview?.(media)}
            className={[
              "inline-flex items-center gap-1.5",
              "rounded-[var(--radius-sm)]",
              "px-2.5 py-1.5",
              "font-body text-[11px] font-semibold",
              "text-[var(--color-primary)]",
              "transition-[background-color,color]",
              "duration-[var(--motion-fast)]",
              "hover:bg-[var(--color-surface-container-low)]",
              "hover:text-[var(--color-primary-container)]",
              "focus-visible:outline-2",
              "focus-visible:outline-[var(--color-primary)]",
              "focus-visible:outline-offset-1",
            ].join(" ")}
          >
            <Icon name="eye" size={14} strokeWidth={1.8} />
            <span>Preview</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default MediaCard;
