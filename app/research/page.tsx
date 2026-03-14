'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, FileText, Target, Users, TrendingUp, ArrowRight, PenTool } from 'lucide-react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import OutputPanel from '@/components/OutputPanel'
import LanguageSelector, { getLanguageName } from '@/components/LanguageSelector'

export default function ResearchPage() {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [language, setLanguage] = useState('en')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | undefined>()
  const [researchedTopic, setResearchedTopic] = useState('')

  const handleResearch = async () => {
    if (!topic.trim()) return
    
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, language })
      })
      
      const data = await response.json()
      if (data.error) { setResult('Error: ' + data.error) } else { setResult(data.brief); setFilename(data.filename) }
      setResearchedTopic(topic)
    } catch (error) {
      setResult('Error performing research. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const useResearchToWrite = () => {
    // Store research in sessionStorage so Write page can access it
    sessionStorage.setItem('seo-research', JSON.stringify({
      topic: researchedTopic,
      research: result,
      language: language
    }))
    router.push('/write?fromResearch=true')
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Topic Research
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Analyze keywords, competitors, and find content opportunities
        </p>
      </div>

      {/* Research Form */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-8 shadow-sm mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <label className="block text-sm font-medium text-gray-700">
            What topic do you want to research?
          </label>
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., podcast advertising strategies..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-base"
            onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
          />
          <button
            onClick={handleResearch}
            disabled={isLoading || !topic.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Researching...</span>
                <span className="sm:hidden">Loading...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Research
              </>
            )}
          </button>
        </div>
      </div>

      {/* What You'll Get */}
      {!result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Keyword Analysis</h3>
            <p className="text-gray-600 text-sm">
              Discover primary and secondary keywords with search volume and difficulty estimates.
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Competitor Insights</h3>
            <p className="text-gray-600 text-sm">
              See what top-ranking content covers and identify gaps you can fill.
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Content Outline</h3>
            <p className="text-gray-600 text-sm">
              Get a recommended article structure with H2s, H3s, and key points to cover.
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">SEO Recommendations</h3>
            <p className="text-gray-600 text-sm">
              Suggested meta titles, descriptions, and internal linking opportunities.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="bg-gradient-to-r from-purple-500 to-accent-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-white">
                <h3 className="font-semibold text-lg">Research Complete!</h3>
                <p className="text-purple-100 text-sm">Ready to create content based on this research?</p>
              </div>
              <button
                onClick={useResearchToWrite}
                className="w-full sm:w-auto px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <PenTool className="w-5 h-5" />
                Use Research to Write Article
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Research Content */}
          <OutputPanel content={result} filename={filename} savedDir="research" color="blue" />
        </div>
      )}
    </div>
  )
}
