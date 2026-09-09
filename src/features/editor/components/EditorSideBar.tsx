import EditorialTips from "./EditorialTips";
import PublishPanel from "./PublishPanel";
import ReadingPanel from "./ReadingPanel";
import StoryDetailsPanel from "./StoryDetailsPanel";

interface EditorSideBarProps {
  saving: boolean;
  disabled?: boolean;
  authorName: string;
  tags: string[];
  updatedLabel?: string;
  wordCount: number;
  readingTime: number;
  contentLength: number;
  hasTitle: boolean;
  hasExcerpt: boolean;
  hasCoverImage: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onTagsChange: (tags: string[]) => void;
}

function EditorSideBar({
  saving,
  disabled = false,
  authorName,
  tags,
  updatedLabel,
  wordCount,
  readingTime,
  contentLength,
  hasTitle,
  hasExcerpt,
  hasCoverImage,
  onSaveDraft,
  onPublish,
  onTagsChange,
}: EditorSideBarProps) {
  return (
    <aside className="min-w-0">
      <div className="space-y-4 lg:sticky lg:top-6">
        <PublishPanel
          saving={saving}
          disabled={disabled}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
        />

        <StoryDetailsPanel
          authorName={authorName}
          tags={tags}
          updatedLabel={updatedLabel}
          disabled={disabled}
          onTagsChange={onTagsChange}
        />

        <ReadingPanel
          wordCount={wordCount}
          readingTime={readingTime}
          contentLength={contentLength}
        />

        <EditorialTips
          wordCount={wordCount}
          hasTitle={hasTitle}
          hasExcerpt={hasExcerpt}
          hasCoverImage={hasCoverImage}
        />
      </div>
    </aside>
  );
}

export default EditorSideBar;
