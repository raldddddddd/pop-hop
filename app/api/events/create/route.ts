import { createEvent } from '@/services/event.service'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const event = await createEvent(body)

    return Response.json(event)
  } catch (error: any) {
    return new Response(error.message, { status: 400 })
  }
}