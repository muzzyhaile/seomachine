'use client'

import { Globe } from 'lucide-react'

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
]

interface LanguageSelectorProps {
  value: string
  onChange: (code: string) => void
  className?: string
  showLabel?: boolean
}

export default function LanguageSelector({ 
  value, 
  onChange, 
  className = '',
  showLabel = true 
}: LanguageSelectorProps) {
  const selectedLanguage = LANGUAGES.find(l => l.code === value) || LANGUAGES[0]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <Globe className="w-4 h-4" />
          Language
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all cursor-pointer"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}

// Helper to get language name from code
export function getLanguageName(code: string): string {
  const lang = LANGUAGES.find(l => l.code === code)
  return lang?.name || 'English'
}
