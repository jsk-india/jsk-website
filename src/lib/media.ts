/**
 * Helpers for working with Payload media objects.
 *
 * Payload populates upload fields (at depth >= 1) as objects with:
 *   { url, alt, width, height, filename, mimeType,
 *     sizes: { thumbnail: {url,width,height}, card: {url,...}, hero: {url,...} } }
 *
 * At depth 0 they're just a numeric ID — always check with isMediaObject().
 */

export type PayloadMedia = {
  id: number | string
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  filename?: string | null
  mimeType?: string | null
  thumbnailURL?: string | null
  sizes?: {
    thumbnail?: { url?: string | null; width?: number | null; height?: number | null }
    card?:      { url?: string | null; width?: number | null; height?: number | null }
    hero?:      { url?: string | null; width?: number | null; height?: number | null }
  }
}

/** Type guard — is this a populated media object or just an ID? */
export function isMedia(value: unknown): value is PayloadMedia {
  return typeof value === 'object' && value !== null && 'url' in value
}

/** Get the best-fit URL for a media object. Falls back through sizes. */
export function mediaUrl(
  media: unknown,
  size: 'thumbnail' | 'card' | 'hero' | 'original' = 'original',
): string | null {
  if (!isMedia(media)) return null
  if (size !== 'original' && media.sizes?.[size]?.url) {
    return media.sizes[size]!.url!
  }
  return media.url ?? null
}

/** Alt text — returns empty string (never undefined) so img alt is always set. */
export function mediaAlt(media: unknown): string {
  if (!isMedia(media)) return ''
  return media.alt ?? ''
}
