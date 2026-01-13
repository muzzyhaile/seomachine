'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { RefreshCw, Loader2, Copy, Check, Download, Link, ChevronDown, ChevronUp, FileText, Save } from 'lucide-react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import LanguageSelector, { getLanguageName } from '@/components/LanguageSelector'

interface ArticleData {
  topic: string
  content: string
  language?: string
}

function RewritePageContent() {
  const searchParams = useSearchParams()
  const [url, setUrl] = useState('')
  const [topic, setTopic] = useState('')
  const [language, setLanguage] = useState('en')
  const [instructions, setInstructions] = useState('')
  const [existingContent, setExistingContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [articleData, setArticleData] = useState<ArticleData | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)

  // Check for article data from Write step
  useEffect(() => {
    const fromWrite = searchParams.get('fromWrite')
    if (fromWrite === 'true') {
      const stored = sessionStorage.getItem('seo-article')
      if (stored) {
        const data = JSON.parse(stored) as ArticleData
        setArticleData(data)
        setTopic(data.topic)
        setExistingContent(data.content)
        if (data.language) {
          setLanguage(data.language)
        }
        setShowOriginal(true)
      }
    }
  }, [searchParams])

  const handleRewrite = async () => {
    if (!url.trim() && !topic.trim() && !existingContent.trim() && !articleData) return
    
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          topic,
          language,
          instructions,
          existingContent: existingContent || articleData?.content 
        })
      })
      
      const data = await response.json()
      setResult(data.content || data.error)
    } catch (error) {
      setResult('Error rewriting content. Please try again.')
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
      const filename = topic || 'rewritten-content'
      const blob = new Blob([result], { type: 'text/markdown' })
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${filename.toLowerCase().replace(/\s+/g, '-')}-rewrite.md`
      a.click()
      URL.revokeObjectURL(blobUrl)
    }
  }

  const clearArticleData = () => {
    setArticleData(null)
    setExistingContent('')
    sessionStorage.removeItem('seo-article')
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Rewrite Content
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Update and improve existing content for better SEO performance
        </p>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm mb-6 sm:mb-8">
        {articleData && (
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Rewriting: {articleData.topic}</p>
                  <p className="text-sm text-gray-600">Your article from the previous step is loaded</p>
                </div>
              </div>
              <button
                onClick={() => setShowOriginal(!showOriginal)}
                className="text-orange-600 hover:text-orange-700 p-1"
              >
                {showOriginal ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            
            {showOriginal && (
              <div className="mt-4 p-4 bg-white rounded-lg max-h-60 overflow-y-auto border border-gray-200">
                <MarkdownRenderer content={articleData.content} className="text-sm" />
              </div>
            )}
            
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={clearArticleData}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear article context
              </button>
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>
          </div>
        )}

        <div className="space-y-6">
          {!articleData && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    URL to analyze (optional)
                  </div>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yoursite.com/blog/existing-article"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">or paste content</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Existing content to rewrite
                </label>
                <textarea
                  value={existingContent}
                  onChange={(e) => setExistingContent(e.target.value)}
                  placeholder="Paste your existing article content here..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic focus
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., podcast monetization strategies..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </div>
            </>
          )}
          
          {/* Language Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
            <span className="text-sm font-medium text-gray-700">Output Language</span>
            <LanguageSelector value={language} onChange={setLanguage} showLabel={false} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {articleData ? 'Rewrite instructions:' : 'Additional instructions (optional)'}
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., Update statistics, add more examples, make it more conversational..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
          </div>
          
          <button
            onClick={handleRewrite}
            disabled={isLoading || (!url.trim() && !topic.trim() && !existingContent.trim() && !articleData)}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Rewriting...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Rewrite Content
              </>
            )}
          </button>
        </div>
        
        {isLoading && (
          <div className="mt-6 p-4 bg-orange-50 rounded-xl">
            <p className="text-orange-700 text-sm">
              🔄 Analyzing and rewriting content... This may take a moment.
            </p>
          </div>
        )}
      </div>

      {!result && !isLoading && !articleData && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-orange-100">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4">What the rewrite does:</h3>
          <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
            <li className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              Updates outdated statistics and information
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              Improves SEO optimization and keyword targeting
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              Expands thin sections and adds new insights
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              Maintains what works from the original content
            </li>
          </ul>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-white">
                <h3 className="font-semibold text-lg">Content Rewritten!</h3>
                <p className="text-green-100 text-sm">Your improved article is ready</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Rewritten Article</h2>
            </div>
            <div className="p-5 sm:p-8 max-h-[600px] overflow-y-auto">
              <MarkdownRenderer content={result} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RewritePage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto animate-fade-in flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    }>
      <RewritePageContent />
    </Suspense>
  )
}
