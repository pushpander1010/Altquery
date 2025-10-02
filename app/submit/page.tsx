'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, Plus, X } from 'lucide-react'

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    description: '',
    website: '',
    alternatives: [''],
    submitterEmail: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const addAlternative = () => {
    setFormData({
      ...formData,
      alternatives: [...formData.alternatives, '']
    })
  }

  const removeAlternative = (index: number) => {
    const newAlternatives = formData.alternatives.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      alternatives: newAlternatives
    })
  }

  const updateAlternative = (index: number, value: string) => {
    const newAlternatives = [...formData.alternatives]
    newAlternatives[index] = value
    setFormData({
      ...formData,
      alternatives: newAlternatives
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd send this to your backend
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your submission has been received. We'll review it and add it to our database within 24-48 hours.
            </p>
            <Link
              href="/"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
              <span className="ml-2 text-gray-500">/ Submit Alternative</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
              <Link href="/trending" className="text-gray-600 hover:text-indigo-600">Trending</Link>
              <Link href="/submit" className="text-indigo-600 font-medium">Submit</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit an Alternative</h1>
          <p className="text-xl text-gray-600">
            Help the community by suggesting alternatives to popular software and services.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                Product/Service Name *
              </label>
              <input
                type="text"
                id="productName"
                required
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Photoshop, Slack, Notion"
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                required
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select a category</option>
                <option value="productivity">Productivity</option>
                <option value="design">Design</option>
                <option value="development">Development</option>
                <option value="communication">Communication</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={3}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Brief description of what this product/service does"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Official Website
              </label>
              <input
                type="url"
                id="website"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>

            {/* Alternatives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Known Alternatives *
              </label>
              <p className="text-sm text-gray-500 mb-3">
                List alternatives you know about (minimum 1 required)
              </p>
              
              {formData.alternatives.map((alt, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    required={index === 0}
                    className="flex-1 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder={`Alternative ${index + 1}`}
                    value={alt}
                    onChange={(e) => updateAlternative(index, e.target.value)}
                  />
                  {formData.alternatives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAlternative(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addAlternative}
                className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Another Alternative
              </button>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email (optional)
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="your@email.com"
                value={formData.submitterEmail}
                onChange={(e) => setFormData({...formData, submitterEmail: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-1">
                We'll credit you when we publish your submission (optional)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 flex items-center justify-center font-medium"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Alternative
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-3">Submission Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Make sure the product/service actually exists and is actively maintained</li>
            <li>• Provide accurate information and working website links</li>
            <li>• Focus on legitimate alternatives, not spam or promotional content</li>
            <li>• We review all submissions before publishing (24-48 hours)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}