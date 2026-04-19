import { updateApplicationStatus } from '@/services/application.service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await updateApplicationStatus(body.id, body.status)
    return Response.json(result)
  } catch (error: any) {
    return new Response(error.message, { status: 400 })
  }
}