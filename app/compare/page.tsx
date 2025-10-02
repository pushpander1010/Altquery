'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, X, Star, DollarSign, CheckCircle, XCircle, Zap } from 'lucide-react'
import alternativesData from '../../data/alternatives.json'

interface CompareItem {
  name: string
  description: string
  pricing: string
  pros: string[]
  cons: string[]
  rating: number
  website: string
  category: string
}

export default function ComparePage() {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  const searchAlternatives = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: any[] = []
    alternativesData.alternatives.forEach(group => {
      group.alternatives.forEach(alt => {
        if (alt.name.toLowerCase().includes(query.toLowerCase()) ||
            group.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            ...alt,
            category: group.category,
            parentName: group.name
          })
        }
      })
    })
    setSearchResults(results.slice(0, 5))
  }

  const addToCompare = (item: any) => {
    if (compareItems.length >= 4) return
    if (compareItems.find(i => i.name === item.name)) return
    
    setCompareItems([...compareItems, item])
    setSearchQuery('')
    setSearchResults([])
  }

  const removeFromCompare = (name: string) => {
    setCompareItems(compareItems.filter(item => item.name !== name))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
              <span className="ml-2 text-gray-500">/ Compare Alternatives</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
              <Link href="/trending" className="text-gray-600 hover:text-indigo-600">Trending</Link>
              <Link href="/compare" className="text-indigo-600 font-medium">Compare</Link>
              <Link href="/submit" className="text-gray-600 hover:text-indigo-600">Submit</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compare Alternatives</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compare features, pricing, and ratings side-by-side to make the best choice.
          </p>
        </div>

        {/* Search to Add */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <Plus className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Add Software to Compare</h3>
            <span className="ml-2 text-sm text-gray-500">({compareItems.length}/4)</span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for software to compare..."
              className="w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                searchAlternatives(e.target.value)
              }}
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {searchResults.map((item, index) => (
                <div
                  key={index}
                  onClick={() => addToCompare(item)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.category} • {item.pricing}</div>
                  </div>
                  <Plus className="w-4 h-4 text-indigo-600" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {compareItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 w-48">Feature</th>
                    {compareItems.map((item, index) => (
                      <th key={index} className="px-6 py-4 text-center min-w-64">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.category}</div>
                          </div>
                          <button
                            onClick={() => removeFromCompare(item.name)}
                            className="ml-2 p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Rating */}
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Rating</td>
                    {compareItems.map((item, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-semibold">{item.rating}/5</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Pricing */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Pricing</td>
                    {compareItems.map((item, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                          <span className="font-semibold text-green-600">{item.pricing}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Description */}
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Description</td>
                    {compareItems.map((item, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </td>
                    ))}
                  </tr>

                  {/* Pros */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Advantages</td>
                    {compareItems.map((item, index) => (
                      <td key={index} className="px-6 py-4">
                        <ul className="space-y-1">
                          {item.pros.slice(0, 3).map((pro, i) => (
                            <li key={i} className="flex items-start text-sm">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Cons */}
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Disadvantages</td>
                    {compareItems.map((item, index) => (
                      <td key={index} className="px-6 py-4">
                        <ul className="space-y-1">
                          {item.cons.slice(0, 3).map((con, i) => (
                            <li key={i} className="flex items-start text-sm">
                              <XCircle className="w-3 h-3 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Website */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Website</td>
                    {compareItems.map((item, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm inline-block"
                        >
                          Visit Site
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {compareItems.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Comparing</h2>
              <p className="text-gray-600 mb-6">
                Search and add up to 4 alternatives to compare them side-by-side.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {['Notion', 'Figma', 'Photoshop', 'Slack'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term)
                      searchAlternatives(term)
                    }}
                    className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ad Space */}
        <div className="bg-gray-100 rounded-lg p-6 text-center mt-8">
          <div className="text-gray-500 text-sm mb-2">Advertisement</div>
          <div className="bg-white rounded border-2 border-dashed border-gray-300 p-8">
            <p className="text-gray-400">Google AdSense Rectangle (300x250)</p>
          </div>
        </div>
      </div>
    </div>
  )
}