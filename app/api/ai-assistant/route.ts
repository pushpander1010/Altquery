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

    // Validate required fields
    if (!question || !userMessage) {
      return NextResponse.json({ 
        error: 'Missing required fields: question and userMessage' 
      }, { status: 400 })
    }

    // Build schema context for better AI understanding
    const schemaContext = schema.map((s: any) =>
      [
        `Table: ${s.tableName}`,
        s.description ? `Description: ${s.description}` : null,
        `Columns: ${s.columns.join(', ')}`
      ].filter(Boolean).join('\n')
    ).join('\n\n')

    // Enhanced system prompt following the steering rule:
    // "pass question, optional(user answer) and table schema to ai for better helping user"
    const systemPrompt = `You are an expert SQL tutor helping students solve SQL practice problems.

PROBLEM CONTEXT:
Title: ${question}
Description: ${description}

DATABASE SCHEMA:
${schemaContext}

YOUR ROLE:
- Help the student understand SQL concepts related to THIS specific problem
- Provide hints and guidance, NOT complete solutions
- Reference the student's current SQL query when giving feedback
- Keep responses concise (2-3 sentences max)
- Be encouraging and supportive
- If the student asks about unrelated topics, politely redirect them to SQL

IMPORTANT: Always consider the student's current SQL attempt and the problem requirements when responding.`

    // Build the user context message with all relevant information
    const userContextMessage = [
      `Student's Question: ${userMessage}`,
      `\nProblem: ${question}`,
      `\nStudent's Current SQL Query:\n${userQuery?.trim() ? userQuery : '(No query provided yet)'}`,
      `\nDatabase Schema:\n${schemaContext}`
    ].join('\n')

    // Prepare messages array with conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userContextMessage }
    ]

    // Use google/gemma-4-31B-it as primary model (verified working)
    const primaryModel = 'google/gemma-4-31B-it'
    const fallbackModel = 'meta-llama/Meta-Llama-3-8B-Instruct-Lite'
    
    console.log('Sending request to Together AI with model:', primaryModel)
    console.log('Messages count:', messages.length)
    console.log('API Key present:', !!TOGETHER_API_KEY)

    // Primary model request
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: primaryModel,
        messages,
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      })
    })

    console.log('Primary model response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Primary model error:', response.status, errorText)
      
      // Try fallback model if primary fails
      console.log('Primary model failed, attempting fallback with:', fallbackModel)
      
      const fallbackResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: fallbackModel,
          messages,
          max_tokens: 300,
          temperature: 0.7,
          top_p: 0.9,
          stream: false
        })
      })
      
      console.log('Fallback model response status:', fallbackResponse.status)
      
      if (!fallbackResponse.ok) {
        const fallbackErrorText = await fallbackResponse.text()
        console.error('Fallback model also failed:', fallbackResponse.status, fallbackErrorText)
        return NextResponse.json({ 
          error: `AI service error: ${fallbackResponse.status}. ${fallbackErrorText}` 
        }, { status: 503 })
      }
      
      const fallbackData = await fallbackResponse.json()
      const aiResponse = fallbackData.choices?.[0]?.message?.content || 'I encountered an issue generating a response. Please try again.'
      console.log('Fallback model succeeded')
      return NextResponse.json({ response: aiResponse })
    }

    const data = await response.json()
    console.log('Response data structure:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasMessage: !!data.choices?.[0]?.message,
      messageKeys: Object.keys(data.choices?.[0]?.message || {})
    })
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected response format from Together AI:', JSON.stringify(data).substring(0, 500))
      return NextResponse.json({ 
        error: 'Unexpected response format from AI service' 
      }, { status: 500 })
    }

    const aiResponse = data.choices[0].message.content || 'I could not generate a response. Please try again.'
    console.log('AI response generated successfully, length:', aiResponse.length)

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('AI assistant error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: `Internal server error: ${errorMessage}` 
    }, { status: 500 })
  }
}
