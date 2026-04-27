import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, eventId } = body

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) return new Response('Event not found', { status: 404 })

    const approvedCount = await prisma.application.count({
      where: { eventId, status: 'APPROVED' }
    })

    const status = approvedCount >= event.boothLimit ? 'WAITLISTED' : 'PENDING'

    const application = await prisma.application.create({
      data: {
        userId,
        eventId,
        status
      }
    })

    return Response.json(application)

  } catch (error) {
    return new Response(
      JSON.stringify({ message: "You already applied to this event" }),
      { status: 400 }
    )
  }
}