import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const TOGETHER_BASE = 'https://api.together.xyz/v1'
const MODEL = 'google/gemma-3n-E4B-it'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { category, topics, country } = await req.json()
  if (!category) return NextResponse.json({ error: 'category required' }, { status: 400 })

  const apiKey = process.env.TOGETHER_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'TOGETHER_API_KEY not set in .env.local' }, { status: 503 })

  const topicContext = topics?.length
    ? `Currently trending topics: ${topics.slice(0, 10).join(', ')}.`
    : ''

  const prompt = `You are a viral content expert. Generate exactly 50 hot, click-worthy video headings/titles for the "${category}" niche targeting ${country || 'a global audience'}.

${topicContext}

Rules:
- Each title must be under 70 characters
- Mix formats: How-to, Lists, Shocking facts, Questions, Challenges, Stories, Comparisons
- Make them scroll-stopping and emotionally compelling
- Optimize for YouTube Shorts, Instagram Reels, and TikTok
- Number each one 1-50
- No explanations, just the numbered list of titles

Output format:
1. [Title]
2. [Title]
...
50. [Title]`

  const res = await fetch(`${TOGETHER_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      max_tokens: 2000,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: err?.error?.message || `Together AI error (${res.status})` }, { status: 500 })
  }

  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || ''

  const headings = raw
    .split('\n')
    .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
    .filter((line: string) => line.length > 5)
    .slice(0, 50)

  return NextResponse.json({ headings, category, country })
}
