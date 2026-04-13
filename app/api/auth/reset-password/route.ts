import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()
  if (!token || !password)
    return NextResponse.json({ error: 'Token and password required' }, { status: 400 })

  const user = await db.findUserByResetToken(token)
  if (!user)
    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })

  const hashed = await bcrypt.hash(password, 10)
  await db.updatePassword(user.id, hashed)

  return NextResponse.json({ success: true })
}
