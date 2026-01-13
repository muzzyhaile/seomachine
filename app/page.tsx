import { 
  FileText, 
  Search, 
  PenTool, 
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

// Server component - reads files directly
import { promises as fs } from 'fs'
import path from 'path'

async function getRecentFiles(dir: string, limit: number = 5) {
  try {
    const basePath = process.cwd()
    const fullPath = path.join(basePath, dir)
    const files = await fs.readdir(fullPath)
    const mdFiles = files.filter(f => f.endsWith('.md'))
    
    const fileStats = await Promise.all(
      mdFiles.map(async (file) => {
        const filePath = path.join(fullPath, file)
        const stat = await fs.stat(filePath)
        return {
          name: file.replace('.md', '').replace(/-/g, ' '),
          file: file,
          date: stat.mtime,
          path: `/${dir}/${file}`
        }
      })
    )
    
    return fileStats
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit)
  } catch {
    return []
  }
}

export default async function Dashboard() {
  const recentDrafts = await getRecentFiles('drafts')
  const recentResearch = await getRecentFiles('research')
  const recentOutput = await getRecentFiles('output')

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Welcome to SEO Content Guide
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Create SEO-optimized content with AI assistance
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <Link href="/research" className="card-hover">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-blue-500/20">
            <Search className="w-8 sm:w-10 h-8 sm:h-10 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Research Topic</h3>
            <p className="text-blue-100 text-sm mb-3 sm:mb-4">
              Analyze keywords, competitors, and find content opportunities
            </p>
            <div className="flex items-center text-sm font-medium">
              Start Research <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </Link>

        <Link href="/write" className="card-hover">
          <div className="bg-gradient-to-br from-purple-500 to-accent-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-purple-500/20">
            <PenTool className="w-8 sm:w-10 h-8 sm:h-10 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Write Article</h3>
            <p className="text-purple-100 text-sm mb-3 sm:mb-4">
              Generate SEO-optimized long-form content
            </p>
            <div className="flex items-center text-sm font-medium">
              Start Writing <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </Link>

        <Link href="/context" className="card-hover sm:col-span-2 lg:col-span-1">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-8 sm:w-10 h-8 sm:h-10 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Setup Context</h3>
            <p className="text-emerald-100 text-sm mb-3 sm:mb-4">
              Configure brand voice, features, and guidelines
            </p>
            <div className="flex items-center text-sm font-medium">
              Configure <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Drafts */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Drafts</h2>
            </div>
            <Link href="/drafts" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          
          {recentDrafts.length > 0 ? (
            <div className="space-y-3">
              {recentDrafts.map((draft, i) => (
                <Link 
                  key={i}
                  href={`/drafts?file=${draft.file}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700 capitalize truncate">{draft.name}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {draft.date.toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No drafts yet. Start writing your first article!
            </p>
          )}
        </div>

        {/* Recent Output */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Published Content</h2>
            </div>
            <Link href="/output" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          
          {recentOutput.length > 0 ? (
            <div className="space-y-3">
              {recentOutput.map((item, i) => (
                <Link 
                  key={i}
                  href={`/output?file=${item.file}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700 capitalize truncate">{item.name}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date.toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No published content yet.
            </p>
          )}
        </div>
      </div>

      {/* Stats Preview */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-white">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Getting Started Checklist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold">1</span>
            </div>
            <span className="text-gray-300 text-sm sm:text-base">Set up brand voice</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold">2</span>
            </div>
            <span className="text-gray-300 text-sm sm:text-base">Add writing examples</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold">3</span>
            </div>
            <span className="text-gray-300 text-sm sm:text-base">Research your topic</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold">4</span>
            </div>
            <span className="text-gray-300 text-sm sm:text-base">Generate content</span>
          </div>
        </div>
      </div>
    </div>
  )
}
