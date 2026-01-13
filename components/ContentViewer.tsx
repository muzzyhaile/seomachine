'use client'

import MarkdownRenderer from './MarkdownRenderer'

interface ContentViewerProps {
  content: string
}

export default function ContentViewer({ content }: ContentViewerProps) {
  return (
    <div className="p-5 sm:p-8 max-h-[700px] overflow-y-auto">
      <MarkdownRenderer content={content} />
    </div>
  )
}
