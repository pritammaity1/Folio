import { useEffect } from "react";
import { Icon } from "../ui/Icon/Icon";

export type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  open: boolean;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
}

function getVariantStyles(variant: ToastVariant) {
  if (variant === "error") {
    return {
      icon: "x" as const,
      iconClass: "bg-red-50 text-red-600",
      accentClass: "border-red-200",
    };
  }

  if (variant === "info") {
    return {
      icon: "activity" as const,
      iconClass: "bg-[var(--color-primary)]/8 text-[var(--color-primary)]",
      accentClass: "border-[var(--color-primary)]/20",
    };
  }

  return {
    icon: "check-circle" as const,
    iconClass: "bg-emerald-50 text-emerald-600",
    accentClass: "border-emerald-200",
  };
}

export function Toast({
  open,
  message,
  variant = "success",
  duration = 3500,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, duration, onClose]);

  if (!open) {
    return null;
  }

  const styles = getVariantStyles(variant);

  return (
    <div
      className={[
        "fixed bottom-5 right-5 z-[120]",
        "w-[min(380px,calc(100vw-2rem))]",
        "overflow-hidden",
        "rounded-[var(--radius-md)]",
        "border",
        styles.accentClass,
        "bg-[var(--color-surface)]",
        "shadow-[var(--shadow-lg)]",
        "animate-[toast-in_180ms_ease-out]",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center",
            "rounded-full",
            styles.iconClass,
          ].join(" ")}
        >
          <Icon name={styles.icon} size={16} strokeWidth={1.9} />
        </div>

        <p className="min-w-0 flex-1 font-body text-[12px] font-semibold text-[var(--color-on-surface)]">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center",
            "rounded-full",
            "text-[var(--color-on-surface-variant)]",
            "transition-[background-color,color]",
            "duration-[var(--motion-fast)]",
            "hover:bg-[var(--color-surface-container-low)]",
            "hover:text-[var(--color-on-surface)]",
            "focus-visible:outline-2",
            "focus-visible:outline-[var(--color-primary)]",
            "focus-visible:outline-offset-2",
          ].join(" ")}
        >
          <Icon name="x" size={14} strokeWidth={1.9} />
        </button>
      </div>
    </div>
  );
}

export default Toast;
