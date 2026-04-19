import { prisma } from '@/lib/prisma'

export async function applyToEvent(data: {
  userId: string
  eventId: string
}) {
  return prisma.application.create({
    data: {
      userId: data.userId,
      eventId: data.eventId,
    },
  })
}

export async function getApplicationsByEvent(eventId: string) {
  return prisma.application.findMany({
    where: { eventId },
    include: {
      user: true,
    },
  })
}

export async function updateApplicationStatus(id: string, status: string) {
  return prisma.application.update({
    where: { id },
    data: { status },
  })
}