import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

    const { name, email, password } = body

    if (!name || !email || !password)
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })

    if (password.length < 6)
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

    // Check Supabase config
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

    const existing = await db.findUserByEmail(email)
    if (existing)
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 10)
    const user = await db.createUser({ name, email, password: hashed })

    // Send verification email (non-blocking)
    try {
      const token = crypto.randomBytes(32).toString('hex')
      const expiry = Date.now() + 1000 * 60 * 60 * 24 // 24 hours
      await db.setVerifyToken(user.id, token, expiry)
      await sendVerificationEmail(email, name, token)
    } catch (emailErr) {
      console.error('[signup] email error:', emailErr)
      // Don't fail signup if email sending fails
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[signup] error:', err)
    return NextResponse.json({ error: err?.message || 'Signup failed' }, { status: 500 })
  }
}
