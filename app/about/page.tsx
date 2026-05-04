export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 gradient-text">About AltQuery</h1>
      
      <div className="space-y-6 text-slate-300">
        <section className="card">
          <h2 className="text-2xl font-semibold mb-4 text-white">What is AltQuery?</h2>
          <p className="mb-4">
            AltQuery is a free, open SQL practice platform designed to help you master SQL through hands-on practice. 
            No login required, no paywalls—just pure learning.
          </p>
          <p>
            With an in-browser SQL engine powered by SQL.js, you can write and execute queries instantly without 
            any setup or installation.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-4 text-white">Features</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>50+ SQL practice questions across all difficulty levels</li>
            <li>In-browser SQL editor with instant execution</li>
            <li>AI assistant for hints and corrections (powered by Together AI)</li>
            <li>Topics covering SELECT, JOINs, aggregations, window functions, and more</li>
            <li>No login or signup required</li>
            <li>Completely free to use</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-4 text-white">How to Use</h2>
          <ol className="space-y-3 list-decimal list-inside">
            <li>Browse questions on the homepage and filter by difficulty or topic</li>
            <li>Click on a question to open the SQL editor</li>
            <li>Review the database schema and question description</li>
            <li>Write your SQL query in the editor</li>
            <li>Click "Run Query" or press Ctrl+Enter to execute</li>
            <li>Use the AI assistant if you need hints or want to check your approach</li>
          </ol>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-4 text-white">Technology Stack</h2>
          <ul className="space-y-2">
            <li><strong>Frontend:</strong> Next.js 14, React, TypeScript, Tailwind CSS</li>
            <li><strong>SQL Engine:</strong> SQL.js (SQLite compiled to WebAssembly)</li>
            <li><strong>AI:</strong> Together AI (Meta-Llama-3.1-8B-Instruct-Turbo)</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-4 text-white">Tips for Learning</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Start with easy questions to build confidence</li>
            <li>Read the hint before asking the AI assistant</li>
            <li>Try to solve the problem yourself before looking at solutions</li>
            <li>Experiment with different approaches—there's often more than one way to solve a problem</li>
            <li>Use the AI assistant to understand WHY your query works or doesn't work</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
