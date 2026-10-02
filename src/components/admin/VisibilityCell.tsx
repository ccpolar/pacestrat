'use client'

import type { DefaultCellComponentProps } from 'payload'

/** List-view cell for a "show on site" checkbox: a Live / Hidden pill instead of `true`. */
export function VisibilityCell({ cellData }: DefaultCellComponentProps) {
  const live = cellData !== false
  return <span className={`studio-state${live ? ' studio-state--live' : ''}`}>{live ? 'Live' : 'Hidden'}</span>
}
