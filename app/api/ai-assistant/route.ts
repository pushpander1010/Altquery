import { NextRequest, NextResponse } from 'next/server'

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY

export async function POST(req: NextRequest) {
  if (!TOGETHER_API_KEY) {
    console.error('TOGETHER_API_KEY not found in environment variables')
    return NextResponse.json({ 
      error: 'AI service not configured. Please add TOGETHER_API_KEY environment variable.' 
    }, { status: 500 })
  }

  try {
    const { question, description, schema, userQuery, userMessage, conversationHistory } = await req.json()

    // Build context for the AI - only include schema
    const schemaContext = schema.map((s: any) => 
      `Table: ${s.tableName}\nColumns: ${s.columns.join(', ')}`
    ).join('\n\n')

    const systemPrompt = `You are a SQL tutor helping with this question: "${question}"

Database Schema:
${schemaContext}

${userQuery ? `Student's Query:\n${userQuery}\n` : ''}

Rules:
- Only answer SQL-related questions about THIS problem
- Give hints, not complete solutions
- If asked about unrelated topics, politely decline and redirect to SQL
- Keep responses under 3 sentences
- Be encouraging`

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
        model: 'LiquidAI/LFM2-24B-A2B',
        messages,
        max_tokens: 250,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      })
    })

    // If LiquidAI model fails, try fallback model
    if (!response.ok && response.status === 400) {
      console.log('LiquidAI model unavailable, trying fallback...')
      const fallbackResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
          messages,
          max_tokens: 250,
          temperature: 0.7,
          top_p: 0.9,
          stream: false
        })
      })
      
      if (!fallbackResponse.ok) {
        const errorText = await fallbackResponse.text()
        console.error('Fallback model also failed:', fallbackResponse.status, errorText)
        return NextResponse.json({ 
          error: `AI service error: ${fallbackResponse.status}. Check server logs.` 
        }, { status: 500 })
      }
      
      const fallbackData = await fallbackResponse.json()
      const aiResponse = fallbackData.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
      return NextResponse.json({ response: aiResponse })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Together AI API error:', response.status, errorText)
      return NextResponse.json({ 
        error: `AI service error: ${response.status}. Check server logs.` 
      }, { status: 500 })
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('AI assistant error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
