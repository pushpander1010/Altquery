'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, Target, Sparkles, CheckCircle } from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  category: string
}

interface QuizResult {
  category: string
  recommendations: string[]
  description: string
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your primary use case?",
    options: ["Design & Creative Work", "Productivity & Organization", "Communication & Collaboration", "Development & Coding", "Marketing & Business"],
    category: "purpose"
  },
  {
    id: 2,
    question: "What's your budget preference?",
    options: ["Free only", "Under $10/month", "$10-50/month", "$50+/month", "One-time purchase"],
    category: "budget"
  },
  {
    id: 3,
    question: "How important is team collaboration?",
    options: ["Not important (solo work)", "Somewhat important", "Very important", "Critical requirement"],
    category: "collaboration"
  },
  {
    id: 4,
    question: "What's your technical expertise level?",
    options: ["Beginner (need simple tools)", "Intermediate", "Advanced", "Expert (can handle complex tools)"],
    category: "expertise"
  },
  {
    id: 5,
    question: "Which platform do you primarily use?",
    options: ["Windows", "Mac", "Linux", "Web-based only", "Mobile-first"],
    category: "platform"
  }
]

const quizResults: Record<string, QuizResult> = {
  "design_free": {
    category: "Design Tools (Free)",
    recommendations: ["GIMP", "Canva", "Figma (Free)", "Inkscape"],
    description: "Perfect free design tools for creative work"
  },
  "design_paid": {
    category: "Design Tools (Premium)",
    recommendations: ["Adobe Creative Suite", "Sketch", "Affinity Designer", "Canva Pro"],
    description: "Professional design tools with advanced features"
  },
  "productivity_free": {
    category: "Productivity Tools (Free)",
    recommendations: ["Notion (Free)", "Obsidian", "Google Workspace", "Trello"],
    description: "Free tools to boost your productivity"
  },
  "productivity_paid": {
    category: "Productivity Tools (Premium)",
    recommendations: ["Notion Pro", "Monday.com", "Asana Premium", "Todoist Premium"],
    description: "Advanced productivity tools for professionals"
  },
  "communication_free": {
    category: "Communication Tools (Free)",
    recommendations: ["Discord", "Slack (Free)", "Telegram", "Zoom (Basic)"],
    description: "Free communication and collaboration tools"
  },
  "development_free": {
    category: "Development Tools (Free)",
    recommendations: ["VS Code", "GitHub", "GitLab", "Postman"],
    description: "Essential free tools for developers"
  }
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer }
    setAnswers(newAnswers)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate result
      calculateResult(newAnswers)
    }
  }

  const calculateResult = (allAnswers: Record<number, string>) => {
    const purpose = allAnswers[0]
    const budget = allAnswers[1]
    
    let resultKey = "productivity_free"

    if (purpose?.includes("Design")) {
      resultKey = budget?.includes("Free") ? "design_free" : "design_paid"
    } else if (purpose?.includes("Productivity")) {
      resultKey = budget?.includes("Free") ? "productivity_free" : "productivity_paid"
    } else if (purpose?.includes("Communication")) {
      resultKey = "communication_free"
    } else if (purpose?.includes("Development")) {
      resultKey = "development_free"
    }

    setQuizResult(quizResults[resultKey])
    setShowResults(true)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setQuizResult(null)
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (showResults && quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
              <span className="ml-2 text-gray-500">/ Quiz Results</span>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Perfect Alternatives!</h1>
            <p className="text-xl text-gray-600">Based on your preferences, here are our recommendations:</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-600 mb-2">{quizResult.category}</h2>
              <p className="text-gray-600">{quizResult.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizResult.recommendations.map((tool, index) => (
                <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{tool}</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Recommended based on your preferences for {quizResult.category.toLowerCase()}.
                  </p>
                  <Link
                    href={`/search?q=${encodeURIComponent(tool)}`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm inline-block"
                  >
                    View Alternatives
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={resetQuiz}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 mr-4"
            >
              Take Quiz Again
            </button>
            <Link
              href="/compare"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 inline-block"
            >
              Compare These Tools
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
            <span className="ml-2 text-gray-500">/ Alternative Finder Quiz</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span className="text-sm text-gray-600">{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {quizQuestions[currentQuestion].question}
            </h2>
            <p className="text-gray-600">Choose the option that best describes your needs</p>
          </div>

          <div className="space-y-4">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 text-left bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 border border-gray-200 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 group-hover:text-indigo-900">{option}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={goBack}
            disabled={currentQuestion === 0}
            className={`flex items-center px-6 py-3 rounded-lg ${
              currentQuestion === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex items-center text-sm text-gray-500">
            <Sparkles className="w-4 h-4 mr-1" />
            Personalized recommendations coming up!
          </div>
        </div>
      </div>
    </div>
  )
}