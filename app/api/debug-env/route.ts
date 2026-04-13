import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: !!process.env.DATABASE_URL,
    DIRECT_URL: !!process.env.DIRECT_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    TOGETHER_API_KEY: !!process.env.TOGETHER_API_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
  })
}
