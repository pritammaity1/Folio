function uniqueMediaIds(coverMediaId: string | null, mediaIds: string[]) {
  return Array.from(
    new Set(
      [coverMediaId, ...mediaIds].filter((value): value is string =>
        Boolean(value),
      ),
    ),
  );
}

export function getPostMediaIds(
  coverMediaId: string | null,
  mediaIds: string[],
) {
  return uniqueMediaIds(coverMediaId, mediaIds);
}
