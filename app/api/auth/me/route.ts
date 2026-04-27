import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return Response.json({ user: decoded })
  } catch (err) {
    return new Response('Invalid token', { status: 401 })
  }
}
