'use client'

import { useState } from 'react'
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
  FolderOpen,
  Menu,
  X
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

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">SEO Content Guide</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        lg:hidden fixed top-14 left-0 right-0 z-40 bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-y-0' : '-translate-y-full'}
        max-h-[calc(100vh-3.5rem)] overflow-y-auto
      `}>
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
