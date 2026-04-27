import { prisma } from '@/lib/prisma'
import { getUserFromServer } from '@/lib/auth-server'

export async function GET() {
  try {
    const user = await getUserFromServer()
    if (!user || user.role !== 'ORGANIZER') {
      return new Response('Unauthorized', { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: { organizerId: user.userId },
      orderBy: { createdAt: 'desc' }
    })

    return Response.json(events)
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}
