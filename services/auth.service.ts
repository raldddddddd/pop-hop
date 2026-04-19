import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export async function registerUser(data: {
  email: string
  password: string
  name: string
  role: 'VENDOR' | 'ORGANIZER'
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role,
    },
  })

  return user
}

export async function loginUser(data: {
  email: string
  password: string
}) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (!user) throw new Error('User not found')

  const isValid = await bcrypt.compare(data.password, user.password)

  if (!isValid) throw new Error('Invalid password')

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  )

  return { user, token }
}