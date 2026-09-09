interface ReadingPanelProps {
  wordCount: number;
  readingTime: number;
  contentLength: number;
}

function ReadingPanel({
  wordCount,
  readingTime,
  contentLength,
}: ReadingPanelProps) {
  const estimatedCharacters = contentLength.toLocaleString();

  return (
    <section
      className={[
        "overflow-hidden rounded-[8px]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface)]",
        "shadow-[var(--shadow-xs)]",
      ].join(" ")}
    >
      <div className="border-b border-[var(--color-outline-variant)] px-5 py-4">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-on-surface)]">
          Reading
        </p>

        <p className="mt-1.5 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
          A quick view of the story length and pace.
        </p>
      </div>

      <div className="px-5 py-5">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-[var(--color-outline-variant)] bg-[var(--color-outline-variant)]">
          <div className="bg-[var(--color-surface)] px-3.5 py-3.5">
            <p className="font-body text-[20px] font-semibold tracking-[-0.02em] text-[var(--color-on-surface)]">
              {wordCount.toLocaleString()}
            </p>

            <p className="mt-1 font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
              Words
            </p>
          </div>

          <div className="bg-[var(--color-surface)] px-3.5 py-3.5">
            <p className="font-body text-[20px] font-semibold tracking-[-0.02em] text-[var(--color-on-surface)]">
              {readingTime}
            </p>

            <p className="mt-1 font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
              Min read
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-body text-[11px] text-[var(--color-on-surface-variant)]">
              Characters
            </span>

            <span className="font-body text-[11px] font-medium tabular-nums text-[var(--color-on-surface)]">
              {estimatedCharacters}
            </span>
          </div>

          <div className="mt-3 h-px bg-[var(--color-outline-variant)]" />

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="font-body text-[11px] text-[var(--color-on-surface-variant)]">
              Reading pace
            </span>

            <span className="font-body text-[11px] font-medium text-[var(--color-on-surface)]">
              {readingTime <= 2
                ? "Quick read"
                : readingTime <= 6
                  ? "Medium read"
                  : "Long read"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReadingPanel;
