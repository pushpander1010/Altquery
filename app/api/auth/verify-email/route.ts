import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/login?error=invalid', req.url))

  const user = await db.verifyEmail(token)
  if (!user) return NextResponse.redirect(new URL('/login?error=expired', req.url))

  return NextResponse.redirect(new URL('/login?verified=1', req.url))
}
