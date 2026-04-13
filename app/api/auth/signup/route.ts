import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password)
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })

  if (password.length < 6)
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

  if (await db.findUserByEmail(email))
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

  const hashed = await bcrypt.hash(password, 10)
  const user = await db.createUser({ name, email, password: hashed })

  // Send verification email
  const token = crypto.randomBytes(32).toString('hex')
  const expiry = Date.now() + 1000 * 60 * 60 * 24 // 24 hours
  await db.setVerifyToken(user.id, token, expiry)

  try {
    await sendVerificationEmail(email, name, token)
  } catch (e) {
    console.error('Failed to send verification email:', e)
    // Don't block signup if email fails
  }

  return NextResponse.json({ success: true })
}
