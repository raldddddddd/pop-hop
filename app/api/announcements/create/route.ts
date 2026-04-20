import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()

  const { title, content, eventId } = body

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      eventId
    }
  })

  return Response.json(announcement)
}