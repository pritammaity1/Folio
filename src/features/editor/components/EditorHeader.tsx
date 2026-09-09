import { Icon } from "../../../components/ui/Icon/Icon";

interface EditorHeaderProps {
  saveState: "idle" | "saving" | "saved" | "error";
  disabled?: boolean;
  onPreview: () => void;
  onSaveDraft: () => void;
  onMore: () => void;
}

function getSaveLabel(saveState: EditorHeaderProps["saveState"]) {
  switch (saveState) {
    case "saving":
      return "Saving...";
    case "saved":
      return "Saved just now";
    case "error":
      return "Save failed";
    default:
      return "Unsaved changes";
  }
}

function EditorHeader({
  saveState,
  disabled = false,
  onPreview,
  onSaveDraft,
  onMore,
}: EditorHeaderProps) {
  const saveLabel = getSaveLabel(saveState);

  return (
    <header className="border-b border-[var(--color-outline-variant)] bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-[var(--canvas-width)] items-center justify-between gap-6 px-[var(--content-padding)] py-5 lg:py-6">
        <div className="min-w-0">
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
            New Post
          </p>

          <h1 className="mt-1 font-display text-[30px] leading-tight tracking-[-0.025em] text-[var(--color-on-surface)] sm:text-[34px]">
            New story
          </h1>

          <p className="mt-1.5 max-w-[520px] font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
            Write, refine and share your story with the world.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <div
            className={[
              "hidden items-center gap-2 px-2 sm:flex",
              "font-body text-[10px]",
              saveState === "error"
                ? "text-[var(--color-error)]"
                : "text-[var(--color-on-surface-variant)]",
            ].join(" ")}
            aria-live="polite"
          >
            {saveState === "saved" && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-success)]">
                <Icon name="check-circle" size={12} strokeWidth={2} />
              </span>
            )}

            {saveState === "saving" && (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-primary)]" />
            )}

            {saveState === "error" && (
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-error)]" />
            )}

            <span>{saveLabel}</span>
          </div>

          <button
            type="button"
            onClick={onMore}
            disabled={disabled}
            aria-label="More options"
            title="More options"
            className={[
              "flex h-9 w-9 items-center justify-center rounded-[6px]",
              "text-[var(--color-on-surface-variant)]",
              "transition-[background-color,color]",
              "duration-[var(--motion-fast)]",
              "hover:bg-[var(--color-surface-container-low)]",
              "hover:text-[var(--color-on-surface)]",
              "focus-visible:outline-2",
              "focus-visible:outline-[var(--color-primary)]",
              "focus-visible:outline-offset-2",
              "disabled:pointer-events-none disabled:opacity-40",
            ].join(" ")}
          >
            <Icon name="more-horizontal" size={18} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            onClick={onPreview}
            disabled={disabled}
            className={[
              "hidden h-10 items-center justify-center gap-2 rounded-[6px]",
              "border border-[var(--color-outline)]",
              "bg-[var(--color-surface)]",
              "px-3.5",
              "font-body text-[11px] font-semibold",
              "text-[var(--color-on-surface)]",
              "shadow-[var(--shadow-xs)]",
              "transition-[background-color,border-color,color,transform]",
              "duration-[var(--motion-fast)]",
              "ease-[var(--ease-standard)]",
              "hover:border-[var(--color-primary)]",
              "hover:bg-[var(--color-surface-container-low)]",
              "hover:text-[var(--color-primary)]",
              "active:translate-y-px",
              "focus-visible:outline-2",
              "focus-visible:outline-[var(--color-primary)]",
              "focus-visible:outline-offset-2",
              "disabled:pointer-events-none disabled:opacity-40",
              "md:inline-flex",
            ].join(" ")}
          >
            <Icon name="eye" size={15} strokeWidth={1.8} />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            disabled={disabled || saveState === "saving"}
            className={[
              "inline-flex h-10 items-center justify-center gap-2 rounded-[6px]",
              "bg-[var(--color-primary)]",
              "px-4",
              "font-body text-[11px] font-semibold",
              "text-[var(--color-on-primary)]",
              "shadow-[var(--shadow-xs)]",
              "transition-[background-color,transform,box-shadow]",
              "duration-[var(--motion-fast)]",
              "ease-[var(--ease-standard)]",
              "hover:bg-[var(--color-primary-container)]",
              "hover:shadow-[var(--shadow-sm)]",
              "active:translate-y-px",
              "focus-visible:outline-2",
              "focus-visible:outline-[var(--color-primary)]",
              "focus-visible:outline-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
            ].join(" ")}
          >
            <Icon name="save" size={15} strokeWidth={1.9} />
            <span>{saveState === "saving" ? "Saving..." : "Save Draft"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default EditorHeader;
