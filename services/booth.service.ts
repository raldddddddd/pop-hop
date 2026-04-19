import { prisma } from '@/lib/prisma'

export async function assignBooth(boothId: string, vendorId: string) {
  return prisma.booth.update({
    where: { id: boothId },
    data: {
      isTaken: true,
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