import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

    const { email } = body
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    if (!process.env.DATABASE_URL)
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

    const user = await db.findUserByEmail(email)
    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ success: true })

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = Date.now() + 1000 * 60 * 60 // 1 hour
    await db.setResetToken(user.id, token, expiry)

    await sendPasswordResetEmail(email, user.name, token)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[forgot-password] error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to send reset email' }, { status: 500 })
  }
}
