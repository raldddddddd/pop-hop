import { registerUser } from '@/services/auth.service'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const user = await registerUser(body)

    return Response.json(user)
  } catch (error: any) {
    return new Response(error.message, { status: 400 })
  }
}