
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