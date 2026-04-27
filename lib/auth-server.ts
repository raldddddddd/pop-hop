import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export async function getUserFromServer() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string; name: string }
  } catch {
    return null
  }
}
