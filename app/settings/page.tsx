import { Settings, Database, Key, Globe } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Settings
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Configure your SEO Content Guide preferences
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* API Configuration */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">API Configuration</h2>
              <p className="text-sm text-gray-500">Connect external services</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DataForSEO API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="Enter your DataForSEO API key"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Used for advanced keyword research</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics Property ID (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., 123456789"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Connect for performance insights</p>
            </div>
          </div>
        </div>

        {/* Content Settings */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Content Settings</h2>
              <p className="text-sm text-gray-500">Default content generation options</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Word Count Target
              </label>
              <select className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base">
                <option>1,500 - 2,000 words</option>
                <option>2,000 - 2,500 words</option>
                <option selected>2,500 - 3,000 words</option>
                <option>3,000 - 4,000 words</option>
                <option>4,000+ words</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Style
              </label>
              <select className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base">
                <option>Conversational</option>
                <option selected>Professional</option>
                <option>Academic</option>
                <option>Technical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Company Information</h2>
              <p className="text-sm text-gray-500">Basic info for content generation</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                placeholder="Your Company Name"
                className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                placeholder="https://yourcompany.com"
                className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <input
                type="text"
                placeholder="e.g., SaaS, E-commerce, Healthcare"
                className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center sm:justify-end">
          <button className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/20">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
