import { registerUser } from '@/services/auth.service'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const result = await registerUser(body)

    const cookieStore = await cookies()
    cookieStore.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    })

    return Response.json({ user: result.user })
  } catch (error: any) {
    return new Response(error.message, { status: 400 })
  }
}