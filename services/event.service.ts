import { prisma } from '@/lib/prisma'

export async function createEvent(data: {
  title: string
  description?: string
  date: string
  boothLimit: number
  price: number
  organizerId: string
}) {
  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      boothLimit: data.boothLimit,
      price: data.price,
      organizerId: data.organizerId,
    },
  })

  // 👇 create booths
  const booths = Array.from({ length: data.boothLimit }).map((_, i) => ({
    number: i + 1,
    eventId: event.id,
  }))

  await prisma.booth.createMany({
    data: booths,
  })

  return event
}

export async function getEvents() {
  return prisma.event.findMany({
    include: {
      organizer: true,
    },
  })
}