import { Icon } from "../../../components/ui/Icon/Icon";

interface PublishPanelProps {
  saving: boolean;
  disabled?: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

function PublishPanel({
  saving,
  disabled = false,
  onSaveDraft,
  onPublish,
}: PublishPanelProps) {
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
          Publish
        </p>

        <p className="mt-1.5 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
          Control how your story reaches readers.
        </p>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
              Visibility
            </p>

            <p className="mt-1.5 font-body text-[11px] text-[var(--color-on-surface)]">
              Private
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9a4111]/8 px-2.5 py-1.5 font-body text-[10px] font-semibold text-[#9a4111]">
            <Icon name="lock" size={12} strokeWidth={1.8} />
            Private
          </span>
        </div>

        <div className="mt-6 border-t border-[var(--color-outline-variant)] pt-5">
          <div className="space-y-2.5">
            <button
              type="button"
              disabled={disabled || saving}
              onClick={onSaveDraft}
              className={[
                "flex h-11 w-full items-center justify-center gap-2",
                "rounded-[7px]",
                "bg-[#9A4111]",
                "font-body text-[13px] font-semibold text-white",
                "shadow-[0_2px_6px_rgba(154,65,17,0.14)]",
                "transition-[background-color,box-shadow,transform]",
                "duration-200 ease-out",
                "hover:bg-[#8A3A0F]",
                "hover:shadow-[0_5px_14px_rgba(154,65,17,0.2)]",
                "active:translate-y-px",
                "disabled:pointer-events-none disabled:opacity-50",
              ].join(" ")}
            >
              <Icon name="save" size={16} strokeWidth={1.9} />
              <span>{saving ? "Saving..." : "Save Draft"}</span>
            </button>

            <button
              type="button"
              disabled={disabled || saving}
              onClick={onPublish}
              className={[
                "flex h-11 w-full items-center justify-center gap-2",
                "rounded-[7px]",
                "bg-[#9A4111]",
                "font-body text-[13px] font-semibold text-white",
                "shadow-[0_2px_6px_rgba(154,65,17,0.14)]",
                "transition-[background-color,box-shadow,transform]",
                "duration-200 ease-out",
                "hover:bg-[#8A3A0F]",
                "hover:shadow-[0_5px_14px_rgba(154,65,17,0.2)]",
                "active:translate-y-px",
                "disabled:pointer-events-none disabled:opacity-50",
              ].join(" ")}
            >
              <Icon name="send" size={16} strokeWidth={1.9} />
              <span>{saving ? "Publishing..." : "Publish Story"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublishPanel;
