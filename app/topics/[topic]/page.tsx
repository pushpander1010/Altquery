import { notFound } from 'next/navigation'
import Link from 'next/link'
import { QUESTIONS, TOPICS } from '@/lib/questions'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ topic: string }>
}

const TOPIC_DESCRIPTIONS: Record<string, { desc: string; longDesc: string; tips: string[] }> = {
  'SELECT Basics': {
    desc: 'Master the fundamentals of SQL SELECT statements — retrieving data from tables, selecting specific columns, and using aliases.',
    longDesc: 'SELECT is the foundation of every SQL query. This topic covers selecting specific columns, using aliases for readability, fetching all columns with wildcard, and retrieving unique values with DISTINCT. Mastering SELECT basics is essential before moving to filtering, aggregation, or joins. Every data analyst, backend developer, and database administrator starts here.',
    tips: ['Always specify column names instead of using SELECT *', 'Use aliases (AS) for computed columns', 'DISTINCT removes duplicate rows from results'],
  },
  'Filtering': {
    desc: 'Learn to filter query results with WHERE clauses, comparison operators, logical operators, and pattern matching.',
    longDesc: 'Filtering is how you narrow down results to exactly what you need. This topic covers WHERE clauses with comparison operators (=, <, >, <=, >=, <>), logical operators (AND, OR, NOT), range filtering with BETWEEN, set membership with IN, and pattern matching with LIKE. You will also learn about NULL handling with IS NULL and IS NOT NULL — a common source of bugs.',
    tips: ['Use BETWEEN for date ranges instead of >= AND <=', 'LIKE with % wildcard matches any sequence of characters', 'NULL comparisons always use IS NULL, not = NULL'],
  },
  'Aggregation': {
    desc: 'Aggregate data with COUNT, SUM, AVG, MIN, MAX and group results with GROUP BY and HAVING clauses.',
    longDesc: 'Aggregation lets you summarize large datasets into meaningful metrics. This topic covers aggregate functions (COUNT, SUM, AVG, MIN, MAX), grouping rows with GROUP BY, filtering groups with HAVING, and combining aggregation with ordering. These skills are essential for reporting, analytics, and dashboards.',
    tips: ['COUNT(*) counts all rows including NULLs', 'HAVING filters after grouping, WHERE filters before', 'Use alias names with aggregate functions for cleaner output'],
  },
  'JOINs': {
    desc: 'Combine data from multiple tables using INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, and CROSS JOIN.',
    longDesc: 'JOINs are the most powerful SQL feature for working with relational databases. This topic covers INNER JOIN (matching rows only), LEFT JOIN (all rows from left table), RIGHT JOIN (all rows from right table), FULL OUTER JOIN (all rows from both tables), and CROSS JOIN (cartesian product). Understanding JOINs is critical for any developer working with normalized databases.',
    tips: ['INNER JOIN only returns rows with matches in both tables', 'LEFT JOIN preserves all rows from the left table', 'Always specify the join condition to avoid cartesian products'],
  },
  'Subqueries': {
    desc: 'Use nested queries in WHERE, FROM, and SELECT clauses for complex data retrieval and comparison.',
    longDesc: 'Subqueries (nested queries) let you use the result of one query inside another. This topic covers scalar subqueries, IN subqueries, EXISTS clauses, correlated subqueries, and subqueries in FROM clauses. Subqueries are essential for complex filtering, comparisons, and when you need to break a problem into logical steps.',
    tips: ['Use IN subqueries for set membership checks', 'EXISTS is often faster than IN for large datasets', 'Correlated subqueries reference the outer query — use carefully'],
  },
  'Window Functions': {
    desc: 'Perform calculations across sets of rows without collapsing them using ROW_NUMBER, RANK, LAG, LEAD, and aggregate windows.',
    longDesc: 'Window functions perform calculations across a set of rows related to the current row, without collapsing them like GROUP BY. This topic covers ranking functions (ROW_NUMBER, RANK, DENSE_RANK), aggregate windows (SUM OVER, AVG OVER), and navigation functions (LAG, LEAD, FIRST_VALUE). Window functions are essential for running totals, moving averages, and ranking queries.',
    tips: ['ROW_NUMBER assigns unique numbers even for ties', 'PARTITION BY divides the window into groups', 'ORDER BY inside OVER() determines the row ordering'],
  },
  'CTEs': {
    desc: 'Write readable, maintainable queries with Common Table Expressions using the WITH clause.',
    longDesc: 'Common Table Expressions (CTEs) create temporary named result sets that improve query readability and enable recursive queries. This topic covers basic CTEs with WITH, multiple CTEs in a single query, recursive CTEs for hierarchical data, and CTEs vs subqueries. CTEs are the modern standard for writing complex SQL.',
    tips: ['CTEs improve readability over nested subqueries', 'Recursive CTEs use WITH RECURSIVE and a termination condition', 'Multiple CTEs can be chained with commas'],
  },
  'String Functions': {
    desc: 'Manipulate text data with CONCAT, SUBSTRING, TRIM, UPPER, LOWER, LENGTH, and pattern extraction.',
    longDesc: 'String functions let you transform, extract, and manipulate text data directly in SQL. This topic covers concatenation (CONCAT, ||), extraction (SUBSTRING, LEFT, RIGHT, INSTR), transformation (UPPER, LOWER, INITCAP, REVERSE), cleaning (TRIM, LTRIM, RTRIM), and length measurement (LENGTH, CHAR_LENGTH). These are essential for data cleaning and formatting.',
    tips: ['Use TRIM to remove leading/trailing whitespace from user input', 'CONCAT_WS adds a separator between concatenated values', 'INSTR finds the position of a substring — useful for extraction'],
  },
  'Date Functions': {
    desc: 'Work with dates and times using date arithmetic, extraction, formatting, and interval calculations.',
    longDesc: 'Date functions handle temporal data — one of the most common data types in real-world databases. This topic covers date extraction (YEAR, MONTH, DAY, DAYOFWEEK), date arithmetic (adding/subtracting intervals), formatting, and current date/time functions. Date manipulation is critical for reporting, scheduling, and time-series analysis.',
    tips: ['Use DATE_TRUNC for grouping by month/quarter/year', 'DATEADD/DATEDIFF for date arithmetic', 'Always store dates in ISO 8601 format (YYYY-MM-DD)'],
  },
  'CASE Statements': {
    desc: 'Add conditional logic to queries with CASE WHEN for dynamic categorization, pivoting, and computed columns.',
    longDesc: 'CASE statements add if-else logic directly in SQL queries. This topic covers simple CASE, searched CASE, CASE in SELECT (computed columns), CASE in ORDER BY, and CASE in aggregate functions (conditional aggregation). CASE is essential for data transformation, creating categories, and pivoting data without application code.',
    tips: ['Use CASE in COUNT for conditional counting', 'CASE in ORDER BY enables custom sort orders', 'Nested CASE works but consider COALESCE for simple defaults'],
  },
}

export async function generateStaticParams() {
  return TOPICS.map((topic) => ({ topic: encodeURIComponent(topic) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: encodedTopic } = await params
  const topic = decodeURIComponent(encodedTopic)
  const meta = TOPIC_DESCRIPTIONS[topic]

  return {
    title: `SQL ${topic} Practice Questions | AltQuery`,
    description: meta?.desc || `Practice SQL ${topic} questions on AltQuery. Free interactive exercises with instant feedback.`,
    alternates: { canonical: `https://www.altquery.com/topics/${encodedTopic}` },
    openGraph: {
      title: `SQL ${topic} Practice Questions | AltQuery`,
      description: meta?.desc || `Practice SQL ${topic} questions on AltQuery.`,
      url: `https://www.altquery.com/topics/${encodedTopic}`,
      type: 'article',
    },
  }
}

export default async function TopicPage({ params }: PageProps) {
  const { topic: encodedTopic } = await params
  const topic = decodeURIComponent(encodedTopic)

  if (!TOPICS.includes(topic as any)) notFound()

  const questions = QUESTIONS.filter((q) => q.topic === topic)
  const easy = questions.filter((q) => q.difficulty === 'easy').length
  const medium = questions.filter((q) => q.difficulty === 'medium').length
  const hard = questions.filter((q) => q.difficulty === 'hard').length
  const meta = TOPIC_DESCRIPTIONS[topic]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.altquery.com/' },
        { '@type': 'ListItem', position: 2, name: 'Topics', item: 'https://www.altquery.com/' },
        { '@type': 'ListItem', position: 3, name: `SQL ${topic}`, item: `https://www.altquery.com/topics/${encodedTopic}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `SQL ${topic} Practice Questions`,
      description: meta?.desc || `Practice SQL ${topic} questions.`,
      url: `https://www.altquery.com/topics/${encodedTopic}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: questions.length,
        itemListElement: questions.slice(0, 10).map((q, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: q.title,
          url: `https://www.altquery.com/question/${q.id}`,
        })),
      },
    },
  ]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
            <li><span className="mx-2 text-slate-600">›</span></li>
            <li><Link href="/" className="hover:text-indigo-400 transition-colors">Topics</Link></li>
            <li><span className="mx-2 text-slate-600">›</span></li>
            <li><span className="text-slate-300 font-medium">SQL {topic}</span></li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            SQL <span className="gradient-text">{topic}</span> Questions
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-6">
            {meta?.desc || `Practice ${topic} SQL questions with instant feedback.`}
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="badge-easy">{easy} Easy</span>
            <span className="badge-medium">{medium} Medium</span>
            <span className="badge-hard">{hard} Hard</span>
          </div>
        </div>

        {/* SEO Content */}
        {meta && (
          <div className="card mb-10 p-6">
            <h2 className="text-xl font-bold text-white mb-3">About SQL {topic}</h2>
            <p className="text-slate-300 leading-relaxed mb-4">{meta.longDesc}</p>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">Tips</h3>
            <ul className="space-y-1">
              {meta.tips.map((tip, i) => (
                <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Question List */}
        <div className="space-y-3">
          {questions.map((q) => (
            <Link
              key={q.id}
              href={`/question/${q.id}`}
              className="card hover:border-indigo-700 hover:shadow-lg transition-all block group p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {q.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">{q.description}</p>
                </div>
                <span className={`badge-${q.difficulty} shrink-0`}>{q.difficulty}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
