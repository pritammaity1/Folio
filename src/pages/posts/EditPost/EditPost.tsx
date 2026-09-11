import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Icon } from "../../../components/ui/Icon/Icon";
import PostStatusBadge from "../../../features/posts/components/PostStatusBadge";
import EditorCanvas from "../../../features/editor/components/EditorCanvas";
import EditorSideBar from "../../../features/editor/components/EditorSideBar";

import {
  countWords,
  generateSlug,
  getReadingTime,
} from "../../../features/editor/validation";

import { auth } from "../../../services/firebase/auth";
import { getMediaById } from "../../../services/firebase/media";
import { getPost, updatePost } from "../../../services/firebase/posts";
import { registerMedia } from "../../../services/api/media";
import { useUploadThing } from "../../../services/uploadthing/client";

import type { Post, PostStatus } from "../../../types/post";

function formatUpdatedAt(value: Post["updatedAt"]) {
  if (!value) {
    return "Recently";
  }

  return value.toDate().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<PostStatus>("draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [previewMode, setPreviewMode] = useState(false);
  const [hasSaved, setHasSaved] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const isBusy = saving || uploadingCover || isUploading;

  const authorName =
    auth.currentUser?.displayName?.trim() ||
    auth.currentUser?.email?.split("@")[0] ||
    "Editor";

  const updatedLabel = hasSaved
    ? post
      ? `Saved ${formatUpdatedAt(post.updatedAt)}`
      : "Saved"
    : "Unsaved changes";

  useEffect(() => {
    let active = true;

    async function loadPost() {
      if (!id) {
        setError("This story could not be found.");
        setLoading(false);
        return;
      }

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("You must be signed in to edit this story.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const nextPost = await getPost(id);

        if (!active) {
          return;
        }

        if (!nextPost) {
          setError("This story could not be found.");
          return;
        }

        if (nextPost.authorId !== currentUser.uid) {
          setError("You do not have permission to edit this story.");
          return;
        }

        setPost(nextPost);

        setTitle(nextPost.title);
        setSlug(nextPost.slug);
        setExcerpt(nextPost.excerpt);
        setContent(nextPost.content);
        setCoverMediaId(nextPost.coverMediaId);
        setTags(nextPost.tags ?? []);
        setStatus(nextPost.status);

        if (nextPost.coverMediaId) {
          const media = await getMediaById(nextPost.coverMediaId);

          if (
            active &&
            media?.status === "active" &&
            typeof media.url === "string"
          ) {
            setCoverPreviewUrl(media.url);
          }
        }
      } catch (loadError) {
        console.error("Failed to load post for editing.", loadError);

        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load this story.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPost();

    return () => {
      active = false;
    };
  }, [id]);

  function markDirty() {
    setHasSaved(false);
    setMessage("");
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug.trim()) {
      setSlug(generateSlug(value));
    }

    markDirty();
  }

  function handleSlugChange(value: string) {
    setSlug(generateSlug(value));
    markDirty();
  }

  function handleExcerptChange(value: string) {
    setExcerpt(value);
    markDirty();
  }

  function handleContentChange(value: string) {
    setContent(value);
    markDirty();
  }

  function handleStatusChange(nextStatus: PostStatus) {
    setStatus(nextStatus);
    markDirty();
  }

  function handleTagsChange(nextTags: string[]) {
    setTags(nextTags);
    markDirty();
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
    setMessage("");

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

      markDirty();

      toast.success("Cover image uploaded.");
    } catch (uploadError) {
      console.error("Cover image upload failed.", uploadError);

      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Cover image upload failed.";

      setMessage(message);
      toast.error(message);
    } finally {
      setUploadingCover(false);
    }
  }

  function handleRemoveCover() {
    setCoverMediaId(null);
    setCoverPreviewUrl(null);
    markDirty();
  }

  async function saveStory(nextStatus = status) {
    if (!id) {
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("You must be signed in.");
      return;
    }

    if (!post) {
      toast.error("This story could not be loaded.");
      return;
    }

    if (post.authorId !== currentUser.uid) {
      toast.error("You do not have permission to edit this story.");
      return;
    }

    if (!title.trim()) {
      toast.error("Write a headline first.");
      return;
    }

    if (!slug.trim()) {
      toast.error("Add a story slug first.");
      return;
    }

    if (
      ["review", "scheduled", "published"].includes(nextStatus) &&
      !content.replace(/<[^>]*>/g, "").trim()
    ) {
      toast.error("Add some story content before continuing.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await updatePost(id, {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content,
        coverMediaId,
        mediaIds: post.mediaIds ?? [],
        categoryId: post.categoryId ?? null,
        tags,
        status: nextStatus,
        publishedAt:
          nextStatus === "published"
            ? (post.publishedAt?.toDate?.() ?? new Date())
            : null,
      });

      const refreshedPost = await getPost(id);

      if (refreshedPost && refreshedPost.authorId === currentUser.uid) {
        setPost(refreshedPost);
        setStatus(refreshedPost.status);
      }

      setHasSaved(true);

      if (nextStatus === "published") {
        toast.success("Story published successfully.");
      } else if (nextStatus === "draft") {
        toast.success("Draft saved successfully.");
      } else if (nextStatus === "review") {
        toast.success("Story moved to review.");
      } else {
        toast.success("Story saved successfully.");
      }
    } catch (saveError) {
      console.error("Failed to update post.", saveError);

      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save the story.";

      setMessage(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="min-h-full bg-[var(--color-background)]">
        <div className="mx-auto w-full max-w-[var(--canvas-width)] px-[var(--content-padding)] py-6 lg:py-8">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded-full bg-[var(--color-surface-container-low)]" />

            <div className="mt-5 h-12 w-80 rounded-md bg-[var(--color-surface-container-low)]" />

            <div className="mt-3 h-4 w-96 rounded-full bg-[var(--color-surface-container-low)]" />

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_292px]">
              <div className="space-y-5">
                <div className="h-48 rounded-[10px] bg-[var(--color-surface-container-low)]" />
                <div className="h-72 rounded-[10px] bg-[var(--color-surface-container-low)]" />
                <div className="h-96 rounded-[10px] bg-[var(--color-surface-container-low)]" />
              </div>

              <div className="h-[520px] rounded-[10px] bg-[var(--color-surface-container-low)]" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="min-h-full bg-[var(--color-background)]">
        <div className="mx-auto flex min-h-[65vh] w-full max-w-[var(--canvas-width)] items-center justify-center px-[var(--content-padding)]">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
              <Icon name="triangle-alert" size={20} strokeWidth={1.6} />
            </div>

            <p className="mt-5 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
              Editorial workspace
            </p>

            <h1 className="mt-2 font-display text-[30px] tracking-[-0.03em] text-[var(--color-on-surface)]">
              {error === "You do not have permission to edit this story."
                ? "This story belongs to another author."
                : "This story isn't available."}
            </h1>

            <p className="mt-3 font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
              {error || "The story could not be loaded."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/posts")}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-[7px] bg-[var(--color-primary)] px-4 font-body text-[11px] font-semibold text-[var(--color-on-primary)] transition-[background-color,transform] duration-[var(--motion-fast)] hover:bg-[var(--color-primary-container)] active:translate-y-px"
            >
              <Icon name="arrow-left" size={14} />
              <span>Back to Stories</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-full bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-[var(--canvas-width)] px-[var(--content-padding)] py-5 lg:py-7">
        <header className="sticky top-0 z-20 -mx-2 mb-7 border-b border-[var(--color-outline-variant)] bg-[color:var(--color-background)/0.96] px-2 py-3 backdrop-blur-md">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(`/posts/${post.id}`)}
                aria-label="Back to story"
                title="Back to story"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] shadow-[var(--shadow-xs)] transition-[background-color,color,border-color,transform] duration-[var(--motion-fast)] hover:border-[var(--color-outline)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)] active:-translate-x-px"
              >
                <Icon name="arrow-left" size={15} strokeWidth={1.8} />
              </button>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                    Editing story
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[var(--color-outline)]" />

                  <PostStatusBadge status={status} />
                </div>

                <div className="mt-1 flex min-w-0 items-center gap-2">
                  <h1 className="truncate font-display text-[23px] leading-7 tracking-[-0.025em] text-[var(--color-on-surface)]">
                    {title || "Untitled story"}
                  </h1>

                  {!hasSaved && (
                    <span className="shrink-0 rounded-full border border-[rgba(154,65,17,0.16)] bg-[rgba(154,65,17,0.07)] px-2 py-0.5 font-body text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-primary)]">
                      Unsaved
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <span className="mr-1 hidden font-body text-[10px] text-[var(--color-on-surface-variant)] lg:inline">
                {updatedLabel}
              </span>

              <button
                type="button"
                onClick={() => setPreviewMode((current) => !current)}
                disabled={isBusy}
                className={[
                  "inline-flex h-10 items-center justify-center gap-2",
                  "rounded-[7px]",
                  "border border-[var(--color-outline-variant)]",
                  "bg-[var(--color-surface)]",
                  "px-3.5",
                  "font-body text-[11px] font-semibold",
                  "text-[var(--color-on-surface)]",
                  "shadow-[var(--shadow-xs)]",
                  "transition-[background-color,border-color,color,transform]",
                  "duration-[var(--motion-fast)]",
                  "hover:border-[var(--color-outline)]",
                  "hover:bg-[var(--color-surface-container-low)]",
                  "active:translate-y-px",
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-50",
                ].join(" ")}
              >
                <Icon
                  name={previewMode ? "file-text" : "eye"}
                  size={14}
                  strokeWidth={1.8}
                />

                <span>{previewMode ? "Editor" : "Preview"}</span>
              </button>

              <button
                type="button"
                onClick={() => void saveStory()}
                disabled={isBusy}
                className={[
                  "inline-flex h-10 items-center justify-center gap-2",
                  "rounded-[7px]",
                  "bg-[var(--color-primary)]",
                  "px-4",
                  "font-body text-[11px] font-semibold",
                  "text-[var(--color-on-primary)]",
                  "shadow-[var(--shadow-sm)]",
                  "transition-[background-color,box-shadow,transform,opacity]",
                  "duration-[var(--motion-fast)]",
                  "hover:bg-[var(--color-primary-container)]",
                  "hover:shadow-[var(--shadow-md)]",
                  "active:translate-y-px",
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-50",
                ].join(" ")}
              >
                <Icon name="save" size={14} strokeWidth={1.9} />

                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </header>

        {previewMode ? (
          <article className="mx-auto w-full max-w-[820px] overflow-hidden rounded-[10px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
            {coverPreviewUrl && (
              <div
                role="img"
                aria-label={title}
                style={{
                  backgroundImage: `url("${coverPreviewUrl}")`,
                }}
                className="aspect-[16/8.2] w-full bg-cover bg-center bg-no-repeat"
              />
            )}

            <div className="px-7 py-11 sm:px-12 sm:py-14 lg:px-16">
              <div className="flex flex-wrap items-center gap-2">
                <PostStatusBadge status={status} />

                <span className="font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                  {readingTime} min read
                </span>
              </div>

              <h2 className="mt-6 max-w-[700px] font-display text-[clamp(42px,6vw,68px)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--color-on-surface)]">
                {title || "Write your headline"}
              </h2>

              {excerpt && (
                <p className="mt-6 max-w-[700px] font-display text-[19px] italic leading-[1.6] text-[var(--color-on-surface-variant)]">
                  {excerpt}
                </p>
              )}

              <div className="mt-10 border-t border-[var(--color-outline-variant)] pt-9">
                <div className="whitespace-pre-wrap font-display text-[18px] leading-[1.85] text-[var(--color-on-surface)] sm:text-[19px]">
                  {content || "Begin your story..."}
                </div>
              </div>

              {tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2 border-t border-[var(--color-outline-variant)] pt-6">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-3 py-1.5 font-body text-[10px] font-medium text-[var(--color-on-surface-variant)]"
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

              {message && (
                <div
                  className={[
                    "mt-4 flex items-center gap-3",
                    "rounded-[8px]",
                    "border border-[var(--color-outline-variant)]",
                    "bg-[var(--color-surface)]",
                    "px-4 py-3.5",
                    "shadow-[var(--shadow-xs)]",
                  ].join(" ")}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-primary)]">
                    <Icon name="check-circle" size={14} strokeWidth={1.8} />
                  </div>

                  <p className="font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                    {message}
                  </p>
                </div>
              )}
            </main>

            <aside className="lg:sticky lg:top-[96px] lg:self-start">
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
                onStatusChange={handleStatusChange}
                onSaveDraft={() => void saveStory("draft")}
                onPublish={() => void saveStory("published")}
                onTagsChange={handleTagsChange}
              />
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default EditPost;
