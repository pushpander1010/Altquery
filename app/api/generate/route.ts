import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const TOGETHER_BASE = 'https://api.together.xyz/v1'
const MODEL = 'google/gemma-3n-E4B-it'

function getApiKey() {
  const key = process.env.TOGETHER_API_KEY
  if (!key) return null
  return key
}

type GenerateType = 'ideas' | 'script' | 'hashtags' | 'hooks' | 'description'

const prompts: Record<GenerateType, (topic: string, context: string) => string> = {
  ideas: (topic, context) =>
    `You are a viral content strategist. Based on the trending topic "${topic}" in ${context}, generate 5 unique viral video ideas. For each idea provide: title, hook (first 3 seconds), format (short/long), and why it will go viral. Be specific and creative. Format as a numbered list.`,

  script: (topic, context) =>
    `Write a complete viral short-form video script for the topic "${topic}" trending in ${context}. Structure:\n🎣 HOOK (0-3s): grab attention immediately\n⚡ PROBLEM/INTRIGUE (3-15s): build tension\n🎯 MAIN CONTENT (15-45s): deliver value\n📣 CTA (45-60s): clear call to action\nMake it conversational, punchy, and optimized for retention. Include delivery notes in [brackets].`,

  hashtags: (topic, context) =>
    `Generate 30 optimized hashtags for a video about "${topic}" trending in ${context}.\nGroup them:\n🔥 MEGA (5 tags, 10M+ posts)\n📈 LARGE (10 tags, 1M-10M posts)\n🎯 MEDIUM (10 tags, 100K-1M posts)\n💎 NICHE (5 tags, under 100K)\n\nAlso give 3 hashtag strategy tips for maximum reach.`,

  hooks: (topic, context) =>
    `Create 10 viral video opening hooks for "${topic}" trending in ${context}. Each hook must be under 15 words and instantly grab attention.\n\nCover these hook types:\n1. Question hook\n2. Shock/surprise hook\n3. Story hook\n4. Controversy hook\n5. Benefit hook\n6. Fear hook\n7. Secret/insider hook\n8. Challenge hook\n9. Comparison hook\n10. Trend hook\n\nFormat: [Type]: "Hook text" — [emotion it triggers]`,

  description: (topic, context) =>
    `Write an SEO-optimized YouTube/Instagram description for "${topic}" trending in ${context}.\n\nInclude:\n- Compelling first 2 lines (visible before "more")\n- [TIMESTAMPS] placeholder section\n- Natural keyword integration\n- Strong CTA\n- [SOCIAL LINKS] placeholder\n\nThen provide 5 SEO-optimized title variations for this video.`,
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, topic, country } = await req.json() as { type: GenerateType; topic: string; country: string }

  if (!type || !topic) return NextResponse.json({ error: 'type and topic required' }, { status: 400 })
  if (!prompts[type]) return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

  const apiKey = getApiKey()
  if (!apiKey) return NextResponse.json({ error: 'TOGETHER_API_KEY not set in .env.local' }, { status: 503 })

  const res = await fetch(`${TOGETHER_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompts[type](topic, country || 'your region') }],
      temperature: 0.8,
      max_tokens: 1500,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: err?.error?.message || `Together AI error (${res.status})` }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ result: data.choices?.[0]?.message?.content || '', type, topic })
}
