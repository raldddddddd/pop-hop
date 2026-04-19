import { getEvents } from '@/services/event.service'

export async function GET() {
  const events = await getEvents()
  return Response.json(events)
}