export function getUniqueMediaIds(
  coverMediaId: string | null,
  mediaIds: string[],
) {
  return Array.from(
    new Set(
      [coverMediaId, ...mediaIds].filter((value): value is string =>
        Boolean(value),
      ),
    ),
  );
}

export function getAddedMediaIds(
  previousMediaIds: string[],
  nextMediaIds: string[],
) {
  const previous = new Set(previousMediaIds);

  return nextMediaIds.filter((mediaId) => !previous.has(mediaId));
}

export function getRemovedMediaIds(
  previousMediaIds: string[],
  nextMediaIds: string[],
) {
  const next = new Set(nextMediaIds);

  return previousMediaIds.filter((mediaId) => !next.has(mediaId));
}
