#!/usr/bin/env node

/**
 * Test script to verify Together AI API connectivity and model availability
 * Run with: node test-ai-api.js
 */

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || 'tgp_v1_YwmDY4omZWH7P6K2-pa5oyQKTfQLJLLNoNvKP13_bT4'

if (!TOGETHER_API_KEY) {
  console.error('❌ TOGETHER_API_KEY not found in environment variables')
  process.exit(1)
}

console.log('🔍 Testing Together AI API...\n')
console.log('API Key:', TOGETHER_API_KEY.substring(0, 20) + '...')

const models = [
  'google/gemma-4-31B-it',
  'meta-llama/Meta-Llama-3-8B-Instruct-Lite',
  'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  'openai/gpt-oss-120b'
]

const testMessage = {
  role: 'user',
  content: 'Hello, this is a test. Please respond with "Test successful".'
}

async function testModel(model) {
  console.log(`\n📝 Testing model: ${model}`)
  console.log('─'.repeat(60))

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [testMessage],
        max_tokens: 100,
        temperature: 0.7,
        stream: false
      })
    })

    console.log(`Status: ${response.status} ${response.statusText}`)

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Error:', data.error?.message || JSON.stringify(data))
      return false
    }

    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('✅ Success!')
      console.log('Response:', data.choices[0].message.content.substring(0, 100))
      return true
    } else {
      console.error('❌ Unexpected response format:', JSON.stringify(data).substring(0, 200))
      return false
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

async function runTests() {
  console.log(`\nTesting ${models.length} models...\n`)

  const results = {}
  for (const model of models) {
    results[model] = await testModel(model)
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Test Results Summary')
  console.log('='.repeat(60))

  let successCount = 0
  for (const [model, success] of Object.entries(results)) {
    const status = success ? '✅' : '❌'
    console.log(`${status} ${model}`)
    if (success) successCount++
  }

  console.log(`\n${successCount}/${models.length} models working`)

  if (successCount === 0) {
    console.error('\n⚠️  No models are working. Check your API key and network connection.')
    process.exit(1)
  } else if (successCount < models.length) {
    console.warn('\n⚠️  Some models failed. Use a working model in your code.')
  } else {
    console.log('\n✅ All models are working!')
  }
}

runTests().catch(console.error)
