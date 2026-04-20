import { prisma } from '@/lib/prisma'
import { ApplicationStatus } from '@prisma/client'

export async function applyToEvent(data: {
  userId: string
  eventId: string
}) {
  if (!data.userId || !data.eventId) {
    throw new Error('Invalid request')
  }

  const existing = await prisma.application.findFirst({
    where: {
      userId: data.userId,
      eventId: data.eventId,
    },
  })

  if (existing) {
    throw new Error('You already applied to this event')
  }

  return prisma.application.create({ data })
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
    data: { status: status as ApplicationStatus },
  })
}