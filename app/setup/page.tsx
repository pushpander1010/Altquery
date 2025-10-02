import Link from 'next/link'
import { Key, Zap, CheckCircle, ExternalLink } from 'lucide-react'

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
            <span className="ml-2 text-gray-500">/ AI Setup Guide</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Key className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enable AI-Powered Alternatives
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Configure one AI provider to generate unlimited alternatives for any software or service.
          </p>
        </div>

        {/* Quick Setup */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Setup (5 minutes)</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-indigo-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Choose an AI Provider</h3>
                <p className="text-gray-600 mb-3">Pick one of these recommended options:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-purple-700">Perplexity</h4>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Recommended</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Best for research and current info</p>
                    <p className="text-xs text-green-600 mb-3">~$0.001 per request</p>
                    <a 
                      href="https://www.perplexity.ai/settings/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 text-sm flex items-center"
                    >
                      Get API Key <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <h4 className="font-semibold text-blue-700 mb-2">Gemini 2.5 Pro</h4>
                    <p className="text-sm text-gray-600 mb-2">Great creative content</p>
                    <p className="text-xs text-green-600 mb-3">Very affordable</p>
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                    >
                      Get API Key <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-indigo-300 transition-colors">
                    <h4 className="font-semibold text-indigo-700 mb-2">OpenRouter</h4>
                    <p className="text-sm text-gray-600 mb-2">Multiple models access</p>
                    <p className="text-xs text-green-600 mb-3">Flexible pricing</p>
                    <a 
                      href="https://openrouter.ai/keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
                    >
                      Get API Key <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-indigo-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Create Environment File</h3>
                <p className="text-gray-600 mb-3">Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in your project root:</p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div># Choose ONE of these options:</div>
                  <div className="mt-2"># Option 1: Perplexity (Recommended)</div>
                  <div>PERPLEXITY_API_KEY=your_key_here</div>
                  <div className="mt-2"># Option 2: Gemini</div>
                  <div>GEMINI_API_KEY=your_key_here</div>
                  <div className="mt-2"># Option 3: OpenRouter</div>
                  <div>OPENROUTER_API_KEY=your_key_here</div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-indigo-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Restart Your Server</h3>
                <p className="text-gray-600 mb-3">Restart your development server to load the new environment variables:</p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div># Stop current server (Ctrl+C)</div>
                  <div># Then restart:</div>
                  <div>npm run dev</div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Test It Out!</h3>
                <p className="text-gray-600 mb-3">Search for any software to see AI-generated alternatives in action.</p>
                <Link 
                  href="/search?q=random-software-test"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 inline-flex items-center"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Test AI Search
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Why Enable AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-3xl font-bold">∞</div>
              <div className="font-semibold">Unlimited Content</div>
              <div className="opacity-90">Generate alternatives for ANY software</div>
            </div>
            <div>
              <div className="text-3xl font-bold">⚡</div>
              <div className="font-semibold">Real-time Data</div>
              <div className="opacity-90">Current market information</div>
            </div>
            <div>
              <div className="text-3xl font-bold">💰</div>
              <div className="font-semibold">More Revenue</div>
              <div className="opacity-90">More content = more ad revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}