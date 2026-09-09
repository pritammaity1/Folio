import type { ChangeEvent } from "react";
import { Icon } from "../../../components/ui/Icon/Icon";

interface FeaturedImageProps {
  imageUrl: string | null;
  uploading: boolean;
  disabled?: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

function FeaturedImage({
  imageUrl,
  uploading,
  disabled = false,
  onSelect,
  onRemove,
}: FeaturedImageProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      onSelect(file);
    }

    event.target.value = "";
  }

  if (imageUrl) {
    return (
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-on-surface)]">
              Cover Image
            </p>

            <p className="mt-1.5 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
              This image will introduce the story to readers.
            </p>
          </div>

          <div className="hidden font-body text-[10px] text-[var(--color-on-surface-variant)] sm:block">
            Recommended · wide landscape
          </div>
        </div>

        <div className="group relative mt-5 overflow-hidden rounded-[8px] bg-[var(--color-surface-container-low)]">
          <img
            src={imageUrl}
            alt="Story cover"
            className={[
              "aspect-[16/7.8] w-full object-cover",
              "transition-transform duration-500",
              "ease-[var(--ease-standard)]",
              "group-hover:scale-[1.01]",
            ].join(" ")}
          />

          <div
            className={[
              "absolute inset-x-0 bottom-0",
              "flex items-center justify-between gap-4",
              "bg-black/55 px-4 py-3.5",
              "backdrop-blur-[10px]",
              "opacity-0 transition-opacity duration-[var(--motion-fast)]",
              "group-hover:opacity-100",
              "focus-within:opacity-100",
            ].join(" ")}
          >
            <div className="min-w-0">
              <p className="font-body text-[11px] font-semibold text-white">
                Cover image
              </p>

              <p className="mt-0.5 font-body text-[10px] text-white/65">
                Ready for publication
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <label
                className={[
                  "inline-flex cursor-pointer items-center gap-2",
                  "rounded-[6px] bg-white/95 px-3 py-2",
                  "font-body text-[10px] font-semibold",
                  "text-[var(--color-on-surface)]",
                  "transition-opacity duration-[var(--motion-fast)]",
                  "hover:opacity-90",
                  disabled ? "pointer-events-none opacity-50" : "",
                ].join(" ")}
              >
                <Icon name="upload" size={13} strokeWidth={1.9} />
                Replace
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  disabled={disabled || uploading}
                  onChange={handleFileChange}
                />
              </label>

              <button
                type="button"
                onClick={onRemove}
                disabled={disabled || uploading}
                className={[
                  "inline-flex items-center gap-2",
                  "rounded-[6px]",
                  "border border-white/20",
                  "bg-black/25 px-3 py-2",
                  "font-body text-[10px] font-semibold",
                  "text-white",
                  "transition-[background-color,border-color]",
                  "duration-[var(--motion-fast)]",
                  "hover:border-white/35 hover:bg-black/40",
                  "disabled:pointer-events-none disabled:opacity-50",
                ].join(" ")}
              >
                <Icon name="x" size={13} strokeWidth={1.9} />
                Remove
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div>
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-on-surface)]">
          Cover Image
        </p>

        <p className="mt-1.5 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
          A strong landscape image gives the publication a memorable first
          impression.
        </p>
      </div>

      <label
        className={[
          "group mt-5 flex min-h-[280px] cursor-pointer flex-col",
          "items-center justify-center",
          "rounded-[8px]",
          "border border-dashed border-[var(--color-outline)]",
          "bg-[var(--color-background)]",
          "px-6 py-12 text-center",
          "transition-[background-color,border-color,transform]",
          "duration-[var(--motion-fast)]",
          "ease-[var(--ease-standard)]",
          "hover:-translate-y-px",
          "hover:border-[var(--color-primary)]",
          "hover:bg-[var(--color-surface-container-low)]",
          disabled ? "pointer-events-none opacity-55" : "",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-12 w-12 items-center justify-center rounded-full",
            "border border-[var(--color-outline-variant)]",
            "bg-[var(--color-surface)]",
            "text-[var(--color-on-surface-variant)]",
            "shadow-[var(--shadow-xs)]",
            "transition-[border-color,background-color,color,transform]",
            "duration-[var(--motion-fast)]",
            "group-hover:-translate-y-0.5",
            "group-hover:border-[var(--color-primary)]",
            "group-hover:bg-[var(--color-primary)]",
            "group-hover:text-[var(--color-on-primary)]",
          ].join(" ")}
        >
          <Icon name="image" size={20} strokeWidth={1.7} />
        </span>

        <p className="mt-5 font-display text-[22px] font-semibold tracking-[-0.02em] text-[var(--color-on-surface)]">
          {uploading ? "Uploading cover..." : "Add a cover image"}
        </p>

        <p className="mt-2 max-w-[430px] font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
          Choose a wide image that complements the story and gives readers a
          sense of what they are about to read.
        </p>

        <span
          className={[
            "mt-5 inline-flex items-center gap-2 rounded-[6px]",
            "bg-[var(--color-primary)] px-4 py-2.5",
            "font-body text-[11px] font-semibold",
            "text-[var(--color-on-primary)]",
            "shadow-[var(--shadow-xs)]",
            "transition-[background-color,transform,box-shadow]",
            "duration-[var(--motion-fast)]",
            "group-hover:bg-[var(--color-primary-container)]",
            "group-hover:shadow-[var(--shadow-sm)]",
            "active:translate-y-px",
          ].join(" ")}
        >
          {uploading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              Uploading
            </>
          ) : (
            <>
              <Icon name="upload" size={14} strokeWidth={1.9} />
              Choose image
            </>
          )}
        </span>

        <span className="mt-3 font-body text-[10px] text-[var(--color-outline)]">
          JPG, JPEG or PNG · up to 8MB
        </span>

        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          disabled={disabled || uploading}
          onChange={handleFileChange}
        />
      </label>
    </section>
  );
}

export default FeaturedImage;
