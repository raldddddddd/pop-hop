import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const eventId = url.pathname.split('/').pop()

  const data = await prisma.announcement.findMany({
    where: { eventId },
    orderBy: { createdAt: 'desc' }
  })

  return Response.json(data)
}