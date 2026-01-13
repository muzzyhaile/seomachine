'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Check } from 'lucide-react'

export default function ContextEditPage() {
  const params = useParams()
  const slug = params.slug as string
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const filename = decodeURIComponent(slug)
  const title = filename.replace('.md', '').replace(/-/g, ' ')

  useEffect(() => {
    loadContent()
  }, [slug])

  const loadContent = async () => {
    try {
      const response = await fetch(`/api/context/${encodeURIComponent(filename)}`)
      const data = await response.json()
      setContent(data.content || '')
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaved(false)
    
    try {
      await fetch(`/api/context/${encodeURIComponent(filename)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link
        href="/context"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Context
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
            {title}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{filename}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 sm:p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
            <p className="text-gray-500 mt-4">Loading...</p>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[600px] p-6 font-mono text-sm text-gray-700 resize-none focus:outline-none"
            placeholder="Enter your content here..."
          />
        )}
      </div>
    </div>
  )
}
