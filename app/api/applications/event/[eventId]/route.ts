import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: any) {
  const url = new URL(req.url)

  const page = Number(url.searchParams.get('page') || 1)
  const limit = 5

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: { eventId: params.eventId },
      include: {
        user: {
          include: {
            vendorProfile: true
          }
        }
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.application.count({
      where: { eventId: params.eventId }
    })
  ])

  return Response.json({
    data: applications,
    total,
    hasMore: page * limit < total
  })
}