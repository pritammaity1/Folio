import { useEffect, useRef, useState } from "react";
import { Icon } from "../../../components/ui/Icon/Icon";

interface StoryEditorProps {
  content: string;
  wordCount: number;
  readingTime: number;
  disabled?: boolean;
  onChange: (value: string) => void;
}

type BlockFormat = "p" | "h2" | "h3" | "blockquote";

const blockOptions: Array<{
  value: BlockFormat;
  label: string;
}> = [
  {
    value: "p",
    label: "Paragraph",
  },
  {
    value: "h2",
    label: "Heading",
  },
  {
    value: "h3",
    label: "Subheading",
  },
  {
    value: "blockquote",
    label: "Quote",
  },
];

function StoryEditor({
  content,
  wordCount,
  readingTime,
  disabled = false,
  onChange,
}: StoryEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [blockFormat, setBlockFormat] = useState<BlockFormat>("p");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor || isFocused) {
      return;
    }

    if (editor.innerHTML !== content) {
      editor.innerHTML = content;
    }
  }, [content, isFocused]);

  function emitChange() {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    onChange(editor.innerHTML);
  }

  function runCommand(
    command:
      | "bold"
      | "italic"
      | "insertUnorderedList"
      | "insertOrderedList"
      | "undo"
      | "redo",
  ) {
    if (disabled) {
      return;
    }

    editorRef.current?.focus();

    document.execCommand(command, false);

    emitChange();
  }

  function applyBlockFormat(format: BlockFormat) {
    if (disabled) {
      return;
    }

    editorRef.current?.focus();

    document.execCommand("formatBlock", false, format);

    setBlockFormat(format);
    emitChange();
  }

  function handleEditorInput() {
    emitChange();
  }

  function handleEditorKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) {
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      document.execCommand("insertText", false, "    ");
      emitChange();
    }
  }

  function handleFormatChange(event: React.ChangeEvent<HTMLSelectElement>) {
    applyBlockFormat(event.target.value as BlockFormat);
  }

  return (
    <section className="mt-10 border-t border-[var(--color-outline-variant)] pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />

            <p className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-on-surface)]">
              Story
            </p>
          </div>

          <p className="mt-2 max-w-[620px] font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
            Bring your ideas to life. Format your story naturally as you write.
          </p>
        </div>

        <div className="flex items-center gap-2 font-body text-[10px] tabular-nums text-[var(--color-on-surface-variant)]">
          <span>{wordCount.toLocaleString()} words</span>

          <span className="h-3.5 w-px bg-[var(--color-outline-variant)]" />

          <span>{readingTime} min read</span>
        </div>
      </div>

      <div
        className={[
          "mt-6 overflow-hidden rounded-[8px]",
          "border border-[var(--color-outline-variant)]",
          "bg-[var(--color-surface)]",
          "transition-[border-color,box-shadow]",
          "duration-[var(--motion-fast)]",
          isFocused
            ? [
                "border-[var(--color-primary)]",
                "shadow-[0_0_0_3px_rgba(154,65,17,0.06)]",
              ].join(" ")
            : "",
        ].join(" ")}
      >
        <div
          className={[
            "sticky top-0 z-10",
            "border-b border-[var(--color-outline-variant)]",
            "bg-[var(--color-surface-container-low)]",
            "px-2.5 py-2",
          ].join(" ")}
        >
          <div className="flex flex-wrap items-center gap-1">
            <div className="relative">
              <select
                value={blockFormat}
                onChange={handleFormatChange}
                disabled={disabled}
                aria-label="Text style"
                className={[
                  "h-8 min-w-[108px] appearance-none",
                  "rounded-[5px]",
                  "border-0 bg-transparent",
                  "pl-2.5 pr-7",
                  "font-body text-[11px] font-medium",
                  "text-[var(--color-on-surface)]",
                  "outline-none",
                  "transition-colors duration-[var(--motion-fast)]",
                  "hover:bg-[var(--color-surface)]",
                  "disabled:pointer-events-none disabled:opacity-40",
                ].join(" ")}
              >
                {blockOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Icon
                name="chevron-down"
                size={12}
                strokeWidth={1.8}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
              />
            </div>

            <span className="mx-1 h-5 w-px bg-[var(--color-outline-variant)]" />

            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("bold")}
              disabled={disabled}
              aria-label="Bold"
              title="Bold"
              className={[
                "flex h-8 w-8 items-center justify-center rounded-[5px]",
                "font-display text-[15px] font-bold",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface)]",
                "hover:text-[var(--color-on-surface)]",
                "disabled:pointer-events-none disabled:opacity-40",
              ].join(" ")}
            >
              B
            </button>

            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("italic")}
              disabled={disabled}
              aria-label="Italic"
              title="Italic"
              className={[
                "flex h-8 w-8 items-center justify-center rounded-[5px]",
                "font-display text-[15px] italic",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface)]",
                "hover:text-[var(--color-on-surface)]",
                "disabled:pointer-events-none disabled:opacity-40",
              ].join(" ")}
            >
              I
            </button>

            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              disabled={disabled}
              aria-label="Insert link"
              title="Insert link"
              className={[
                "flex h-8 w-8 items-center justify-center rounded-[5px]",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface)]",
                "hover:text-[var(--color-on-surface)]",
                "disabled:pointer-events-none disabled:opacity-40",
              ].join(" ")}
            >
              <Icon name="link" size={15} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              disabled={disabled}
              aria-label="Insert image"
              title="Insert image"
              className={[
                "flex h-8 w-8 items-center justify-center rounded-[5px]",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface)]",
                "hover:text-[var(--color-on-surface)]",
                "disabled:pointer-events-none disabled:opacity-40",
              ].join(" ")}
            >
              <Icon name="image" size={15} strokeWidth={1.8} />
            </button>

            <span className="mx-1 h-5 w-px bg-[var(--color-outline-variant)]" />

            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              disabled={disabled}
              aria-label="Block quote"
              title="Block quote"
              onClick={() => applyBlockFormat("blockquote")}
              className={[
                "flex h-8 w-8 items-center justify-center rounded-[5px]",
                "font-display text-[17px]",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface)]",
                "hover:text-[var(--color-on-surface)]",
                "disabled:pointer-events-none disabled:opacity-40",
              ].join(" ")}
            >
              “
            </button>

            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("insertUnorderedList")}
              disabled={disabled}
              aria-label="Bulleted list"
              title="Bulleted list"
              className={[
                "flex h-8 w-8 items-center justify-center rounded-[5px]",
                "font-body text-[15px] font-semibold",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface)]",
                "hover:text-[var(--color-on-surface)]",
                "disabled:pointer-events-none disabled:opacity-40",
              ].join(" ")}
            >
              •
            </button>

            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("insertOrderedList")}
              disabled={disabled}
              aria-label="Numbered list"
              title="Numbered list"
              className={[
                "flex h-8 w-8 items-center justify-center rounded-[5px]",
                "font-mono text-[10px]",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface)]",
                "hover:text-[var(--color-on-surface)]",
                "disabled:pointer-events-none disabled:opacity-40",
              ].join(" ")}
            >
              1.
            </button>

            <span className="mx-1 h-5 w-px bg-[var(--color-outline-variant)]" />

            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("undo")}
              disabled={disabled}
              aria-label="Undo"
              title="Undo"
              className={[
                "flex h-8 w-8 items-center justify-center rounded-[5px]",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface)]",
                "hover:text-[var(--color-on-surface)]",
                "disabled:pointer-events-none disabled:opacity-40",
              ].join(" ")}
            >
              ↶
            </button>

            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("redo")}
              disabled={disabled}
              aria-label="Redo"
              title="Redo"
              className={[
                "flex h-8 w-8 items-center justify-center rounded-[5px]",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface)]",
                "hover:text-[var(--color-on-surface)]",
                "disabled:pointer-events-none disabled:opacity-40",
              ].join(" ")}
            >
              ↷
            </button>
          </div>
        </div>

        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Story body"
          data-placeholder="Begin your story..."
          onInput={handleEditorInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleEditorKeyDown}
          className={[
            "min-h-[520px] outline-none",
            "px-6 py-8 sm:px-8 sm:py-10",
            "font-display text-[19px] leading-[1.82]",
            "text-[var(--color-on-surface)]",
            "[&_p]:m-0 [&_p]:mb-5",
            "[&_h2]:mb-5 [&_h2]:font-display [&_h2]:text-[30px] [&_h2]:font-semibold [&_h2]:leading-[1.2]",
            "[&_h3]:mb-4 [&_h3]:font-display [&_h3]:text-[24px] [&_h3]:font-semibold [&_h3]:leading-[1.3]",
            "[&_blockquote]:my-7 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-primary)] [&_blockquote]:pl-5 [&_blockquote]:font-display [&_blockquote]:text-[22px] [&_blockquote]:italic [&_blockquote]:leading-[1.5] [&_blockquote]:text-[var(--color-on-surface-variant)]",
            "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-7",
            "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-7",
            "[&_li]:mb-2",
            "[&_a]:text-[var(--color-primary)] [&_a]:underline [&_a]:underline-offset-2",
            "empty:before:pointer-events-none empty:before:float-left empty:before:h-0 empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--color-outline)]",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-text",
          ].join(" ")}
        />
      </div>
    </section>
  );
}

export default StoryEditor;
