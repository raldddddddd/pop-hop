import { getApplicationsByEvent } from '@/services/application.service'

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const data = await getApplicationsByEvent(params.eventId)
  return Response.json(data)
}