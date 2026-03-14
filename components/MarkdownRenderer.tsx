'use client'

import { useEffect, useState } from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function convertMarkdown(md: string): string {
  let result = md

  // Escape HTML
      result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      
      // Headers
      result = result.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-800 mt-6 mb-2">$1</h3>')
      result = result.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-200">$1</h2>')
      result = result.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-4 mb-4">$1</h1>')
      
      // Bold and italic
      result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      result = result.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      result = result.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      
      // Code blocks
      result = result.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm"><code>$2</code></pre>')
      
      // Inline code
      result = result.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      
      // Blockquotes
      result = result.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-4">$1</blockquote>')
      
      // Horizontal rule
      result = result.replace(/^---$/gm, '<hr class="my-8 border-gray-200" />')
      
      // Unordered lists
      result = result.replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-700">$1</li>')
      result = result.replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc list-outside ml-4 my-4 space-y-1">$&</ul>')
      
      // Numbered lists
      result = result.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-gray-700">$1</li>')
      
      // Links
      result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Paragraphs - wrap lines that aren't already wrapped
      const lines = result.split('\n')
      const processed = lines.map(line => {
        const trimmed = line.trim()
        if (!trimmed) return ''
        if (trimmed.startsWith('<')) return line
        return `<p class="text-gray-700 leading-relaxed mb-4">${trimmed}</p>`
      })
      result = processed.join('\n')
      
  // Clean up empty paragraphs
  result = result.replace(/<p class="[^"]*"><\/p>/g, '')

  return result
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    setHtml(convertMarkdown(content))
  }, [content])

  return (
    <div
      className={`prose prose-gray max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
