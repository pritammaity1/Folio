import type { MediaAsset } from "../../../types/media";
import { MediaCard } from "./MediaCard";
import Icon from "../../../components/ui/Icon/Icon";

interface MediaGridProps {
  media: MediaAsset[];
  onPreview?: (media: MediaAsset) => void;
}

export function MediaGrid({ media, onPreview }: MediaGridProps) {
  if (media.length === 0) {
    return (
      <div
        className={[
          "flex min-h-[360px] flex-col items-center justify-center",
          "rounded-[var(--radius-md)]",
          "border border-dashed border-[var(--color-outline-variant)]",
          "bg-[var(--color-surface)]",
          "px-6 py-12",
          "text-center",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-12 w-12 items-center justify-center",
            "rounded-full",
            "bg-[var(--color-surface-container-low)]",
            "text-[var(--color-primary)]",
          ].join(" ")}
        >
          <Icon name="image" size={22} strokeWidth={1.7} />
        </div>

        <h3
          className={[
            "mt-4",
            "font-display text-[22px] leading-tight",
            "tracking-[-0.015em]",
            "text-[var(--color-on-surface)]",
          ].join(" ")}
        >
          No media found
        </h3>

        <p
          className={[
            "mt-2 max-w-[380px]",
            "font-body text-[13px] leading-5",
            "text-[var(--color-on-surface-variant)]",
          ].join(" ")}
        >
          Uploaded images and other media files will appear here.
        </p>
      </div>
    );
  }

  return (
    <div
      className={[
        "grid gap-4",
        "sm:grid-cols-2",
        "lg:grid-cols-3",
        "xl:grid-cols-4",
        "2xl:grid-cols-5",
      ].join(" ")}
    >
      {media.map((asset) => (
        <MediaCard key={asset.id} media={asset} onPreview={onPreview} />
      ))}
    </div>
  );
}

export default MediaGrid;
