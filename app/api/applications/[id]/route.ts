import { prisma } from "@/lib/prisma"
import { ApplicationStatus } from "@prisma/client"

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split("/").pop()

    if (!id) {
      return new Response("Missing ID", { status: 400 })
    }

    const body = await req.json()
    const { status } = body

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return new Response("Invalid status", { status: 400 })
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: { event: true }
    })
    if (!application) return new Response("Not found", { status: 404 })

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: ApplicationStatus[status as keyof typeof ApplicationStatus]
      }
    })

    // If a slot opened up, notify waitlisted users
    if (status === 'REJECTED') {
      const approvedCount = await prisma.application.count({
        where: { eventId: application.eventId, status: 'APPROVED' }
      })

      if (approvedCount < application.event.boothLimit) {
        // Find oldest waitlisted
        const waitlisted = await prisma.application.findFirst({
          where: { eventId: application.eventId, status: 'WAITLISTED' },
          orderBy: { createdAt: 'asc' }
        })

        if (waitlisted) {
          // Auto-move them to PENDING or just message them
          // Let's send them a message!
          await prisma.message.create({
            data: {
              eventId: application.eventId,
              senderId: application.event.organizerId,
              receiverId: waitlisted.userId,
              content: `Good news! A booth slot has opened up for ${application.event.title}. Please check your application status as you have been moved from the waitlist.`
            }
          })
          
          // Optionally, automatically move them to PENDING so they can be approved
          await prisma.application.update({
            where: { id: waitlisted.id },
            data: { status: 'PENDING' }
          })
        }
      }
    }

    return Response.json(updated)

  } catch (error) {
    return new Response("Failed to update application", { status: 500 })
  }
}