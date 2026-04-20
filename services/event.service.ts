import { prisma } from '@/lib/prisma'

export async function createEvent(data: {
  title: string
  description?: string
  date: string
  boothLimit: number
  price: number
  organizerId: string
  address?: string
  imageUrl?: string
  startTime?: string
  endTime?: string
  durationDays?: number
}) {
  // ✅ VALIDATION MOVED HERE
  if (!data.title) throw new Error('Title is required')
  if (!data.date) throw new Error('Date is required')
  if (data.boothLimit <= 0) throw new Error('Invalid booth limit')
  if (data.price < 0) throw new Error('Invalid price')
  if (!data.organizerId) throw new Error('Organizer required')

  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      boothLimit: data.boothLimit,
      price: data.price,
      organizerId: data.organizerId,
      address: data.address,
      imageUrl: data.imageUrl,
      startTime: data.startTime,
      endTime: data.endTime,
      durationDays: data.durationDays,
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