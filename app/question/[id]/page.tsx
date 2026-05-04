'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, RotateCcw, Lightbulb, MessageSquare, CheckCircle, XCircle, Home, ChevronRight } from 'lucide-react'
import { QUESTIONS } from '@/lib/questions'
import initSqlJs, { Database } from 'sql.js'
import Editor from '@monaco-editor/react'
import Script from 'next/script'

export default function QuestionPage() {
  const params = useParams()
  const id = params.id as string
  const question = QUESTIONS.find(q => q.id === id)

  const [sql, setSql] = useState('')
  const [db, setDb] = useState<Database | null>(null)
  const [dbLoading, setDbLoading] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'ai', content: string }>>([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [editorReady, setEditorReady] = useState(false)
  const [selectedDialect, setSelectedDialect] = useState<string>(question?.dialect || 'sqlite')

  // Initialize SQL.js
  useEffect(() => {
    const initDb = async () => {
      try {
        setDbLoading(true)
        console.log('Starting SQL.js initialization...')
        
        // Try browser-specific version first
        let SQL;
        try {
          console.log('Trying browser-specific version...')
          SQL = await initSqlJs({
            locateFile: (file) => {
              const browserFile = file.replace('sql-wasm.wasm', 'sql-wasm-browser.wasm')
              console.log('Locating file:', browserFile, 'at:', `/sql-wasm/${browserFile}`)
              return `/sql-wasm/${browserFile}`
            }
          })
        } catch (e) {
          console.log('Browser version failed, trying standard version...', e)
          SQL = await initSqlJs({
            locateFile: (file) => {
              console.log('Locating file:', file, 'at:', `/sql-wasm/${file}`)
              return `/sql-wasm/${file}`
            }
          })
        }
        
        console.log('SQL.js loaded successfully')
        const database = new SQL.Database()
        console.log('Database created')
        
        if (question) {
          // Execute seed SQL
          console.log('Executing seed SQL...')
          database.exec(question.seedSQL)
          console.log('Seed SQL executed successfully')
        }
        
        setDb(database)
        console.log('Database ready!')
      } catch (err) {
        const error = err as Error
        console.error('Failed to initialize database:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
        setError(`Failed to initialize SQL database: ${error.message}`)
      } finally {
        setDbLoading(false)
      }
    }
    initDb()
  }, [question])

  if (!question) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Question not found</h1>
        <Link href="/" className="btn-primary">
          Back to Questions
        </Link>
      </div>
    )
  }

  const runQuery = () => {
    console.log('Run query clicked', { db, sql })
    if (!db) {
      setError('Database not initialized yet. Please wait...')
      return
    }
    if (!sql.trim()) {
      setError('Please enter a SQL query')
      return
    }

    try {
      setError(null)
      setIsCorrect(null)
      const results = db.exec(sql)
      
      if (results.length === 0) {
        setResult({ columns: [], values: [], message: 'Query executed successfully (no results)' })
        // Check if expected result is also empty
        validateAnswer([], [])
      } else {
        const resultData = {
          columns: results[0].columns,
          values: results[0].values,
          message: `${results[0].values.length} row(s) returned`
        }
        setResult(resultData)
        // Validate answer
        validateAnswer(results[0].columns, results[0].values)
      }
    } catch (err: any) {
      console.error('Query error:', err)
      setError(err.message || 'Query execution failed')
      setResult(null)
      setIsCorrect(false)
    }
  }

  const validateAnswer = (userColumns: string[], userValues: any[][]) => {
    if (!question) return

    // Run the expected query to get correct results
    try {
      const expectedResults = db!.exec(question.expectedQuery)
      
      if (expectedResults.length === 0) {
        // Expected result is empty
        if (userValues.length === 0) {
          setIsCorrect(true)
        } else {
          setIsCorrect(false)
        }
        return
      }

      const expectedColumns = expectedResults[0].columns
      const expectedValues = expectedResults[0].values

      // Check if columns match (order doesn't matter if all expected columns are present)
      const hasAllColumns = question.expectedColumns.every(col => 
        userColumns.some(userCol => userCol.toLowerCase() === col.toLowerCase())
      )

      if (!hasAllColumns) {
        setIsCorrect(false)
        return
      }

      // Check if row count matches
      if (userValues.length !== expectedValues.length) {
        setIsCorrect(false)
        return
      }

      // Sort both results for comparison (to handle different ORDER BY)
      const sortedUser = [...userValues].map(row => JSON.stringify(row)).sort()
      const sortedExpected = [...expectedValues].map(row => JSON.stringify(row)).sort()

      // Compare sorted results
      const resultsMatch = sortedUser.every((row, idx) => row === sortedExpected[idx])
      setIsCorrect(resultsMatch)

    } catch (err) {
      console.error('Validation error:', err)
      // If validation fails, don't show incorrect - just skip validation
      setIsCorrect(null)
    }
  }

  const resetDatabase = () => {
    console.log('Reset clicked', { db, question })
    if (!db) {
      setError('Database not initialized yet. Please wait...')
      return
    }
    try {
      // Drop all tables
      question.schema.forEach(s => {
        try {
          db.exec(`DROP TABLE IF EXISTS ${s.tableName}`)
        } catch (e) {
          console.log('Error dropping table:', e)
        }
      })
      // Re-create tables with seed data
      db.exec(question.seedSQL)
      setResult(null)
      setError(null)
      setSql('')
      setIsCorrect(null)
      console.log('Database reset successfully')
    } catch (err: any) {
      console.error('Reset error:', err)
      setError('Failed to reset database: ' + err.message)
    }
  }

  const askAI = async () => {
    if (!aiInput.trim() || aiLoading) return

    const userMessage = aiInput.trim()
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setAiInput('')
    setAiLoading(true)

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.title,
          description: question.description,
          schema: question.schema,
          userQuery: sql,
          userMessage,
          conversationHistory: aiMessages
        })
      })

      const data = await response.json()
      
      if (data.error) {
        setAiMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }])
      } else {
        setAiMessages(prev => [...prev, { role: 'ai', content: data.response }])
      }
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Structured Data for SEO */}
      <Script id="structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": question.title,
          "description": question.description,
          "educationalLevel": question.difficulty,
          "learningResourceType": "Practice Problem",
          "about": {
            "@type": "Thing",
            "name": "SQL",
            "description": question.topic
          },
          "isAccessibleForFree": true,
          "interactivityType": "active"
        })}
      </Script>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </li>
          <ChevronRight className="w-4 h-4" />
          <li>
            <Link href={`/?topic=${encodeURIComponent(question.topic)}`} className="hover:text-white transition-colors">
              {question.topic}
            </Link>
          </li>
          <ChevronRight className="w-4 h-4" />
          <li className="text-white font-medium" aria-current="page">
            {question.title}
          </li>
        </ol>
      </nav>

      {/* Database Loading Indicator */}
      {dbLoading && (
        <div className="mb-4 p-4 bg-indigo-900/20 border border-indigo-800 rounded-lg text-indigo-200 flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>Initializing SQL database...</span>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Questions
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h1 className="text-3xl font-bold">{question.title}</h1>
              <span className={`badge-${question.difficulty}`}>{question.difficulty}</span>
            </div>
            <p className="text-slate-400 mb-4">{question.description}</p>
            
            {/* SQL Dialect Selector - Improved UI */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Practice with:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedDialect('sqlite')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    selectedDialect === 'sqlite'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                >
                  SQLite
                </button>
                <button
                  onClick={() => setSelectedDialect('mysql')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    selectedDialect === 'mysql'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                >
                  MySQL
                </button>
                <button
                  onClick={() => setSelectedDialect('postgresql')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    selectedDialect === 'postgresql'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                >
                  PostgreSQL
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowHint(!showHint)}
            className="btn-ghost flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? 'Hide' : 'Show'} Hint
          </button>
        </div>
        {showHint && (
          <div className="mt-4 p-4 bg-amber-900/20 border border-amber-800 rounded-lg text-amber-200">
            💡 {question.hint}
          </div>
        )}
      </div>

      {/* Schema */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Database Schema</h2>
        <div className="space-y-4">
          {question.schema.map((table, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="font-mono font-semibold text-indigo-400 mb-2">{table.tableName}</h3>
              <p className="text-sm text-slate-400 mb-3">{table.description}</p>
              <div className="flex flex-wrap gap-2">
                {table.columns.map((col, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-900 rounded text-xs font-mono text-slate-300">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* SQL Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">SQL Editor</h2>
              <div className="flex gap-2">
                <button 
                  onClick={resetDatabase} 
                  disabled={dbLoading || !db}
                  className="btn-ghost flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4" />
                  {dbLoading ? 'Loading...' : 'Reset'}
                </button>
                <button 
                  onClick={runQuery} 
                  disabled={dbLoading || !db}
                  className="btn-success flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {dbLoading ? 'Loading...' : 'Run Query'}
                </button>
              </div>
            </div>
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <Editor
                height="200px"
                defaultLanguage="sql"
                value={sql}
                onChange={(value) => setSql(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  suggest: {
                    showKeywords: true,
                    showSnippets: true,
                  },
                  quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: false
                  }
                }}
                onMount={(editor, monaco) => {
                  setEditorReady(true)
                  
                  // Add Ctrl+Enter keybinding
                  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                    runQuery()
                  })

                  // Register SQL completion provider with table and column names
                  monaco.languages.registerCompletionItemProvider('sql', {
                    provideCompletionItems: (model: any, position: any) => {
                      const suggestions: any[] = []

                      // Add table names
                      question?.schema.forEach(table => {
                        suggestions.push({
                          label: table.tableName,
                          kind: monaco.languages.CompletionItemKind.Class,
                          insertText: table.tableName,
                          detail: table.description,
                          documentation: `Columns: ${table.columns.join(', ')}`
                        })

                        // Add column names
                        table.columns.forEach(col => {
                          suggestions.push({
                            label: col,
                            kind: monaco.languages.CompletionItemKind.Field,
                            insertText: col,
                            detail: `${table.tableName}.${col}`
                          })
                        })
                      })

                      return { suggestions }
                    }
                  })
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Press Ctrl+Enter to run query • Start typing for autocomplete</p>
          </div>

          {/* Validation Result */}
          {isCorrect !== null && (
            <div className={`card ${isCorrect ? 'bg-emerald-900/20 border-emerald-800' : 'bg-amber-900/20 border-amber-800'}`}>
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h3 className="font-semibold text-emerald-400">Correct! 🎉</h3>
                      <p className="text-sm text-emerald-300">Your query returned the expected results.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-amber-400" />
                    <div>
                      <h3 className="font-semibold text-amber-400">Not quite right</h3>
                      <p className="text-sm text-amber-300">Your query results don't match the expected output. Try again or ask the AI assistant for help!</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {error && (
            <div className="card bg-red-900/20 border-red-800">
              <h3 className="font-semibold text-red-400 mb-2">Error</h3>
              <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono">{error}</pre>
            </div>
          )}

          {result && (
            <div className="card">
              <h3 className="font-semibold mb-4 text-emerald-400">{result.message}</h3>
              {result.values.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="result-table">
                    <thead>
                      <tr>
                        {result.columns.map((col: string, i: number) => (
                          <th key={i}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.values.map((row: any[], i: number) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>{cell === null ? 'NULL' : String(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Assistant */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                AI Assistant
              </h2>
            </div>
            
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {aiMessages.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  Ask me for hints, corrections, or explanations!
                </p>
              ) : (
                aiMessages.map((msg, i) => (
                  <div key={i} className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                    {msg.content}
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="chat-bubble-ai">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askAI()}
                placeholder="Ask a question..."
                className="input-field text-sm"
                disabled={aiLoading}
              />
              <button
                onClick={askAI}
                disabled={aiLoading || !aiInput.trim()}
                className="btn-primary px-3"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
