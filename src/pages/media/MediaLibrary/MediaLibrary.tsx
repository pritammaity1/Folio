import { useCallback, useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../../../components/feedback/ConfirmDialog";
import Toast, { type ToastVariant } from "../../../components/feedback/Toast";
import { Icon } from "../../../components/ui/Icon/Icon";
import {
  MediaFilter,
  type MediaFilterType,
  type MediaSortOption,
} from "../../../features/media/components/MediaFilter";
import { MediaGrid } from "../../../features/media/components/MediaGrid";
import { MediaPreview } from "../../../features/media/components/MediaPreview";
import { MediaUploader } from "../../../features/media/components/MediaUploader";
import { getMediaAssets } from "../../../features/media/services/mediaServices";
import { deleteMedia } from "../../../services/api/media";
import type { MediaAsset } from "../../../types/media";

function MediaLibrary() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<MediaFilterType>("images");
  const [sort, setSort] = useState<MediaSortOption>("newest");

  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    variant: ToastVariant;
  }>({
    open: false,
    message: "",
    variant: "success",
  });

  const loadMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const assets = await getMediaAssets();
      setMedia(assets);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Unable to load the media library.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const filteredMedia = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = media.filter((asset) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        asset.fileName.toLowerCase().includes(normalizedSearch);

      const matchesType = type === "all" || asset.mimeType.startsWith("image/");

      return matchesSearch && matchesType;
    });

    return [...filtered].sort((first, second) => {
      if (sort === "name") {
        return first.fileName.localeCompare(second.fileName);
      }

      const firstTime = first.createdAt.toMillis();
      const secondTime = second.createdAt.toMillis();

      return sort === "newest"
        ? secondTime - firstTime
        : firstTime - secondTime;
    });
  }, [media, search, type, sort]);

  const imageCount = useMemo(
    () => media.filter((asset) => asset.mimeType.startsWith("image/")).length,
    [media],
  );

  const unusedCount = useMemo(
    () => media.filter((asset) => asset.usageCount === 0).length,
    [media],
  );

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      setToast({
        open: true,
        message,
        variant,
      });
    },
    [],
  );

  const closeToast = useCallback(() => {
    setToast((current) => ({
      ...current,
      open: false,
    }));
  }, []);

  const handleUploaded = useCallback(async () => {
    setIsUploaderOpen(false);
    await loadMedia();
    showToast("Media asset uploaded successfully.", "success");
  }, [loadMedia, showToast]);

  const handlePreview = useCallback((asset: MediaAsset) => {
    setError(null);
    setSelectedMedia(asset);
  }, []);

  const handleClosePreview = useCallback(() => {
    if (isDeleting) {
      return;
    }

    setSelectedMedia(null);
  }, [isDeleting]);

  const handleRequestDelete = useCallback((asset: MediaAsset) => {
    setDeleteTarget(asset);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  }, [isDeleting]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      await deleteMedia(deleteTarget.id);

      setMedia((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );

      setSelectedMedia((current) =>
        current?.id === deleteTarget.id ? null : current,
      );

      setDeleteTarget(null);

      showToast("Media asset deleted successfully.", "success");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the media asset.";

      setError(message);
      setDeleteTarget(null);

      showToast(message, "error");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, showToast]);

  if (isLoading) {
    return (
      <main className="min-w-0 bg-[var(--color-background)]">
        <div className="mx-auto w-full max-w-[var(--canvas-width)] px-5 py-7 sm:px-7 lg:px-9">
          <div className="animate-pulse">
            <div className="h-3 w-28 rounded-full bg-[var(--color-surface-container)]" />

            <div className="mt-4 h-12 w-[360px] max-w-full rounded-[var(--radius-sm)] bg-[var(--color-surface-container)]" />

            <div className="mt-3 h-4 w-[520px] max-w-full rounded-full bg-[var(--color-surface-container)]" />

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={[
                    "h-[92px]",
                    "rounded-[var(--radius-md)]",
                    "border border-[var(--color-outline-variant)]",
                    "bg-[var(--color-surface)]",
                  ].join(" ")}
                />
              ))}
            </div>

            <div
              className={[
                "mt-7 h-[72px]",
                "rounded-[var(--radius-md)]",
                "border border-[var(--color-outline-variant)]",
                "bg-[var(--color-surface)]",
              ].join(" ")}
            />

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className={[
                    "overflow-hidden",
                    "rounded-[var(--radius-md)]",
                    "border border-[var(--color-outline-variant)]",
                    "bg-[var(--color-surface)]",
                  ].join(" ")}
                >
                  <div className="aspect-[4/3] bg-[var(--color-surface-container)]" />

                  <div className="space-y-3 p-4">
                    <div className="h-3 w-3/4 rounded-full bg-[var(--color-surface-container)]" />
                    <div className="h-3 w-1/2 rounded-full bg-[var(--color-surface-container)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-[var(--canvas-width)] px-5 py-7 sm:px-7 lg:px-9">
        <section
          className={[
            "relative overflow-hidden",
            "rounded-[var(--radius-lg)]",
            "border border-[var(--color-outline-variant)]",
            "bg-[var(--color-surface)]",
            "shadow-[var(--shadow-xs)]",
          ].join(" ")}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-[var(--color-primary)]/40" />

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0 max-w-[720px]">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />

                  <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                    Editorial asset room
                  </p>
                </div>

                <h1
                  className={[
                    "mt-4",
                    "font-display text-[44px] leading-[0.98]",
                    "tracking-[-0.04em]",
                    "text-[var(--color-on-surface)]",
                    "sm:text-[54px]",
                    "lg:text-[60px]",
                  ].join(" ")}
                >
                  Media Library
                </h1>

                <p
                  className={[
                    "mt-4 max-w-[620px]",
                    "font-body text-[14px] leading-6",
                    "text-[var(--color-on-surface-variant)]",
                    "sm:text-[15px]",
                  ].join(" ")}
                >
                  A quiet home for the images behind your stories. Keep
                  editorial assets organized, reusable, and easy to reference.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsUploaderOpen((current) => !current)}
                className={[
                  "inline-flex w-fit shrink-0 items-center justify-center gap-2.5",
                  "rounded-[var(--radius-sm)]",
                  "!bg-[var(--color-primary)]",
                  "px-4 py-2.5",
                  "font-body text-[12px] font-semibold",
                  "!text-[var(--color-on-primary)]",
                  "shadow-[var(--shadow-sm)]",
                  "transition-[background-color,transform,box-shadow]",
                  "duration-[var(--motion-fast)]",
                  "hover:!bg-[var(--color-primary-container)]",
                  "hover:shadow-[var(--shadow-md)]",
                  "active:translate-y-px",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[var(--color-primary)]",
                  "focus-visible:outline-offset-2",
                ].join(" ")}
              >
                <Icon
                  name={isUploaderOpen ? "x" : "plus"}
                  size={15}
                  strokeWidth={2}
                />

                <span>
                  {isUploaderOpen ? "Close uploader" : "Upload image"}
                </span>
              </button>
            </div>

            <div className="mt-9 grid grid-cols-1 border-t border-[var(--color-outline-variant)] pt-6 sm:grid-cols-3">
              <div className="border-b border-[var(--color-outline-variant)] pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                  Total assets
                </p>

                <div className="mt-2 flex items-end justify-between gap-4">
                  <p className="font-display text-[34px] leading-none tracking-[-0.03em] text-[var(--color-on-surface)]">
                    {media.length}
                  </p>

                  <span className="mb-0.5 font-body text-[11px] text-[var(--color-on-surface-variant)]">
                    library
                  </span>
                </div>
              </div>

              <div className="border-b border-[var(--color-outline-variant)] py-5 sm:border-b-0 sm:border-r sm:px-6 sm:py-0">
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                  Images
                </p>

                <div className="mt-2 flex items-end justify-between gap-4">
                  <p className="font-display text-[34px] leading-none tracking-[-0.03em] text-[var(--color-on-surface)]">
                    {imageCount}
                  </p>

                  <span className="mb-0.5 font-body text-[11px] text-[var(--color-on-surface-variant)]">
                    visual assets
                  </span>
                </div>
              </div>

              <div className="pt-5 sm:pl-6 sm:pt-0">
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                  Unused
                </p>

                <div className="mt-2 flex items-end justify-between gap-4">
                  <p className="font-display text-[34px] leading-none tracking-[-0.03em] text-[var(--color-on-surface)]">
                    {unusedCount}
                  </p>

                  <span className="mb-0.5 font-body text-[11px] text-[var(--color-on-surface-variant)]">
                    available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {isUploaderOpen && (
          <section className="mt-6">
            <MediaUploader onUploaded={handleUploaded} />
          </section>
        )}

        {error && (
          <section
            className={[
              "mt-6 overflow-hidden",
              "rounded-[var(--radius-md)]",
              "border border-[var(--color-error)]/20",
              "bg-[var(--color-surface)]",
              "shadow-[var(--shadow-xs)]",
            ].join(" ")}
            role="alert"
          >
            <div className="flex items-start gap-4 p-5">
              <div
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center",
                  "rounded-full",
                  "bg-[var(--color-error)]/8",
                  "text-[var(--color-error)]",
                ].join(" ")}
              >
                <Icon name="activity" size={16} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="font-body text-[12px] font-semibold text-[var(--color-error)]">
                  Unable to load media
                </p>

                <p className="mt-1 max-w-[760px] font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void loadMedia()}
                  className={[
                    "mt-3",
                    "font-body text-[11px] font-semibold",
                    "text-[var(--color-primary)]",
                    "underline decoration-[var(--color-primary)]/30 underline-offset-4",
                    "transition-colors",
                    "hover:text-[var(--color-primary-container)]",
                  ].join(" ")}
                >
                  Try again
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="mt-6">
          <MediaFilter
            search={search}
            type={type}
            sort={sort}
            onSearchChange={setSearch}
            onTypeChange={setType}
            onSortChange={setSort}
          />
        </section>

        <section className="mt-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                Your collection
              </p>

              <p className="mt-1 font-body text-[12px] text-[var(--color-on-surface-variant)]">
                {filteredMedia.length}{" "}
                {filteredMedia.length === 1 ? "asset" : "assets"} shown
              </p>
            </div>

            {(search.trim() || type !== "images") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setType("images");
                }}
                className={[
                  "w-fit",
                  "font-body text-[11px] font-semibold",
                  "text-[var(--color-primary)]",
                  "transition-colors",
                  "hover:text-[var(--color-primary-container)]",
                ].join(" ")}
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredMedia.length === 0 &&
          media.length > 0 &&
          (search.trim() || type !== "images") ? (
            <div
              className={[
                "flex min-h-[320px] flex-col items-center justify-center",
                "rounded-[var(--radius-lg)]",
                "border border-dashed border-[var(--color-outline-variant)]",
                "bg-[var(--color-surface)]",
                "px-6 py-14 text-center",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-12 w-12 items-center justify-center",
                  "rounded-full",
                  "bg-[var(--color-surface-container-low)]",
                  "text-[var(--color-primary)]",
                ].join(" ")}
              >
                <Icon name="search" size={20} strokeWidth={1.7} />
              </div>

              <h2
                className={[
                  "mt-4",
                  "font-display text-[24px]",
                  "tracking-[-0.02em]",
                  "text-[var(--color-on-surface)]",
                ].join(" ")}
              >
                Nothing matched your search
              </h2>

              <p className="mt-2 max-w-[420px] font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
                Try a different filename or clear the active filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setType("images");
                }}
                className={[
                  "mt-5",
                  "rounded-[var(--radius-sm)]",
                  "border border-[var(--color-outline-variant)]",
                  "px-3.5 py-2",
                  "font-body text-[11px] font-semibold",
                  "text-[var(--color-on-surface)]",
                  "transition-[background-color,border-color]",
                  "duration-[var(--motion-fast)]",
                  "hover:border-[var(--color-primary)]/30",
                  "hover:bg-[var(--color-surface-container-low)]",
                ].join(" ")}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <MediaGrid media={filteredMedia} onPreview={handlePreview} />
          )}
        </section>
      </div>

      <MediaPreview
        media={selectedMedia}
        onClose={handleClosePreview}
        onDelete={handleRequestDelete}
        deleting={isDeleting}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete media asset"
        description="Are you sure you want to permanently delete this media asset?"
        itemName={deleteTarget?.fileName}
        confirmLabel="Delete asset"
        cancelLabel="Cancel"
        loading={isDeleting}
        onConfirm={() => void handleDelete()}
        onCancel={handleCancelDelete}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={closeToast}
      />
    </main>
  );
}

export default MediaLibrary;
