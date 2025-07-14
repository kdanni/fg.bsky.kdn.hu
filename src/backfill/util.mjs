
export function getMimeStringOrNull(embed) {
  if (!embed) return null;
  if (embed.$type === 'app.bsky.embed.images') {
    return embed.images?.some(
      (img) => img.image?.mimeType?.startsWith('image/')
    ) ? 'image/' : '?';
  }
  if (embed.$type === 'app.bsky.embed.recordWithMedia') {
    return getMimeStringOrNull(embed.media);
  }
  return 'embed?';
}

export function getLanguageOrEn(record) {
  if (!record || !record.langs) {
    return 'en';
  }
  const langs = record.langs;
  if (langs && langs.length > 0) {
    // Return the first not english or hungarian language
    for (const lang of langs) {
      if (lang !== 'en' && lang !== 'hu') {
        return lang;
      }
    }
    // If all are english or hungarian, return the first one
    return langs[0];
  }
  return 'en'; // Default to English if no languages are specified
}