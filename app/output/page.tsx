import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { FileText, Clock, Eye } from 'lucide-react'

async function getOutputFiles() {
  try {
    const outputPath = path.join(process.cwd(), 'output')
    const files = await fs.readdir(outputPath)
    const mdFiles = files.filter(f => f.endsWith('.md'))
    
    const outputs = await Promise.all(
      mdFiles.map(async (file) => {
        const filePath = path.join(outputPath, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const stat = await fs.stat(filePath)
        
        const titleMatch = content.match(/^#\s+(.+)$/m)
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '').replace(/-/g, ' ')
        
        const wordCount = content.split(/\s+/).length
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
    
    return outputs.sort((a, b) => b.date.getTime() - a.date.getTime())
  } catch {
    return []
  }
}

export default async function OutputPage() {
  const outputs = await getOutputFiles()

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Output
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Published and finalized content
        </p>
      </div>

      {outputs.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {outputs.map((output, i) => (
            <Link
              key={i}
              href={`/output/${encodeURIComponent(output.file)}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all card-hover"
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                    {output.title}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-2 sm:mb-3">
                    {output.preview}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {output.date.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {output.wordCount.toLocaleString()} words
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
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
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No output files yet</h3>
          <p className="text-gray-500 text-sm sm:text-base">
            Finalized content will appear here
          </p>
        </div>
      )}
    </div>
  )
}
