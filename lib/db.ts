import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export type User = {
  id: string
  name: string
  email: string
  password: string
  email_verified?: boolean
  verify_token?: string | null
  verify_token_expiry?: number | null
  reset_token?: string | null
  reset_token_expiry?: number | null
  created_at?: number
}

export const db = {
  async findUserByEmail(email: string): Promise<User | undefined> {
    const { data } = await getClient()
      .from('users')
      .select('*')
      .ilike('email', email)
      .single()
    return data ?? undefined
  },

  async findUserByResetToken(token: string): Promise<User | undefined> {
    const { data } = await getClient()
      .from('users')
      .select('*')
      .eq('reset_token', token)
      .gt('reset_token_expiry', Date.now())
      .single()
    return data ?? undefined
  },

  async createUser(data: { name: string; email: string; password: string }): Promise<User> {
    const { data: user, error } = await getClient()
      .from('users')
      .insert({ ...data, created_at: Date.now(), email_verified: false })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return user
  },

  async setVerifyToken(userId: string, token: string, expiry: number) {
    await getClient()
      .from('users')
      .update({ verify_token: token, verify_token_expiry: expiry })
      .eq('id', userId)
  },

  async verifyEmail(token: string): Promise<User | null> {
    const { data: user } = await getClient()
      .from('users')
      .select('*')
      .eq('verify_token', token)
      .gt('verify_token_expiry', Date.now())
      .single()
    if (!user) return null
    await getClient()
      .from('users')
      .update({ email_verified: true, verify_token: null, verify_token_expiry: null })
      .eq('id', user.id)
    return user
  },

  async setResetToken(userId: string, token: string, expiry: number) {
    await getClient()
      .from('users')
      .update({ reset_token: token, reset_token_expiry: expiry })
      .eq('id', userId)
  },

  async updatePassword(userId: string, hashedPassword: string) {
    await getClient()
      .from('users')
      .update({ password: hashedPassword, reset_token: null, reset_token_expiry: null })
      .eq('id', userId)
  },
}

export default db
