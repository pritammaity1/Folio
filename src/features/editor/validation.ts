export function countWords(content: string): number {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return 0;
  }

  return plainText.split(" ").length;
}

export function getReadingTime(wordCount: number): number {
  if (wordCount <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(wordCount / 200));
}

export function generateSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
