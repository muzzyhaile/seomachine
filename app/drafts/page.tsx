import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { FileText, Clock, Eye } from 'lucide-react'

async function getDrafts() {
  try {
    const draftsPath = path.join(process.cwd(), 'drafts')
    const files = await fs.readdir(draftsPath)
    const mdFiles = files.filter(f => f.endsWith('.md'))
    
    const drafts = await Promise.all(
      mdFiles.map(async (file) => {
        const filePath = path.join(draftsPath, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const stat = await fs.stat(filePath)
        
        // Extract title from first H1 or filename
        const titleMatch = content.match(/^#\s+(.+)$/m)
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '').replace(/-/g, ' ')
        
        // Get word count
        const wordCount = content.split(/\s+/).length
        
        // Get preview (first 200 chars of content after title)
        const contentWithoutTitle = content.replace(/^#.+\n/, '')
        const preview = contentWithoutTitle.substring(0, 200).trim() + '...'
        
        return {
          file,
          title,
          date: stat.mtime,
          wordCount,
          preview
        }
      })
    )
    
    return drafts.sort((a, b) => b.date.getTime() - a.date.getTime())
  } catch {
    return []
  }
}

export default async function DraftsPage() {
  const drafts = await getDrafts()

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Drafts
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          View and manage your draft articles
        </p>
      </div>

      {drafts.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {drafts.map((draft, i) => (
            <Link
              key={i}
              href={`/drafts/${encodeURIComponent(draft.file)}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all card-hover"
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 capitalize">
                    {draft.title}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-2 sm:mb-3">
                    {draft.preview}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {draft.date.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {draft.wordCount.toLocaleString()} words
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No drafts yet</h3>
          <p className="text-gray-500 mb-6">
            Start by writing your first article
          </p>
          <Link
            href="/write"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-accent-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-accent-700 transition-all"
          >
            Write Article
          </Link>
        </div>
      )}
    </div>
  )
}
