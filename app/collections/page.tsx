'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Star, Users, TrendingUp, Heart, Share2, Filter } from 'lucide-react'

interface Collection {
  id: string
  title: string
  description: string
  alternatives: string[]
  author: string
  likes: number
  views: number
  category: string
  tags: string[]
  featured: boolean
}

const collections: Collection[] = [
  {
    id: 'best-free-design-tools',
    title: 'Best Free Design Tools for Beginners',
    description: 'Curated list of completely free design software that rivals premium alternatives',
    alternatives: ['GIMP', 'Canva', 'Figma', 'Inkscape', 'Blender'],
    author: 'DesignPro',
    likes: 1247,
    views: 15420,
    category: 'Design',
    tags: ['free', 'beginner-friendly', 'design'],
    featured: true
  },
  {
    id: 'productivity-powerhouse',
    title: 'Productivity Powerhouse Stack',
    description: 'The ultimate productivity setup used by top entrepreneurs and creators',
    alternatives: ['Notion', 'Obsidian', 'Todoist', 'RescueTime', 'Forest'],
    author: 'ProductivityGuru',
    likes: 892,
    views: 12100,
    category: 'Productivity',
    tags: ['productivity', 'workflow', 'entrepreneurs'],
    featured: true
  },
  {
    id: 'developer-essentials',
    title: 'Developer Essentials 2024',
    description: 'Must-have tools every developer should know about in 2024',
    alternatives: ['VS Code', 'GitHub', 'Postman', 'Docker', 'Figma'],
    author: 'CodeMaster',
    likes: 2156,
    views: 28900,
    category: 'Development',
    tags: ['development', 'coding', '2024'],
    featured: true
  },
  {
    id: 'remote-work-setup',
    title: 'Remote Work Communication Setup',
    description: 'Perfect tools for distributed teams and remote collaboration',
    alternatives: ['Slack', 'Zoom', 'Notion', 'Miro', 'Loom'],
    author: 'RemoteExpert',
    likes: 634,
    views: 8750,
    category: 'Communication',
    tags: ['remote-work', 'collaboration', 'teams'],
    featured: false
  },
  {
    id: 'startup-toolkit',
    title: 'Startup Toolkit on a Budget',
    description: 'Essential tools for startups that won\'t break the bank',
    alternatives: ['Canva', 'Mailchimp', 'Google Analytics', 'Trello', 'Slack'],
    author: 'StartupFounder',
    likes: 1089,
    views: 14200,
    category: 'Business',
    tags: ['startup', 'budget', 'business'],
    featured: false
  },
  {
    id: 'content-creator-stack',
    title: 'Content Creator\'s Complete Stack',
    description: 'Everything you need to create, edit, and distribute amazing content',
    alternatives: ['Canva', 'OBS Studio', 'Audacity', 'Buffer', 'YouTube Studio'],
    author: 'ContentKing',
    likes: 1567,
    views: 19800,
    category: 'Content Creation',
    tags: ['content', 'creator', 'social-media'],
    featured: true
  }
]

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  const categories = ['All', 'Design', 'Productivity', 'Development', 'Communication', 'Business', 'Content Creation']

  const filteredCollections = collections
    .filter(collection => selectedCategory === 'All' || collection.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      if (sortBy === 'likes') return b.likes - a.likes
      if (sortBy === 'views') return b.views - a.views
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
              <span className="ml-2 text-gray-500">/ Collections</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
              <Link href="/trending" className="text-gray-600 hover:text-indigo-600">Trending</Link>
              <Link href="/collections" className="text-indigo-600 font-medium">Collections</Link>
              <Link href="/submit" className="text-gray-600 hover:text-indigo-600">Submit</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Curated Collections</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover hand-picked collections of alternatives curated by experts and the community.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="likes">Most Liked</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCollections.map((collection) => (
            <div key={collection.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border">
              {/* Collection Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                      {collection.category}
                    </span>
                    {collection.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <button className="text-gray-400 hover:text-red-500">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{collection.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{collection.description}</p>

                {/* Alternatives Preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {collection.alternatives.slice(0, 4).map((alt) => (
                    <span key={alt} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {alt}
                    </span>
                  ))}
                  {collection.alternatives.length > 4 && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">
                      +{collection.alternatives.length - 4} more
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {collection.tags.map((tag) => (
                    <span key={tag} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {collection.likes.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {collection.views.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs">by {collection.author}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    href={`/collections/${collection.id}`}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 text-sm text-center"
                  >
                    View Collection
                  </Link>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Collection CTA */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Create Your Own Collection</h2>
          <p className="mb-6 opacity-90">
            Share your expertise by creating curated collections of alternatives
          </p>
          <Link
            href="/collections/create"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-medium inline-block"
          >
            Start Creating
          </Link>
        </div>

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