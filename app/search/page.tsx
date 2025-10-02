'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Star, ExternalLink, Sparkles, Loader } from 'lucide-react'
import alternativesData from '../../data/alternatives.json'

interface Alternative {
  name: string
  description: string
  pricing: string
  pros: string[]
  cons: string[]
  rating: number
  website: string
  affiliate: boolean
}

interface AlternativeGroup {
  id: string
  name: string
  category: string
  description: string
  keywords: string[]
  alternatives: Alternative[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)
  const [searchResults, setSearchResults] = useState<AlternativeGroup[]>([])
  const [aiResults, setAiResults] = useState<any>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [showAIResults, setShowAIResults] = useState(false)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setAiResults(null)
      setShowAIResults(false)
      return
    }

    // Search existing database first
    const results = alternativesData.alternatives.filter((item: AlternativeGroup) => {
      const searchLower = searchTerm.toLowerCase()
      
      // Search in name
      if (item.name.toLowerCase().includes(searchLower)) return true
      
      // Search in keywords
      if (item.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))) return true
      
      // Search in description
      if (item.description.toLowerCase().includes(searchLower)) return true
      
      // Search in category
      if (item.category.toLowerCase().includes(searchLower)) return true
      
      // Search in alternative names
      if (item.alternatives.some(alt => alt.name.toLowerCase().includes(searchLower))) return true
      
      return false
    })

    setSearchResults(results)

    // If no results found, try AI generation
    if (results.length === 0) {
      generateAIAlternatives(searchTerm)
    }
  }

  const generateAIAlternatives = async (productName: string) => {
    setIsLoadingAI(true)
    setAiResults(null)

    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName }),
      })

      const data = await response.json()
      
      // Handle blocked content
      if (data.blocked) {
        setAiResults({
          blocked: true,
          category: data.category,
          message: data.message,
          alternatives: data.alternatives
        })
        setShowAIResults(true)
        return
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate alternatives')
      }

      setAiResults(data)
      setShowAIResults(true)
    } catch (error) {
      console.error('Error generating AI alternatives:', error)
      // Show fallback message
      setAiResults({
        error: true,
        message: 'Unable to generate alternatives at the moment'
      })
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`)
      performSearch(searchQuery)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
              <span className="ml-2 text-gray-500">/ Search Results</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
              <Link href="/trending" className="text-gray-600 hover:text-indigo-600">Trending</Link>
              <Link href="/submit" className="text-gray-600 hover:text-indigo-600">Submit</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for alternatives..."
                className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {query && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Search Results for "{query}"
            </h1>
            <p className="text-gray-600">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Ad Space */}
        {query && (
          <div className="bg-gray-100 rounded-lg p-6 text-center mb-8">
            <div className="text-gray-500 text-sm mb-2">Advertisement</div>
            <div className="bg-white rounded border-2 border-dashed border-gray-300 p-6">
              <p className="text-gray-400">Google AdSense Banner (728x90)</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && searchResults.length > 0 && (
          <div className="space-y-6">
            {searchResults.map((item) => (
              <Link
                key={item.id}
                href={`/alternatives/${item.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h2 className="text-xl font-semibold text-gray-900 mr-3">
                        {item.name} Alternatives
                      </h2>
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    
                    {/* Top Alternatives Preview */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.alternatives.slice(0, 4).map((alt) => (
                        <div key={alt.name} className="flex items-center bg-gray-50 rounded-lg px-3 py-1">
                          <span className="text-sm text-gray-700 mr-2">{alt.name}</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500 ml-1">{alt.rating}</span>
                          </div>
                        </div>
                      ))}
                      {item.alternatives.length > 4 && (
                        <span className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-lg">
                          +{item.alternatives.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <ExternalLink className="w-5 h-5 text-gray-400 ml-4" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* AI Loading */}
        {query && searchResults.length === 0 && isLoadingAI && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-center mb-4">
                <Loader className="w-8 h-8 text-indigo-600 animate-spin mr-3" />
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating AI Alternatives</h2>
              <p className="text-gray-600">
                Using AI to find the best alternatives for "{query}"...
              </p>
            </div>
          </div>
        )}

        {/* Blocked Content */}
        {query && searchResults.length === 0 && !isLoadingAI && aiResults?.blocked && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-red-900">
                Search Not Supported
              </h2>
            </div>
            <p className="text-red-800 mb-4">{aiResults.message}</p>
            
            {aiResults.alternatives && aiResults.alternatives.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-red-900 mb-3">Try these instead:</h3>
                <ul className="space-y-2">
                  {aiResults.alternatives.map((alt: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span className="text-red-800">{alt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 flex space-x-3">
              <Link
                href="/categories"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
              >
                Browse Categories
              </Link>
              <Link
                href="/trending"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
              >
                View Trending
              </Link>
            </div>
          </div>
        )}

        {/* AI Generated Results */}
        {query && searchResults.length === 0 && !isLoadingAI && aiResults && !aiResults.error && !aiResults.blocked && (
          <div className="space-y-6">
            {/* Check if AI returned setup message */}
            {aiResults.alternatives?.[0]?.name === 'No AI Available' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    AI Setup Required for "{query}"
                  </h2>
                </div>
                <p className="text-gray-700 mb-4">
                  To get real, accurate alternatives for any software, configure one of these AI providers:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 border">
                    <h3 className="font-semibold text-purple-700">Perplexity</h3>
                    <p className="text-sm text-gray-600">Best for research</p>
                    <p className="text-xs text-green-600">~$0.001/request</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <h3 className="font-semibold text-blue-700">Gemini 2.5 Pro</h3>
                    <p className="text-sm text-gray-600">Great quality</p>
                    <p className="text-xs text-green-600">Very affordable</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <h3 className="font-semibold text-indigo-700">OpenRouter</h3>
                    <p className="text-sm text-gray-600">Multiple models</p>
                    <p className="text-xs text-green-600">Flexible pricing</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Add any API key to your <code className="bg-gray-200 px-1 rounded">.env.local</code> file to enable AI-powered alternatives.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      AI-Generated Alternatives for "{query}"
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm">
                    These alternatives were generated using AI based on your search. Results may vary in accuracy.
                  </p>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiResults.alternatives?.map((alt: any, index: number) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">{alt.name}</h3>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {alt.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{alt.description}</p>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center mr-4">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-600">{alt.rating}/5</span>
                        </div>
                        <span className="text-sm font-medium text-green-600">{alt.pricing}</span>
                      </div>

                      {/* Pros */}
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-green-700 mb-1">Pros:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {alt.pros?.slice(0, 3).map((pro: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="text-green-500 mr-1">•</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cons */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-red-700 mb-1">Cons:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {alt.cons?.slice(0, 2).map((con: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="text-red-500 mr-1">•</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <a
                    href={alt.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center justify-center text-sm"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              ))}
            </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> These alternatives were generated by AI and may not be 100% accurate. 
                    Please verify information before making decisions. 
                    <Link href="/submit" className="underline ml-1">Submit corrections</Link> if you find errors.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* No Results and AI Failed */}
        {query && searchResults.length === 0 && !isLoadingAI && (!aiResults || aiResults.error) && !aiResults?.blocked && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No results found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any alternatives for "{query}". Try a different search term or browse our categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => generateAIAlternatives(query)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try AI Generation
                </button>
                <Link
                  href="/categories"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Browse Categories
                </Link>
                <Link
                  href="/submit"
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Submit Alternative
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Popular Searches (when no query) */}
        {!query && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Searches</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {['Notion', 'Figma', 'Photoshop', 'Slack', 'Discord', 'Canva', 'Zoom', 'GitHub'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term)
                    window.history.pushState({}, '', `/search?q=${encodeURIComponent(term)}`)
                    performSearch(term)
                  }}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <span className="text-gray-700">{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}