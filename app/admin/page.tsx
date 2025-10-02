'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Database, TrendingUp, Zap, RefreshCw, Download } from 'lucide-react'

interface CacheStats {
  totalEntries: number
  aiGenerated: number
  manual: number
  mostSearched: Array<{ name: string; count: number }>
}

export default function AdminPage() {
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [contentStats, setContentStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      const [cacheResponse, contentResponse] = await Promise.all([
        fetch('/api/cache-stats'),
        fetch('/api/content-stats')
      ])
      
      const cacheData = await cacheResponse.json()
      const contentData = await contentResponse.json()
      
      if (cacheData.success) {
        setStats(cacheData.stats)
      }
      if (contentData.success) {
        setContentStats(contentData.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const performAction = async (action: string) => {
    setActionLoading(action)
    try {
      const response = await fetch('/api/cache-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const data = await response.json()
      if (data.success) {
        alert(`${action} completed successfully!`)
        fetchStats() // Refresh stats
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error)
      alert(`Error performing ${action}`)
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
              <span className="ml-2 text-gray-500">/ Admin Dashboard</span>
            </div>
            <button
              onClick={fetchStats}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cache Management</h1>
          <p className="text-gray-600">Monitor and manage your AI-generated alternatives cache</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cache statistics...</p>
          </div>
        ) : stats ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Cached</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">AI Generated</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.aiGenerated}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Manual Entries</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.manual}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold">%</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalEntries > 0 ? Math.round((stats.aiGenerated / stats.totalEntries) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Filtering Stats */}
            {contentStats && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Content Filtering</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{contentStats.totalBlocked}</div>
                    <div className="text-sm text-red-700">Total Blocked</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{contentStats.categories.adult || 0}</div>
                    <div className="text-sm text-orange-700">Adult Content</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{contentStats.categories.illegal || 0}</div>
                    <div className="text-sm text-yellow-700">Illegal Content</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-600">{contentStats.categories.spam || 0}</div>
                    <div className="text-sm text-gray-700">Spam/Invalid</div>
                  </div>
                </div>
                
                {contentStats.topBlocked.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Most Blocked Searches</h3>
                    <div className="space-y-2">
                      {contentStats.topBlocked.slice(0, 5).map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <span className="text-red-800 font-mono text-sm">
                            {item.query.length > 20 ? item.query.substring(0, 20) + '...' : item.query}
                          </span>
                          <span className="text-red-600 text-sm">{item.attempts} attempts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Most Searched */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Most Searched Alternatives</h2>
              {stats.mostSearched.length > 0 ? (
                <div className="space-y-3">
                  {stats.mostSearched.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900 capitalize">{item.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">{item.count} searches</span>
                        <Link
                          href={`/search?q=${encodeURIComponent(item.name)}`}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No search data available yet</p>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cache Management Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => performAction('cleanup')}
                  disabled={actionLoading === 'cleanup'}
                  className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {actionLoading === 'cleanup' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Cleanup Old Entries
                </button>

                <button
                  onClick={() => performAction('export')}
                  disabled={actionLoading === 'export'}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {actionLoading === 'export' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Export Popular to Main DB
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Cleanup removes old entries with low search counts. Export adds popular cached items to the main database.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load cache statistics</p>
          </div>
        )}
      </div>
    </div>
  )
}