import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role key — server-side only, never expose to client
)

export type User = {
  id: string
  name: string
  email: string
  password: string
  reset_token?: string | null
  reset_token_expiry?: number | null
  created_at?: number
}

export const db = {
  async findUserByEmail(email: string): Promise<User | undefined> {
    const { data } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .single()
    return data ?? undefined
  },

  async findUserByResetToken(token: string): Promise<User | undefined> {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('reset_token', token)
      .gt('reset_token_expiry', Date.now())
      .single()
    return data ?? undefined
  },

  async createUser(data: { name: string; email: string; password: string }): Promise<User> {
    const { data: user, error } = await supabase
      .from('users')
      .insert({ ...data, created_at: Date.now() })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return user
  },

  async setResetToken(userId: string, token: string, expiry: number) {
    await supabase
      .from('users')
      .update({ reset_token: token, reset_token_expiry: expiry })
      .eq('id', userId)
  },

  async updatePassword(userId: string, hashedPassword: string) {
    await supabase
      .from('users')
      .update({ password: hashedPassword, reset_token: null, reset_token_expiry: null })
      .eq('id', userId)
  },
}

export default db
