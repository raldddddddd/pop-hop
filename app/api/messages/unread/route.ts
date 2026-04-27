import { prisma } from '@/lib/prisma'
import { getUserFromServer } from '@/lib/auth-server'

export async function GET() {
  const user = await getUserFromServer()
  if (!user) return Response.json({ unreadCount: 0 })

  const count = await prisma.message.count({
    where: {
      receiverId: user.userId,
      read: false
    }
  })

  return Response.json({ unreadCount: count })
}
