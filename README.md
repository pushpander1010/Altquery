# AltQuery - SQL Practice Platform

Free SQL practice platform with 1050+ interactive questions. No login required.

## Features

- 🎯 **1050+ Questions** - Easy, Medium, and Hard difficulty levels
- 💻 **In-Browser SQL** - Powered by SQL.js (SQLite WASM)
- ✅ **Instant Validation** - Know if your answer is correct immediately
- 🤖 **AI Assistant** - Get hints and help via LiquidAI (LFM2-24B-A2B model)
- 📚 **Multiple Topics** - SELECT, JOINs, Window Functions, CTEs, Subqueries, and more
- 🎨 **Modern UI** - Dark theme with Monaco Editor (VS Code's editor)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Together AI API key:
```
TOGETHER_API_KEY=your_actual_key_here
```

Get your free API key from [Together AI](https://api.together.xyz/)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Altquery/
├── app/
│   ├── api/ai-assistant/    # AI assistant API route
│   ├── question/[id]/       # Question detail pages
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── privacy/             # Privacy policy
│   ├── terms/               # Terms of service
│   ├── page.tsx             # Homepage (questions list)
│   ├── layout.tsx           # Root layout
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.ts            # Robots.txt
├── lib/
│   ├── questions.ts         # Question types
│   └── questions-data.ts    # 1050+ questions
├── public/
│   └── sql-wasm/            # SQL.js WASM files
└── scripts/                 # Question generation scripts
```

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **SQL Engine:** SQL.js (SQLite WASM)
- **Editor:** Monaco Editor
- **AI:** Together AI (LiquidAI/LFM2-24B-A2B model)

## Deployment

Deploy to Vercel, Netlify, or any platform that supports Next.js.

**Environment Variables:**
- `TOGETHER_API_KEY` - Required for AI assistant

## License

MIT
