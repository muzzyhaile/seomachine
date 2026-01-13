import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import CopyButton from '@/components/CopyButton'

interface Props {
  params: { slug: string[] }
}

async function getExampleFile(slug: string[]) {
  try {
    const filePath = path.join(process.cwd(), 'examples', ...slug.map(s => decodeURIComponent(s)))
    const content = await fs.readFile(filePath, 'utf-8')
    return content
  } catch {
    return null
  }
}

export default async function ExampleFilePage({ params }: Props) {
  const content = await getExampleFile(params.slug)
  
  if (!content) {
    notFound()
  }

  const filename = params.slug[params.slug.length - 1]
  const title = decodeURIComponent(filename).replace('.md', '').replace(/-/g, ' ')

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link
        href="/examples"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Examples
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
          {title}
        </h1>
        <p className="text-gray-500">Example from Castos</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-600">{filename}</span>
          <CopyButton content={content} />
        </div>
        <div className="p-6 max-h-[700px] overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
            {content}
          </pre>
        </div>
      </div>
    </div>
  )
}
