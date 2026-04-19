import { applyToEvent } from '@/services/application.service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await applyToEvent(body)
    return Response.json(result)
  } catch (error: any) {
    return new Response(error.message, { status: 400 })
  }
}