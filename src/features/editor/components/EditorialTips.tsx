import { Icon } from "../../../components/ui/Icon/Icon";

interface EditorialTipsProps {
  wordCount: number;
  hasTitle: boolean;
  hasExcerpt: boolean;
  hasCoverImage: boolean;
}

function EditorialTips({
  wordCount,
  hasTitle,
  hasExcerpt,
  hasCoverImage,
}: EditorialTipsProps) {
  const checks = [
    {
      label: "Clear headline",
      complete: hasTitle,
    },
    {
      label: "Reader-friendly introduction",
      complete: hasExcerpt,
    },
    {
      label: "Featured image",
      complete: hasCoverImage,
    },
    {
      label: "Substantial story",
      complete: wordCount >= 150,
    },
  ];

  const completedCount = checks.filter((item) => item.complete).length;

  return (
    <section
      className={[
        "overflow-hidden rounded-[8px]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface-container-low)]",
      ].join(" ")}
    >
      <div className="px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)]">
            <Icon name="sparkles" size={15} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-on-surface)]">
              Editorial Tips
            </p>

            <p className="mt-1.5 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
              A few things worth checking before publishing.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {checks.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span
                className={[
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                  item.complete
                    ? [
                        "border-[var(--color-primary)]",
                        "bg-[var(--color-primary)]",
                        "text-white",
                      ].join(" ")
                    : [
                        "border-[var(--color-outline)]",
                        "bg-transparent",
                        "text-transparent",
                      ].join(" "),
                ].join(" ")}
                aria-hidden="true"
              >
                <Icon name="check" size={9} strokeWidth={2.5} />
              </span>

              <span
                className={[
                  "font-body text-[11px]",
                  item.complete
                    ? "text-[var(--color-on-surface)]"
                    : "text-[var(--color-on-surface-variant)]",
                ].join(" ")}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-[var(--color-outline-variant)] pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="font-body text-[10px] text-[var(--color-on-surface-variant)]">
              Editorial readiness
            </span>

            <span className="font-body text-[10px] font-semibold tabular-nums text-[var(--color-on-surface)]">
              {completedCount}/{checks.length}
            </span>
          </div>

          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[var(--color-outline-variant)]">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
              style={{
                width: `${(completedCount / checks.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditorialTips;
