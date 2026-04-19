import { getBoothsByEvent } from '@/services/booth.service'

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const booths = await getBoothsByEvent(params.eventId)
  return Response.json(booths)
}