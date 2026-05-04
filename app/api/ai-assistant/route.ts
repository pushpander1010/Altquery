import { NextRequest, NextResponse } from 'next/server'

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY

export async function POST(req: NextRequest) {
  if (!TOGETHER_API_KEY) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
  }

  try {
    const { question, description, schema, userQuery, userMessage, conversationHistory } = await req.json()

    // Build context for the AI
    const schemaContext = schema.map((s: any) => 
      `Table: ${s.tableName}\nColumns: ${s.columns.join(', ')}\nDescription: ${s.description}`
    ).join('\n\n')

    const systemPrompt = `You are a helpful SQL tutor. You are helping a student with this SQL question:

Question: ${question}
Description: ${description}

Database Schema:
${schemaContext}

${userQuery ? `Student's current query:\n${userQuery}\n` : ''}

Your role:
- Provide hints without giving away the complete solution
- Point out errors in their SQL if they ask
- Explain SQL concepts when asked
- Stay focused on THIS specific question only
- Be encouraging and supportive
- Keep responses concise (2-3 sentences max)

Do NOT:
- Write the complete solution unless explicitly asked
- Discuss topics unrelated to this SQL question
- Be overly verbose`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ]

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        messages,
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      })
    })

    if (!response.ok) {
      console.error('Together AI error:', await response.text())
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('AI assistant error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
