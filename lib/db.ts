import prisma from './prisma'

export type User = {
  id: string
  name: string
  email: string
  password: string
  emailVerified: boolean
  verifyToken?: string | null
  verifyTokenExpiry?: bigint | null
  resetToken?: string | null
  resetTokenExpiry?: bigint | null
}

export const db = {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  },

  async findUserByResetToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: BigInt(Date.now()) },
      },
    })
  },

  async findUserByVerifyToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        verifyToken: token,
        verifyTokenExpiry: { gt: BigInt(Date.now()) },
      },
    })
  },

  async createUser(data: { name: string; email: string; password: string }): Promise<User> {
    return prisma.user.create({
      data: { ...data, email: data.email.toLowerCase() },
    })
  },

  async setVerifyToken(userId: string, token: string, expiry: number) {
    await prisma.user.update({
      where: { id: userId },
      data: { verifyToken: token, verifyTokenExpiry: BigInt(expiry) },
    })
  },

  async verifyEmail(token: string): Promise<User | null> {
    const user = await db.findUserByVerifyToken(token)
    if (!user) return null
    return prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null, verifyTokenExpiry: null },
    })
  },

  async setResetToken(userId: string, token: string, expiry: number) {
    await prisma.user.update({
      where: { id: userId },
      data: { resetToken: token, resetTokenExpiry: BigInt(expiry) },
    })
  },

  async updatePassword(userId: string, hashedPassword: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    })
  },
}

export default db
