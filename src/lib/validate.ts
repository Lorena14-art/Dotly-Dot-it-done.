export const MAX_TITLE = 120;

/** Returns the trimmed title, or null if it is empty or too long. */
export function cleanTitle(raw: string): string | null {
  const title = raw.trim();
  if (title.length === 0 || title.length > MAX_TITLE) return null;
  return title;
}

export const MAX_DESCRIPTION = 500;

/** Returns the trimmed description ("" if empty), or null if too long. */
export function cleanDescription(raw: string): string | null {
  const text = raw.trim();
  return text.length > MAX_DESCRIPTION ? null : text;
}

export function cleanTags(raw: string): string[] {
  const seen = new Set<string>();
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => {
      const key = tag.toLocaleLowerCase();
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}