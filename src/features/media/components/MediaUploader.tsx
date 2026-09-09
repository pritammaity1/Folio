import { useRef, useState } from "react";
import { Icon } from "../../../components/ui/Icon/Icon";
import { auth } from "../../../services/firebase/auth";
import { registerMedia } from "../../../services/api/media";
import { useUploadThing } from "../../../services/uploadthing/client";

interface MediaUploaderProps {
  onUploaded?: () => void;
}

const MAX_FILE_SIZE = 8 * 1024 * 1024;

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaUploader({ onUploaded }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    headers: async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("You must be signed in to upload media.");
      }

      const idToken = await currentUser.getIdToken();

      return {
        authorization: `Bearer ${idToken}`,
      };
    },
  });

  function validateFile(file: File) {
    if (!file.type.startsWith("image/")) {
      return "Only image files are supported.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return `The image must be smaller than ${formatFileSize(MAX_FILE_SIZE)}.`;
    }

    return null;
  }

  function selectFile(file: File) {
    setError(null);

    const validationError = validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    selectFile(file);

    event.target.value = "";
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    selectFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("You must be signed in to upload media.");
      }

      const uploadedFiles = await startUpload([selectedFile]);

      const uploadedFile = uploadedFiles?.[0];

      if (!uploadedFile) {
        throw new Error("The upload did not return a file.");
      }

      await registerMedia({
        uploadthingKey: uploadedFile.key,
        url: uploadedFile.ufsUrl ?? uploadedFile.url,
        fileName: uploadedFile.name,
        mimeType: uploadedFile.type,
        size: uploadedFile.size,
      });

      setSelectedFile(null);
      onUploaded?.();
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Something went wrong while uploading the image.";

      setError(message);
    } finally {
      setIsUploading(false);
    }
  }

  function handleCancel() {
    if (isUploading) {
      return;
    }

    setSelectedFile(null);
    setError(null);
  }

  return (
    <section
      className={[
        "rounded-[var(--radius-md)]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface)]",
        "p-5 sm:p-6",
      ].join(" ")}
    >
      <div className="flex flex-col gap-1">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Media library
        </p>

        <h2
          className={[
            "font-display text-[24px] leading-tight",
            "tracking-[-0.02em]",
            "text-[var(--color-on-surface)]",
          ].join(" ")}
        >
          Add a new image
        </h2>

        <p className="font-body text-[13px] leading-5 text-[var(--color-on-surface-variant)]">
          Upload an image to use across your stories.
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!isUploading) {
            inputRef.current?.click();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (!isUploading) {
              inputRef.current?.click();
            }
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "mt-5 flex min-h-[210px] flex-col items-center justify-center",
          "rounded-[var(--radius-sm)]",
          "border border-dashed",
          "px-6 py-10 text-center",
          "transition-[background-color,border-color]",
          "duration-[var(--motion-fast)]",
          isDragging
            ? [
                "border-[var(--color-primary)]",
                "bg-[var(--color-primary)]/5",
              ].join(" ")
            : [
                "border-[var(--color-outline)]",
                "bg-[var(--color-surface-container-low)]",
                "hover:border-[var(--color-primary)]/50",
                "hover:bg-[var(--color-surface)]",
              ].join(" "),
          isUploading ? "cursor-not-allowed opacity-70" : "cursor-pointer",
          "focus-visible:outline-2",
          "focus-visible:outline-[var(--color-primary)]",
          "focus-visible:outline-offset-2",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleInputChange}
          disabled={isUploading}
        />

        <div
          className={[
            "flex h-12 w-12 items-center justify-center",
            "rounded-full",
            "bg-[var(--color-surface)]",
            "text-[var(--color-primary)]",
            "shadow-[var(--shadow-xs)]",
          ].join(" ")}
        >
          <Icon name="upload" size={21} strokeWidth={1.7} />
        </div>

        <h3 className="mt-4 font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
          {isDragging ? "Drop the image here" : "Upload an image"}
        </h3>

        <p className="mt-1 max-w-[360px] font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
          Drag and drop an image here, or click to browse your computer.
        </p>

        <span className="mt-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
          JPG, PNG, WEBP · Maximum 8 MB
        </span>
      </div>

      {error && (
        <div
          className={[
            "mt-4 rounded-[var(--radius-sm)]",
            "border border-[var(--color-error)]/20",
            "bg-[var(--color-error)]/5",
            "px-4 py-3",
          ].join(" ")}
          role="alert"
        >
          <p className="font-body text-[12px] leading-5 text-[var(--color-error)]">
            {error}
          </p>
        </div>
      )}

      {selectedFile && (
        <div
          className={[
            "mt-4 flex flex-col gap-4",
            "rounded-[var(--radius-sm)]",
            "border border-[var(--color-outline-variant)]",
            "bg-[var(--color-surface-container-low)]",
            "p-4",
            "sm:flex-row sm:items-center sm:justify-between",
          ].join(" ")}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center",
                "rounded-[var(--radius-sm)]",
                "bg-[var(--color-surface)]",
                "text-[var(--color-primary)]",
              ].join(" ")}
            >
              <Icon name="image" size={18} strokeWidth={1.7} />
            </div>

            <div className="min-w-0">
              <p
                className="truncate font-body text-[12px] font-semibold text-[var(--color-on-surface)]"
                title={selectedFile.name}
              >
                {selectedFile.name}
              </p>

              <p className="mt-0.5 font-body text-[11px] text-[var(--color-on-surface-variant)]">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUploading}
              className={[
                "rounded-[var(--radius-sm)] px-3 py-2",
                "font-body text-[11px] font-semibold",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface)]",
                "hover:text-[var(--color-on-surface)]",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:outline-2",
                "focus-visible:outline-[var(--color-primary)]",
                "focus-visible:outline-offset-1",
              ].join(" ")}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className={[
                "inline-flex min-w-[108px] items-center justify-center gap-2",
                "rounded-[var(--radius-sm)]",
                "bg-[var(--color-primary)]",
                "px-3.5 py-2",
                "font-body text-[11px] font-semibold",
                "text-[var(--color-on-primary)]",
                "transition-[background-color,transform,box-shadow]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-primary-container)]",
                "hover:shadow-[var(--shadow-sm)]",
                "active:translate-y-px",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "focus-visible:outline-2",
                "focus-visible:outline-[var(--color-primary)]",
                "focus-visible:outline-offset-2",
              ].join(" ")}
            >
              {isUploading ? (
                <>
                  <span
                    className={[
                      "h-3.5 w-3.5 animate-spin",
                      "rounded-full border-2",
                      "border-[var(--color-on-primary)]/30",
                      "border-t-[var(--color-on-primary)]",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  Uploading
                </>
              ) : (
                <>
                  <Icon name="upload" size={14} strokeWidth={1.9} />
                  Upload image
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default MediaUploader;
