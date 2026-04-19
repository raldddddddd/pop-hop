import { loginUser } from '@/services/auth.service'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const result = await loginUser(body)

    return Response.json(result)
  } catch (error: any) {
    return new Response(error.message, { status: 400 })
  }
}