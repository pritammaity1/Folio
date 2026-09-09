import { useState } from "react";
import { Icon } from "../../../components/ui/Icon/Icon";

interface StoryDetailsPanelProps {
  authorName: string;
  tags: string[];
  updatedLabel?: string;
  disabled?: boolean;
  onTagsChange: (tags: string[]) => void;
}

function StoryDetailsPanel({
  authorName,
  tags,
  updatedLabel = "Just now",
  disabled = false,
  onTagsChange,
}: StoryDetailsPanelProps) {
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const normalized = tagInput.trim().toLowerCase();

    if (!normalized) {
      return;
    }

    if (tags.includes(normalized)) {
      setTagInput("");
      return;
    }

    onTagsChange([...tags, normalized]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    onTagsChange(tags.filter((item) => item !== tag));
  }

  function handleTagKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }

    if (event.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

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
          Story Details
        </p>

        <p className="mt-1.5 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
          Keep the story organised and easy to discover.
        </p>
      </div>

      <div className="px-5 py-5">
        <div>
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
            Author
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] font-display text-[15px] font-semibold text-[var(--color-on-surface)]">
              {authorName.trim().charAt(0).toUpperCase() || "A"}
            </div>

            <div className="min-w-0">
              <p className="truncate font-body text-[12px] font-semibold text-[var(--color-on-surface)]">
                {authorName || "Author"}
              </p>

              <p className="mt-0.5 font-body text-[10px] text-[var(--color-on-surface-variant)]">
                Story author
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--color-outline-variant)] pt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
              Tags
            </p>

            <span className="font-body text-[10px] text-[var(--color-on-surface-variant)]">
              {tags.length}/8
            </span>
          </div>

          <div
            className={[
              "mt-3 min-h-[44px] rounded-[6px]",
              "border border-[var(--color-outline-variant)]",
              "bg-[var(--color-background)]",
              "px-2.5 py-2",
              "transition-[border-color,box-shadow]",
              "duration-[var(--motion-fast)]",
              "focus-within:border-[var(--color-primary)]",
              "focus-within:shadow-[0_0_0_3px_rgba(154,65,17,0.06)]",
            ].join(" ")}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={[
                    "inline-flex max-w-full items-center gap-1",
                    "rounded-full",
                    "bg-[var(--color-surface-container-low)]",
                    "px-2.5 py-1.5",
                    "font-body text-[10px] font-medium",
                    "text-[var(--color-on-surface)]",
                  ].join(" ")}
                >
                  <span className="truncate">#{tag}</span>

                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    disabled={disabled}
                    aria-label={`Remove ${tag} tag`}
                    title={`Remove ${tag} tag`}
                    className={[
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full",
                      "text-[var(--color-on-surface-variant)]",
                      "transition-colors duration-[var(--motion-fast)]",
                      "hover:text-[var(--color-primary)]",
                      "disabled:pointer-events-none disabled:opacity-40",
                    ].join(" ")}
                  >
                    <Icon name="x" size={10} strokeWidth={2} />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={tagInput}
                maxLength={30}
                disabled={disabled || tags.length >= 8}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                placeholder={
                  tags.length >= 8 ? "Tag limit reached" : "Add a tag..."
                }
                className={[
                  "min-w-[90px] flex-1 border-0 bg-transparent p-1",
                  "font-body text-[11px]",
                  "text-[var(--color-on-surface)]",
                  "outline-none",
                  "placeholder:text-[var(--color-outline)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
              />
            </div>
          </div>

          <p className="mt-2 font-body text-[10px] leading-4 text-[var(--color-on-surface-variant)]">
            Press Enter or comma to add a tag.
          </p>
        </div>

        <div className="mt-6 border-t border-[var(--color-outline-variant)] pt-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
                Story Type
              </p>

              <p className="mt-1.5 font-body text-[11px] text-[var(--color-on-surface)]">
                Editorial
              </p>
            </div>

            <span className="rounded-full bg-[var(--color-surface-container-low)] px-2.5 py-1.5 font-body text-[10px] font-semibold text-[var(--color-on-surface-variant)]">
              Standard
            </span>
          </div>
        </div>

        <div className="mt-5 border-t border-[var(--color-outline-variant)] pt-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
                Last Updated
              </p>

              <p className="mt-1.5 font-body text-[11px] text-[var(--color-on-surface)]">
                {updatedLabel}
              </p>
            </div>

            <Icon
              name="clock"
              size={15}
              strokeWidth={1.7}
              className="text-[var(--color-on-surface-variant)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoryDetailsPanel;
