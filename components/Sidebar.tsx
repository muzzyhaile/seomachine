'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Search,
  PenTool,
  FileText,
  Settings,
  BookOpen,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Research', href: '/research', icon: Search },
  { name: 'Write', href: '/write', icon: PenTool },
  { name: 'Rewrite', href: '/rewrite', icon: RefreshCw },
  { name: 'Drafts', href: '/drafts', icon: FileText },
  { name: 'Output', href: '/output', icon: FolderOpen },
  { name: 'Context', href: '/context', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-700">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">SEO Content Guide</h1>
          <p className="text-xs text-gray-400">Content Creation AI</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-lg p-4">
          <p className="text-sm text-gray-300 mb-2">Quick Tip</p>
          <p className="text-xs text-gray-400">
            Fill out your Context files for better, more personalized content generation.
          </p>
        </div>
      </div>
    </div>
  )
}
