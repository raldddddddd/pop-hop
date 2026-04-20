import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const pathnameParts = url.pathname.split('/')
    const userId = pathnameParts[pathnameParts.length - 1]

    const page = Number(url.searchParams.get('page') || 1)
    const limit = 5

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { userId },
        include: {
          event: true,
          booth: true,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.application.count({
        where: { userId }
      })
    ])

    return Response.json({
      data: applications,
      total,
      hasMore: page * limit < total
    })

  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}