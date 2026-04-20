import { prisma } from '@/lib/prisma'

export async function assignBooth(boothId: string, vendorId: string) {
  if (!boothId || !vendorId) {
    throw new Error('Invalid assignment')
  }

  const booth = await prisma.booth.findUnique({
    where: { id: boothId },
  })

  if (!booth) throw new Error('Booth not found')

  if (booth.vendorId) {
    throw new Error('Booth already assigned')
  }

  return prisma.booth.update({
    where: { id: boothId },
    data: {
      vendorId,
    },
  })
}

export async function getBoothsByEvent(eventId: string) {
  return prisma.booth.findMany({
    where: { eventId },
    include: {
      vendor: true,
    },
  })
}