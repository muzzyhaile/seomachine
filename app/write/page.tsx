'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PenTool, Loader2, ArrowRight, RefreshCw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import OutputPanel from '@/components/OutputPanel'
import LanguageSelector, { getLanguageName } from '@/components/LanguageSelector'

interface ResearchData {
  topic: string
  research: string
  language?: string
}

function WritePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [language, setLanguage] = useState('en')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | undefined>()
  const [researchData, setResearchData] = useState<ResearchData | null>(null)
  const [showResearch, setShowResearch] = useState(false)

  // Check for research data from previous step
  useEffect(() => {
    const fromResearch = searchParams.get('fromResearch')
    if (fromResearch === 'true') {
      const stored = sessionStorage.getItem('seo-research')
      if (stored) {
        const data = JSON.parse(stored) as ResearchData
        setResearchData(data)
        setTopic(data.topic)
        if (data.language) {
          setLanguage(data.language)
        }
        setShowResearch(true)
      }
    }
  }, [searchParams])

  const handleWrite = async () => {
    if (!topic.trim()) return
    
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic,
          language,
          research: researchData?.research // Include research if available
        })
      })
      
      const data = await response.json()
      if (data.error) { setResult('Error: ' + data.error) } else { setResult(data.article); setFilename(data.filename) }
    } catch (error) {
      setResult('Error generating content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadMarkdown = () => {
    if (result) {
      const blob = new Blob([result], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${topic.toLowerCase().replace(/\s+/g, '-')}.md`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const goToRewrite = () => {
    if (result) {
      sessionStorage.setItem('seo-article', JSON.stringify({
        topic,
        content: result,
        language: language
      }))
      router.push('/rewrite?fromWrite=true')
    }
  }

  const clearResearch = () => {
    setResearchData(null)
    sessionStorage.removeItem('seo-research')
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Write Article
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Generate SEO-optimized long-form content
        </p>
      </div>

      {/* Write Form */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-8 shadow-sm mb-6 sm:mb-8">
        {/* Research Context Banner */}
        {researchData && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Using research for: {researchData.topic}</p>
                  <p className="text-sm text-gray-600">Your article will be informed by the research brief</p>
                </div>
              </div>
              <button
                onClick={() => setShowResearch(!showResearch)}
                className="text-blue-600 hover:text-blue-700 p-1"
              >
                {showResearch ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            
            {showResearch && (
              <div className="mt-4 p-4 bg-white rounded-lg max-h-60 overflow-y-auto border border-gray-200">
                <MarkdownRenderer content={researchData.research} className="text-sm" />
              </div>
            )}
            
            <div className="mt-3 flex gap-2">
              <button
                onClick={clearResearch}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear research context
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {researchData ? 'Confirm or modify your topic:' : 'What topic do you want to write about?'}
          </label>
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Complete guide to podcast advertising..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-base"
            onKeyDown={(e) => e.key === 'Enter' && handleWrite()}
          />
          <button
            onClick={handleWrite}
            disabled={isLoading || !topic.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-accent-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Writing...</span>
                <span className="sm:hidden">Loading...</span>
              </>
            ) : (
              <>
                <PenTool className="w-5 h-5" />
                Generate
              </>
            )}
          </button>
        </div>
        
        {isLoading && (
          <div className="mt-4 sm:mt-6 p-4 bg-purple-50 rounded-xl">
            <p className="text-purple-700 text-sm">
              ✨ Generating your SEO-optimized article... This may take a minute.
            </p>
          </div>
        )}
      </div>

      {/* Options */}
      {!result && !isLoading && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-purple-100">
          <h3 className="font-semibold text-gray-900 mb-4">What you'll get:</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm sm:text-base">2,000-3,000+ word SEO-optimized article</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm sm:text-base">Proper H1, H2, H3 heading structure</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm sm:text-base">Meta title and description suggestions</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm sm:text-base">Internal linking recommendations</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm sm:text-base">Content matched to your brand voice</span>
            </li>
          </ul>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-white">
                <h3 className="font-semibold text-lg">Article Generated!</h3>
                <p className="text-orange-100 text-sm">Want to refine or update this content?</p>
              </div>
              <button
                onClick={goToRewrite}
                className="w-full sm:w-auto px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <RefreshCw className="w-5 h-5" />
                Continue to Rewrite
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <OutputPanel content={result} filename={filename} savedDir="output" color="purple" />
        </div>
      )}
    </div>
  )
}

export default function WritePage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto animate-fade-in flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    }>
      <WritePageContent />
    </Suspense>
  )
}
