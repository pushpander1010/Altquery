import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const user = await db.findUserByEmail(email)
  if (!user) return NextResponse.json({ success: true }) // prevent enumeration

  const token = crypto.randomBytes(32).toString('hex')
  const expiry = Date.now() + 1000 * 60 * 60 // 1 hour

  await db.setResetToken(user.id, token, expiry)

  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`
  console.log('[DEV] Password reset link:', resetUrl)

  return NextResponse.json({
    success: true,
    ...(process.env.NODE_ENV === 'development' && { resetUrl }),
  })
}
