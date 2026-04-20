import { getBoothsByEvent } from '@/services/booth.service'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params
  const booths = await getBoothsByEvent(eventId)
  return Response.json(booths)
}