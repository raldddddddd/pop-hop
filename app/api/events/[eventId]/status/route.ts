import { prisma } from '@/lib/prisma'
import { getUserFromServer } from '@/lib/auth-server'

export async function PATCH(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const user = await getUserFromServer()
    if (!user || user.role !== 'ORGANIZER') {
      return new Response('Unauthorized', { status: 401 })
    }

    const { status } = await req.json()
    const { eventId } = await params

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event || event.organizerId !== user.userId) {
      return new Response('Forbidden', { status: 403 })
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: { status }
    })

    return Response.json(updated)
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}
