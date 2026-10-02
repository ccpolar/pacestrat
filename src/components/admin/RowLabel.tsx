'use client'

import { useRowLabel } from '@payloadcms/ui'

/** Names each array row after its content (title, label, question…) instead of "Row 01". */
export const RowLabel = () => {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()
  const text = ['title', 'label', 'name', 'q', 'section']
    .map((k) => data?.[k])
    .find((v) => typeof v === 'string' && v.trim()) as string | undefined
  const n = String((rowNumber ?? 0) + 1).padStart(2, '0')
  const label = text && data?.section ? text.charAt(0).toUpperCase() + text.slice(1) : text
  return (
    <span className="row-label">
      <span className="row-label__n">{n}</span>
      {label || 'New item'}
      {data?.visible === false && <span className="row-label__hidden">Hidden</span>}
    </span>
  )
}
