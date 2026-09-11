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
        <div className="space-y-2.5">
          {/* Save Draft */}
          <button
            type="button"
            disabled={disabled || saving}
            onClick={onSaveDraft}
            className={[
              "group relative flex h-12 w-full items-center justify-center gap-2.5",
              "rounded-[7px]",
              "border border-[#e2e2e6]",
              "!bg-white",
              "!text-[#242428]",
              "font-body text-[13px] font-semibold",
              "shadow-[0_2px_5px_rgba(35,35,45,0.05)]",
              "transition-[background-color,border-color,box-shadow,transform]",
              "duration-200 ease-out",
              "hover:border-[#d7d7dc]",
              "hover:!bg-[#fafafa]",
              "hover:shadow-[0_4px_12px_rgba(35,35,45,0.08)]",
              "active:translate-y-px",
              "disabled:pointer-events-none disabled:opacity-50",
            ].join(" ")}
          >
            <Icon
              name="save"
              size={17}
              strokeWidth={1.8}
              className="text-[#35353a] transition-transform duration-200 group-hover:scale-[1.04]"
            />

            <span>{saving ? "Saving..." : "Save Draft"}</span>
          </button>

          {/* Publish Story */}
          <button
            type="button"
            disabled={disabled || saving}
            onClick={onPublish}
            className={[
              "group relative flex h-12 w-full items-center justify-center gap-2.5",
              "rounded-[7px]",
              "!bg-[#9A4111]",
              "!text-white",
              "font-body text-[13px] font-semibold",
              "shadow-[0_4px_10px_rgba(154,65,17,0.18)]",
              "transition-[background-color,box-shadow,transform]",
              "duration-200 ease-out",
              "hover:!bg-[#8A3A0F]",
              "hover:shadow-[0_6px_16px_rgba(154,65,17,0.24)]",
              "active:translate-y-px",
              "disabled:pointer-events-none disabled:opacity-50",
            ].join(" ")}
          >
            <Icon
              name="send"
              size={17}
              strokeWidth={1.8}
              className="text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />

            <span>{saving ? "Publishing..." : "Publish Story"}</span>

            <Icon
              name="arrow-right"
              size={15}
              strokeWidth={1.8}
              className="
                ml-0.5
                text-white
                transition-transform
                duration-200
                group-hover:translate-x-0.5
              "
            />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PublishPanel;
