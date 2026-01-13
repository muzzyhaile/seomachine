import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { 
  BookOpen, 
  FileText, 
  Target, 
  Compass,
  Link as LinkIcon,
  Edit3
} from 'lucide-react'

const contextFiles = [
  {
    name: 'Brand Voice',
    file: 'brand-voice.md',
    icon: BookOpen,
    description: 'Define your brand personality, tone, and messaging framework',
    color: 'blue'
  },
  {
    name: 'Features',
    file: 'features.md',
    icon: Target,
    description: 'List your product features, benefits, and value propositions',
    color: 'purple'
  },
  {
    name: 'Writing Examples',
    file: 'writing-examples.md',
    icon: Edit3,
    description: 'Add examples of your best content for AI to learn from',
    color: 'green'
  },
  {
    name: 'SEO Guidelines',
    file: 'seo-guidelines.md',
    icon: Compass,
    description: 'Configure SEO requirements and best practices',
    color: 'amber'
  },
  {
    name: 'Internal Links Map',
    file: 'internal-links-map.md',
    icon: LinkIcon,
    description: 'Map your site structure for internal linking suggestions',
    color: 'pink'
  },
  {
    name: 'Target Keywords',
    file: 'target-keywords.md',
    icon: Target,
    description: 'Define your keyword clusters and topic focus areas',
    color: 'indigo'
  },
  {
    name: 'Style Guide',
    file: 'style-guide.md',
    icon: FileText,
    description: 'Set writing style preferences and formatting rules',
    color: 'teal'
  },
  {
    name: 'Competitor Analysis',
    file: 'competitor-analysis.md',
    icon: Compass,
    description: 'Document competitor insights and differentiation',
    color: 'rose'
  }
]

async function getFileStatus(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'context', filename)
    const content = await fs.readFile(filePath, 'utf-8')
    const stat = await fs.stat(filePath)
    
    // Check if file is still a template (contains [YOUR or [BRACKETED)
    const isTemplate = content.includes('[YOUR') || content.includes('[BRACKETED')
    const wordCount = content.split(/\s+/).length
    
    return {
      exists: true,
      isTemplate,
      wordCount,
      lastModified: stat.mtime
    }
  } catch {
    return {
      exists: false,
      isTemplate: true,
      wordCount: 0,
      lastModified: null
    }
  }
}

const colorClasses: Record<string, { bg: string, icon: string, border: string }> = {
  blue: { bg: 'bg-blue-100', icon: 'text-blue-600', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-100', icon: 'text-purple-600', border: 'border-purple-200' },
  green: { bg: 'bg-green-100', icon: 'text-green-600', border: 'border-green-200' },
  amber: { bg: 'bg-amber-100', icon: 'text-amber-600', border: 'border-amber-200' },
  pink: { bg: 'bg-pink-100', icon: 'text-pink-600', border: 'border-pink-200' },
  indigo: { bg: 'bg-indigo-100', icon: 'text-indigo-600', border: 'border-indigo-200' },
  teal: { bg: 'bg-teal-100', icon: 'text-teal-600', border: 'border-teal-200' },
  rose: { bg: 'bg-rose-100', icon: 'text-rose-600', border: 'border-rose-200' },
}

export default async function ContextPage() {
  const filesWithStatus = await Promise.all(
    contextFiles.map(async (file) => ({
      ...file,
      status: await getFileStatus(file.file)
    }))
  )

  const completedCount = filesWithStatus.filter(f => !f.status.isTemplate).length
  const progress = Math.round((completedCount / filesWithStatus.length) * 100)

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Context Configuration
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Configure your brand context for personalized content generation
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="font-semibold text-gray-900">Setup Progress</h2>
          <span className="text-sm text-gray-500">{completedCount} of {filesWithStatus.length} configured</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress < 100 && (
          <p className="text-sm text-gray-500 mt-3">
            💡 Fill out these files to get better, more personalized content
          </p>
        )}
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {filesWithStatus.map((file, i) => {
          const colors = colorClasses[file.color]
          const Icon = file.icon
          
          return (
            <Link
              key={i}
              href={`/context/${encodeURIComponent(file.file)}`}
              className={`
                block bg-white rounded-xl border p-6 hover:shadow-md transition-all card-hover
                ${file.status.isTemplate ? 'border-gray-200' : `${colors.border} border-2`}
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{file.name}</h3>
                    {!file.status.isTemplate && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        Configured
                      </span>
                    )}
                    {file.status.isTemplate && file.status.exists && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                        Template
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{file.description}</p>
                  {file.status.lastModified && (
                    <p className="text-xs text-gray-400 mt-2">
                      Last modified: {file.status.lastModified.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Example Link */}
      <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <h3 className="font-semibold mb-2">Need examples?</h3>
        <p className="text-gray-300 text-sm mb-4">
          Check out the Castos example files to see how a complete context setup looks.
        </p>
        <Link
          href="/examples"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
        >
          View Examples →
        </Link>
      </div>
    </div>
  )
}
