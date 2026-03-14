'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Download, Eye, Code, FileCode, FolderOpen, ExternalLink } from 'lucide-react'
import { convertMarkdown } from './MarkdownRenderer'

type Tab = 'preview' | 'markdown' | 'html'

interface OutputPanelProps {
  content: string
  filename?: string
  /** Directory name to show in the "saved" banner, e.g. "output" */
  savedDir?: string
  color?: 'purple' | 'blue' | 'orange' | 'green'
}

const USE_IN: { name: string; tab: Tab; hint: string }[] = [
  { name: 'WordPress',      tab: 'html',     hint: 'Paste in HTML block' },
  { name: 'Ghost',          tab: 'markdown', hint: 'Paste in editor' },
  { name: 'Notion',         tab: 'markdown', hint: 'Import markdown' },
  { name: 'Dev.to',         tab: 'markdown', hint: 'Markdown editor' },
  { name: 'Webflow',        tab: 'html',     hint: 'HTML embed element' },
  { name: 'HubSpot',        tab: 'html',     hint: 'HTML source view' },
  { name: 'Hashnode',       tab: 'markdown', hint: 'Markdown editor' },
  { name: 'Squarespace',    tab: 'html',     hint: 'Code block' },
]

const ACCENT: Record<string, { border: string; text: string; tile: string }> = {
  purple: { border: 'border-purple-500', text: 'text-purple-700', tile: 'hover:border-purple-300 hover:bg-purple-50' },
  blue:   { border: 'border-blue-500',   text: 'text-blue-700',   tile: 'hover:border-blue-300 hover:bg-blue-50' },
  orange: { border: 'border-orange-500', text: 'text-orange-700', tile: 'hover:border-orange-300 hover:bg-orange-50' },
  green:  { border: 'border-green-500',  text: 'text-green-700',  tile: 'hover:border-green-300 hover:bg-green-50' },
}

export default function OutputPanel({ content, filename, savedDir, color = 'purple' }: OutputPanelProps) {
  const [tab, setTab] = useState<Tab>('preview')
  const [copied, setCopied] = useState(false)
  const [html, setHtml] = useState('')

  useEffect(() => {
    setHtml(convertMarkdown(content))
  }, [content])

  const ac = ACCENT[color] ?? ACCENT.purple

  const getTabContent = (t: Tab) => (t === 'html' ? html : content)

  const copy = (forceContent?: string) => {
    const text = forceContent ?? (tab === 'preview' ? content : getTabContent(tab))
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = (type: 'md' | 'html') => {
    const base = (filename ?? 'output').replace(/\.md$/, '')
    if (type === 'md') {
      trigger(new Blob([content], { type: 'text/markdown' }), `${base}.md`)
    } else {
      const wrapped = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${base}</title>\n  <style>body{max-width:820px;margin:48px auto;font-family:system-ui,sans-serif;line-height:1.7;padding:0 24px;color:#1f2937}h1,h2,h3{margin-top:2em}h2{border-bottom:1px solid #e5e7eb;padding-bottom:.4em}a{color:#2563eb}pre{background:#1f2937;color:#f9fafb;padding:1em;border-radius:8px;overflow-x:auto}code{background:#f3f4f6;padding:.15em .4em;border-radius:4px;font-size:.9em}</style>\n</head>\n<body>\n${html}\n</body>\n</html>`
      trigger(new Blob([wrapped], { type: 'text/html' }), `${base}.html`)
    }
  }

  const trigger = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabLabel = tab === 'html' ? 'Copy HTML' : tab === 'markdown' ? 'Copy MD' : 'Copy'

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Saved banner */}
      {savedDir && filename && (
        <div className="px-4 py-2.5 bg-green-50 border-b border-green-100 flex items-center gap-2 text-sm text-green-700">
          <FolderOpen className="w-4 h-4 flex-shrink-0" />
          <span>
            Auto-saved to{' '}
            <code className="font-mono bg-green-100 px-1.5 py-0.5 rounded text-xs">
              {savedDir}/{filename}
            </code>
          </span>
        </div>
      )}

      {/* Tab bar + action buttons */}
      <div className="flex items-center justify-between px-4 border-b border-gray-200 bg-gray-50 flex-wrap gap-y-1">
        <div className="flex">
          {([
            { id: 'preview'  as Tab, label: 'Preview',  Icon: Eye },
            { id: 'markdown' as Tab, label: 'Markdown', Icon: Code },
            { id: 'html'     as Tab, label: 'HTML',     Icon: FileCode },
          ]).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === id
                  ? `${ac.border} ${ac.text}`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 py-2">
          <button
            onClick={() => copy()}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : tabLabel}
          </button>
          <button
            onClick={() => download('md')}
            title="Download as .md"
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            .md
          </button>
          <button
            onClick={() => download('html')}
            title="Download as .html"
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            .html
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="max-h-[600px] overflow-y-auto">
        {tab === 'preview' && (
          <div className="p-5 sm:p-8 prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        )}
        {tab === 'markdown' && (
          <pre className="p-5 sm:p-8 whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">{content}</pre>
        )}
        {tab === 'html' && (
          <pre className="p-5 sm:p-8 whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">{html}</pre>
        )}
      </div>

      {/* "Use this in" guide */}
      <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Use this content in
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {USE_IN.map(({ name, tab: suggestedTab, hint }) => (
            <button
              key={name}
              onClick={() => {
                setTab(suggestedTab)
                copy(getTabContent(suggestedTab))
              }}
              className={`group text-left p-2.5 bg-white border border-gray-200 rounded-lg transition-colors ${ac.tile}`}
            >
              <p className="text-sm font-medium text-gray-800">{name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <ExternalLink className="w-3 h-3" />
          Click any destination — it switches to the right format and copies to clipboard instantly.
        </p>
      </div>
    </div>
  )
}
