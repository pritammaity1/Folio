import FeaturedImage from "./FeaturedImage";
import StoryEditor from "./StoryEditor";

interface EditorCanvasProps {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverPreviewUrl: string | null;
  wordCount: number;
  readingTime: number;
  uploadingCover: boolean;
  disabled: boolean;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onUploadCover: (file: File) => void;
  onRemoveCover: () => void;
}

function EditorCanvas({
  title,
  slug,
  excerpt,
  content,
  coverPreviewUrl,
  wordCount,
  readingTime,
  uploadingCover,
  disabled,
  onTitleChange,
  onSlugChange,
  onExcerptChange,
  onContentChange,
  onUploadCover,
  onRemoveCover,
}: EditorCanvasProps) {
  return (
    <article
      className={[
        "overflow-hidden rounded-[10px]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface)]",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03),0_12px_32px_rgba(0,0,0,0.035)]",
      ].join(" ")}
    >
      <header className="border-b border-[var(--color-outline-variant)] px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />

              <span className="font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-on-surface)]">
                New Story
              </span>
            </div>

            <p className="mt-1.5 truncate font-body text-[11px] text-[var(--color-on-surface-variant)]">
              {title.trim() || "Untitled draft"}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="font-body text-[10px] text-[var(--color-on-surface-variant)]">
                {wordCount.toLocaleString()} words
              </p>

              <p className="mt-1 font-body text-[10px] text-[var(--color-on-surface-variant)]">
                {readingTime} min read
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
        <section>
          <input
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Write your headline..."
            disabled={disabled}
            aria-label="Story headline"
            className={[
              "w-full border-0 bg-transparent p-0",
              "font-display text-[clamp(44px,5.4vw,68px)]",
              "font-semibold leading-[1.02]",
              "tracking-[-0.045em]",
              "text-[var(--color-on-surface)]",
              "outline-none",
              "placeholder:text-[var(--color-outline)]",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
          />
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-3 border-y border-[var(--color-outline-variant)] py-3.5">
            <span className="shrink-0 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
              URL
            </span>

            <span className="hidden shrink-0 font-body text-[11px] text-[var(--color-on-surface-variant)] sm:inline">
              folio.app/stories/
            </span>

            <input
              type="text"
              value={slug}
              onChange={(event) => onSlugChange(event.target.value)}
              placeholder="story-slug"
              disabled={disabled}
              aria-label="Story slug"
              className={[
                "min-w-0 flex-1 border-0 bg-transparent p-0",
                "font-body text-[12px]",
                "text-[var(--color-on-surface)]",
                "outline-none",
                "placeholder:text-[var(--color-outline)]",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            />
          </div>
        </section>

        <section className="mt-8">
          <textarea
            value={excerpt}
            maxLength={300}
            onChange={(event) => onExcerptChange(event.target.value)}
            placeholder="Write a brief introduction for readers..."
            disabled={disabled}
            rows={2}
            aria-label="Story excerpt"
            className={[
              "w-full resize-none border-0 bg-transparent p-0",
              "font-display text-[19px] italic leading-[1.6]",
              "text-[var(--color-on-surface-variant)]",
              "outline-none",
              "placeholder:text-[var(--color-outline)]",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
          />

          <div className="mt-3 flex justify-end">
            <span className="font-body text-[10px] tabular-nums text-[var(--color-on-surface-variant)]">
              {excerpt.length}/300
            </span>
          </div>
        </section>

        <div className="mt-10 border-t border-[var(--color-outline-variant)] pt-8">
          <FeaturedImage
            imageUrl={coverPreviewUrl}
            uploading={uploadingCover}
            disabled={disabled}
            onSelect={onUploadCover}
            onRemove={onRemoveCover}
          />
        </div>

        <StoryEditor
          content={content}
          wordCount={wordCount}
          readingTime={readingTime}
          disabled={disabled}
          onChange={onContentChange}
        />
      </div>
    </article>
  );
}

export default EditorCanvas;
