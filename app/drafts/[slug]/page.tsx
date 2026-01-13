import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft, Clock, FileText } from 'lucide-react'
import { notFound } from 'next/navigation'
import CopyButton from '@/components/CopyButton'
import ContentViewer from '@/components/ContentViewer'

interface Props {
  params: { slug: string }
}

async function getDraft(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'drafts', decodeURIComponent(slug))
    const content = await fs.readFile(filePath, 'utf-8')
    const stat = await fs.stat(filePath)
    
    return {
      content,
      date: stat.mtime,
      wordCount: content.split(/\s+/).length
    }
  } catch {
    return null
  }
}

export default async function DraftPage({ params }: Props) {
  const draft = await getDraft(params.slug)
  
  if (!draft) {
    notFound()
  }

  const title = decodeURIComponent(params.slug).replace('.md', '').replace(/-/g, ' ')

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back link */}
      <Link
        href="/drafts"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Drafts
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 capitalize">
          {title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {draft.date.toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {draft.wordCount.toLocaleString()} words
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-600">{params.slug}</span>
          <CopyButton content={draft.content} />
        </div>
        <ContentViewer content={draft.content} />
      </div>
    </div>
  )
}
