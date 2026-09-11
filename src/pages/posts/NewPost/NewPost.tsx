import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../../features/auth/hooks/useAuth";
import EditorCanvas from "../../../features/editor/components/EditorCanvas";
import EditorSideBar from "../../../features/editor/components/EditorSideBar";

import {
  countWords,
  generateSlug,
  getReadingTime,
} from "../../../features/editor/validation";

import { auth } from "../../../services/firebase/auth";
import { createPost } from "../../../services/firebase/posts";
import { registerMedia } from "../../../services/api/media";
import { useUploadThing } from "../../../services/uploadthing/client";

type EditorStatus = "draft" | "review" | "scheduled" | "published";

function NewPost() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    headers: async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("You must be signed in.");
      }

      const token = await currentUser.getIdToken();

      return {
        Authorization: `Bearer ${token}`,
      };
    },
  });

  const wordCount = useMemo(() => countWords(content), [content]);
  const readingTime = useMemo(() => getReadingTime(wordCount), [wordCount]);

  const isBusy = uploadingCover || isUploading || saving;

  const authorName =
    user?.displayName?.trim() || user?.email?.split("@")[0] || "Editor";

  const updatedLabel = hasSaved ? "Saved just now" : "Not saved yet";

  function resetEditor() {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCoverMediaId(null);
    setCoverPreviewUrl(null);
    setTags([]);
    setHasSaved(false);
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug.trim()) {
      setSlug(generateSlug(value));
    }

    setHasSaved(false);
  }

  function handleSlugChange(value: string) {
    setSlug(generateSlug(value));
    setHasSaved(false);
  }

  function handleExcerptChange(value: string) {
    setExcerpt(value);
    setHasSaved(false);
  }

  function handleContentChange(value: string) {
    setContent(value);
    setHasSaved(false);
  }

  async function uploadCover(file: File) {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("You must be signed in.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Cover image must be smaller than 8MB.");
      return;
    }

    setUploadingCover(true);

    try {
      const uploadedFiles = await startUpload([file]);

      if (!uploadedFiles?.length) {
        throw new Error("The upload completed without returning a file.");
      }

      const uploadedFile = uploadedFiles[0];
      const previewUrl = uploadedFile.ufsUrl ?? uploadedFile.url;

      if (!previewUrl) {
        throw new Error("Upload succeeded, but no image URL was returned.");
      }

      const media = await registerMedia({
        uploadthingKey: uploadedFile.key,
        url: previewUrl,
        fileName: uploadedFile.name,
        mimeType: file.type,
        size: uploadedFile.size,
      });

      setCoverMediaId(media.mediaId);
      setCoverPreviewUrl(previewUrl);
      setHasSaved(false);

      toast.success("Cover image uploaded.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Cover image upload failed.",
      );
    } finally {
      setUploadingCover(false);
    }
  }

  function handleRemoveCover() {
    setCoverMediaId(null);
    setCoverPreviewUrl(null);
    setHasSaved(false);
  }

  function validateStory(targetStatus: EditorStatus) {
    if (!title.trim()) {
      return "Write a headline first.";
    }

    if (!slug.trim()) {
      return "Add a story slug first.";
    }

    if (
      (targetStatus === "review" ||
        targetStatus === "scheduled" ||
        targetStatus === "published") &&
      !content.replace(/<[^>]*>/g, "").trim()
    ) {
      return "Add some story content before continuing.";
    }

    return null;
  }

  async function saveStory(targetStatus: EditorStatus) {
    if (!user) {
      toast.error("You must be signed in.");
      return;
    }

    const validationError = validateStory(targetStatus);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);

    try {
      const postId = await createPost({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content,
        coverMediaId,
        mediaIds: [],
        authorId: user.uid,
        categoryId: null,
        tags,
        status: targetStatus,
        publishedAt: targetStatus === "published" ? new Date() : null,
      });

      setHasSaved(true);

      if (targetStatus === "draft") {
        toast.success("Draft saved successfully.");
        navigate(`/posts/${postId}`);
        return;
      }

      if (targetStatus === "published") {
        toast.success("Story published successfully.");
        resetEditor();
        return;
      }

      toast.success("Story submitted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save the story.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="min-h-full bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-[var(--canvas-width)] px-[var(--content-padding)] py-6 lg:py-8">
        <div>
          {previewMode ? (
            <article className="mx-auto w-full max-w-[760px] overflow-hidden rounded-[10px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
              {coverPreviewUrl && (
                <img
                  src={coverPreviewUrl}
                  alt=""
                  className="aspect-[16/8.5] w-full object-cover"
                />
              )}

              <div className="px-6 py-10 sm:px-10 sm:py-14">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                  Folio
                </p>

                <h1 className="mt-5 font-display text-[clamp(42px,6vw,68px)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--color-on-surface)]">
                  {title || "Write your headline"}
                </h1>

                <p className="mt-6 font-display text-[19px] italic leading-[1.6] text-[var(--color-on-surface-variant)]">
                  {excerpt || "Write a brief introduction for readers..."}
                </p>

                <div className="mt-10 border-t border-[var(--color-outline-variant)] pt-9">
                  <div
                    className="font-display text-[18px] leading-[1.82] text-[var(--color-on-surface)]"
                    dangerouslySetInnerHTML={{
                      __html: content || "Begin your story...",
                    }}
                  />
                </div>

                {tags.length > 0 && (
                  <div className="mt-10 flex flex-wrap gap-2 border-t border-[var(--color-outline-variant)] pt-6">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[var(--color-surface-container-low)] px-3 py-1.5 font-body text-[10px] font-medium text-[var(--color-on-surface-variant)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_292px] xl:gap-8">
              <main className="min-w-0">
                <EditorCanvas
                  title={title}
                  slug={slug}
                  excerpt={excerpt}
                  content={content}
                  coverPreviewUrl={coverPreviewUrl}
                  wordCount={wordCount}
                  readingTime={readingTime}
                  uploadingCover={uploadingCover || isUploading}
                  disabled={isBusy}
                  onTitleChange={handleTitleChange}
                  onSlugChange={handleSlugChange}
                  onExcerptChange={handleExcerptChange}
                  onContentChange={handleContentChange}
                  onUploadCover={(file) => void uploadCover(file)}
                  onRemoveCover={handleRemoveCover}
                />
              </main>

              <EditorSideBar
                saving={saving}
                disabled={isBusy}
                authorName={authorName}
                tags={tags}
                updatedLabel={updatedLabel}
                wordCount={wordCount}
                readingTime={readingTime}
                contentLength={content.replace(/<[^>]*>/g, "").length}
                hasTitle={Boolean(title.trim())}
                hasExcerpt={Boolean(excerpt.trim())}
                hasCoverImage={Boolean(coverPreviewUrl)}
                onSaveDraft={() => void saveStory("draft")}
                onPublish={() => void saveStory("published")}
                onTagsChange={(nextTags) => {
                  setTags(nextTags);
                  setHasSaved(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default NewPost;
