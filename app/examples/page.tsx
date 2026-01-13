import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft, BookOpen, FileText, Target, Link as LinkIcon, Edit3 } from 'lucide-react'

const exampleFiles = [
  { name: 'Brand Voice', file: 'brand-voice.md', icon: BookOpen },
  { name: 'Features', file: 'features.md', icon: Target },
  { name: 'Internal Links Map', file: 'internal-links-map.md', icon: LinkIcon },
  { name: 'Writing Examples', file: 'writing-examples.md', icon: Edit3 },
]

async function getExampleContent(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'examples', 'castos', filename)
    const content = await fs.readFile(filePath, 'utf-8')
    return content.substring(0, 500) + '...'
  } catch {
    return 'Content not available'
  }
}

export default async function ExamplesPage() {
  const filesWithContent = await Promise.all(
    exampleFiles.map(async (file) => ({
      ...file,
      preview: await getExampleContent(file.file)
    }))
  )

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link
        href="/context"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Context
      </Link>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Example: Castos
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          See how a complete context setup looks for a podcast hosting company
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-2">About This Example</h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Castos is a podcast hosting platform. These example files show how they've configured their brand voice, 
          features, and other context to generate content that matches their style and serves their audience.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {filesWithContent.map((file, i) => {
          const Icon = file.icon
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{file.name}</h3>
                <span className="text-xs text-gray-500 w-full sm:w-auto sm:ml-auto order-first sm:order-last">{file.file}</span>
              </div>
              <div className="p-3 sm:p-4">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono bg-gray-50 p-3 sm:p-4 rounded-lg overflow-x-auto max-h-40 sm:max-h-48">
                  {file.preview}
                </pre>
                <Link
                  href={`/examples/castos/${encodeURIComponent(file.file)}`}
                  className="inline-flex items-center gap-2 mt-3 sm:mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Full File →
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
