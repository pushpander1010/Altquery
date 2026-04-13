import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const user = await db.findUserByEmail(email)
  if (!user) return NextResponse.json({ success: true }) // prevent enumeration

  const token = crypto.randomBytes(32).toString('hex')
  const expiry = Date.now() + 1000 * 60 * 60 // 1 hour
  await db.setResetToken(user.id, token, expiry)

  try {
    await sendPasswordResetEmail(email, user.name, token)
  } catch (e) {
    console.error('Failed to send reset email:', e)
    return NextResponse.json({ error: 'Failed to send email. Try again later.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
