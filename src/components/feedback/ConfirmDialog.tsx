import { useEffect } from "react";
import { Icon } from "../ui/Icon/Icon";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  itemName,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }

      if (event.key === "Enter" && !loading) {
        onConfirm();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, loading, onCancel, onConfirm]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={[
        "fixed inset-0 z-[100]",
        "flex items-center justify-center",
        "bg-black/40 px-4 py-6",
        "backdrop-blur-[3px]",
      ].join(" ")}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className={[
          "w-full max-w-[460px]",
          "overflow-hidden",
          "rounded-[var(--radius-md)]",
          "border border-[var(--color-outline-variant)]",
          "bg-[var(--color-surface)]",
          "shadow-[var(--shadow-lg)]",
        ].join(" ")}
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center",
                  "rounded-full",
                  "bg-red-50",
                  "text-red-600",
                ].join(" ")}
              >
                <Icon name="x" size={19} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <h2
                  id="confirm-dialog-title"
                  className={[
                    "font-display text-[24px] leading-[1.15]",
                    "tracking-[-0.02em]",
                    "text-[var(--color-on-surface)]",
                  ].join(" ")}
                >
                  {title}
                </h2>

                <p
                  id="confirm-dialog-description"
                  className={[
                    "mt-2",
                    "font-body text-[13px] leading-5",
                    "text-[var(--color-on-surface-variant)]",
                  ].join(" ")}
                >
                  {description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              aria-label="Close dialog"
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center",
                "rounded-full",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface-container-low)]",
                "hover:text-[var(--color-on-surface)]",
                "disabled:cursor-not-allowed disabled:opacity-40",
                "focus-visible:outline-2",
                "focus-visible:outline-[var(--color-primary)]",
                "focus-visible:outline-offset-2",
              ].join(" ")}
            >
              <Icon name="x" size={16} strokeWidth={1.9} />
            </button>
          </div>

          {itemName && (
            <div
              className={[
                "mt-5",
                "rounded-[var(--radius-sm)]",
                "border border-[var(--color-outline-variant)]",
                "bg-[var(--color-surface-container-low)]",
                "px-4 py-3",
              ].join(" ")}
            >
              <p
                className="truncate font-body text-[12px] font-semibold text-[var(--color-on-surface)]"
                title={itemName}
              >
                {itemName}
              </p>
            </div>
          )}

          <div
            className={[
              "mt-4",
              "rounded-[var(--radius-sm)]",
              "border border-red-200",
              "bg-red-50",
              "px-4 py-3",
            ].join(" ")}
          >
            <p className="font-body text-[11px] leading-5 text-red-700">
              This action permanently removes the asset and cannot be undone.
            </p>
          </div>
        </div>

        <div
          className={[
            "flex flex-col-reverse gap-2",
            "border-t border-[var(--color-outline-variant)]",
            "bg-[var(--color-surface-container-low)]",
            "p-4 sm:flex-row sm:justify-end",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={[
              "inline-flex h-10 items-center justify-center",
              "rounded-[var(--radius-sm)]",
              "border border-[var(--color-outline-variant)]",
              "bg-[var(--color-surface)]",
              "px-4",
              "font-body text-[12px] font-semibold",
              "text-[var(--color-on-surface)]",
              "transition-[background-color,border-color]",
              "duration-[var(--motion-fast)]",
              "hover:border-[var(--color-primary)]/30",
              "hover:bg-[var(--color-surface-container-low)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:outline-2",
              "focus-visible:outline-[var(--color-primary)]",
              "focus-visible:outline-offset-2",
            ].join(" ")}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={[
              "inline-flex h-10 min-w-[118px] items-center justify-center gap-2",
              "rounded-[var(--radius-sm)]",
              "bg-red-600",
              "px-4",
              "font-body text-[12px] font-semibold",
              "text-white",
              "transition-[background-color,transform]",
              "duration-[var(--motion-fast)]",
              "hover:bg-red-700",
              "active:bg-red-800",
              "active:translate-y-px",
              "disabled:cursor-not-allowed disabled:bg-red-300",
              "focus-visible:outline-2",
              "focus-visible:outline-red-600",
              "focus-visible:outline-offset-2",
            ].join(" ")}
          >
            {loading && (
              <span
                className={[
                  "h-3.5 w-3.5 animate-spin",
                  "rounded-full border-2",
                  "border-white/30",
                  "border-t-white",
                ].join(" ")}
                aria-hidden="true"
              />
            )}

            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
