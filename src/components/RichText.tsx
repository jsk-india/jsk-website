/**
 * RichText — server component wrapper around Payload's Lexical serializer.
 *
 * One source of truth for how Payload's editor output is rendered as HTML.
 * The actual element styling lives in globals.css under `.rich-text` so
 * we don't depend on @tailwindcss/typography (YAGNI — minimal deps).
 */
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

interface Props {
  data: unknown
  className?: string
}

export function RichText({ data, className = '' }: Props) {
  if (!data || typeof data !== 'object') return null
  return (
    <div className={`rich-text ${className}`}>
      <LexicalRichText data={data as SerializedEditorState} />
    </div>
  )
}
