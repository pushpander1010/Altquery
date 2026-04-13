import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password)
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })

  if (password.length < 6)
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

  if (await db.findUserByEmail(email))
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

  const hashed = await bcrypt.hash(password, 10)
  await db.createUser({ name, email, password: hashed })

  return NextResponse.json({ success: true })
}
