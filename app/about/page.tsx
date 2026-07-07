import { Code2, Zap, Brain, Target, CheckCircle, Sparkles, BookOpen, Users, Trophy, Rocket } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'About AltQuery — Free SQL Practice Platform',
  description: 'Learn about AltQuery, the free SQL practice platform with 1050+ interactive questions, AI assistant, and no login required.',
  alternates: { canonical: 'https://www.altquery.com/about' },
  openGraph: {
    title: 'About AltQuery — Free SQL Practice Platform',
    description: 'Learn about AltQuery, the free SQL practice platform with 1050+ interactive questions.',
    url: 'https://www.altquery.com/about',
  },
}

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }]} />
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl blob-delay"></div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">About AltQuery</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Master SQL through practice. Free forever. No login required.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="card mb-12 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-800/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600/20 rounded-lg">
            <Target className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3 text-white">Our Mission</h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              We believe learning SQL should be accessible to everyone. AltQuery provides a completely free, 
              no-signup-required platform where you can practice SQL at your own pace. Whether you're preparing 
              for interviews, learning for a new job, or just curious about databases, we've got you covered.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose AltQuery?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="card hover:border-indigo-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-600/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold">1050+ Questions</h3>
            </div>
            <p className="text-slate-400">
              Comprehensive question bank covering everything from basic SELECT statements to advanced window functions and CTEs.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card hover:border-indigo-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-600/20 rounded-lg">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold">Instant Feedback</h3>
            </div>
            <p className="text-slate-400">
              Run queries in your browser and get immediate validation. Know instantly if your answer is correct.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card hover:border-indigo-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">AI Assistant</h3>
            </div>
            <p className="text-slate-400">
              Stuck? Ask our AI assistant for hints, explanations, or corrections. Learn at your own pace.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card hover:border-indigo-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-600/20 rounded-lg">
                <Code2 className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold">Monaco Editor</h3>
            </div>
            <p className="text-slate-400">
              VS Code's powerful editor with syntax highlighting, autocomplete, and keyboard shortcuts.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card hover:border-indigo-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-600/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold">No Setup Required</h3>
            </div>
            <p className="text-slate-400">
              Everything runs in your browser. No installation, no configuration, no database setup needed.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card hover:border-indigo-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-600/20 rounded-lg">
                <Users className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold">100% Free</h3>
            </div>
            <p className="text-slate-400">
              No paywalls, no premium tiers, no hidden costs. All 1050+ questions are completely free forever.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card mb-12">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-400" />
          How It Works
        </h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Browse Questions</h3>
              <p className="text-slate-400">
                Explore 1050+ questions organized by difficulty (Easy, Medium, Hard) and topic (SELECT, JOINs, Window Functions, etc.). 
                Use filters to find exactly what you want to practice.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Understand the Problem</h3>
              <p className="text-slate-400">
                Read the detailed question description, review the database schema, and check the expected output. 
                Each question includes helpful hints and context.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Write Your Query</h3>
              <p className="text-slate-400">
                Use the Monaco Editor (same as VS Code) to write your SQL query. Enjoy autocomplete for table and column names, 
                syntax highlighting, and keyboard shortcuts like Ctrl+Enter to run.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Get Instant Feedback</h3>
              <p className="text-slate-400">
                Run your query and see results immediately. The system automatically validates your answer and shows 
                whether it's correct. If not, the AI assistant can help you understand what went wrong.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-white">
              5
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Learn and Improve</h3>
              <p className="text-slate-400">
                Use hints, ask the AI assistant questions, and experiment with different approaches. 
                The more you practice, the better you'll get!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Covered */}
      <div className="card mb-12 bg-gradient-to-br from-purple-900/10 to-indigo-900/10 border-purple-800/50">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-purple-400" />
          Topics Covered
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">Fundamentals</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                SELECT Basics (100 questions)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Filtering with WHERE (150 questions)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Aggregation & GROUP BY (150 questions)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                String Functions (50 questions)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Date Functions (50 questions)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Advanced</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                JOINs (250 questions)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                Subqueries (100 questions)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                Window Functions (100 questions)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                CTEs (50 questions)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                CASE Statements (50 questions)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card mb-12">
        <h2 className="text-3xl font-bold mb-8">Technology Stack</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-indigo-400">Frontend</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Next.js 14 (App Router)</li>
              <li>• React 18</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Monaco Editor</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-purple-400">SQL Engine</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• SQL.js (SQLite WASM)</li>
              <li>• In-browser execution</li>
              <li>• No server required</li>
              <li>• Instant query results</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">AI Assistant</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Together AI API</li>
              <li>• LiquidAI/LFM2-24B-A2B</li>
              <li>• Context-aware hints</li>
              <li>• Error explanations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Learning Tips */}
      <div className="card mb-12 bg-gradient-to-br from-amber-900/10 to-orange-900/10 border-amber-800/50">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Rocket className="w-8 h-8 text-amber-400" />
          Tips for Success
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 text-2xl">🎯</div>
              <div>
                <h3 className="font-semibold mb-1">Start with Easy Questions</h3>
                <p className="text-sm text-slate-400">Build confidence with fundamentals before tackling harder problems.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 text-2xl">💡</div>
              <div>
                <h3 className="font-semibold mb-1">Read Hints First</h3>
                <p className="text-sm text-slate-400">Try the hint before asking the AI assistant for a more guided learning experience.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 text-2xl">🔍</div>
              <div>
                <h3 className="font-semibold mb-1">Check Expected Output</h3>
                <p className="text-sm text-slate-400">See what the result should look like, but try solving it yourself first!</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 text-2xl">🧪</div>
              <div>
                <h3 className="font-semibold mb-1">Experiment Freely</h3>
                <p className="text-sm text-slate-400">Try different approaches. There's often more than one way to solve a problem.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 text-2xl">📊</div>
              <div>
                <h3 className="font-semibold mb-1">Understand the Schema</h3>
                <p className="text-sm text-slate-400">Always review table structures and relationships before writing queries.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 text-2xl">🚀</div>
              <div>
                <h3 className="font-semibold mb-1">Practice Regularly</h3>
                <p className="text-sm text-slate-400">Consistency is key. Even 15 minutes a day will improve your SQL skills significantly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center card bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-800/50">
        <h2 className="text-3xl font-bold mb-4">Ready to Master SQL?</h2>
        <p className="text-slate-400 mb-6 text-lg">
          Start practicing now with 1050+ questions. No signup required.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
          <Rocket className="w-5 h-5" />
          Start Practicing
        </Link>
      </div>
    </div>
  )
}
