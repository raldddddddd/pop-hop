import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string; otherUserId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url)
    const currentUserId = searchParams.get('currentUserId')
    const { eventId, otherUserId } = await params

    if (!currentUserId || !eventId || !otherUserId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Fetch messages where either (sender is currentUser and receiver is otherUser) OR (sender is otherUser and receiver is currentUser)
    const messages = await prisma.message.findMany({
      where: {
        eventId,
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId }
        ]
      },
      orderBy: {
        createdAt: 'asc' // Oldest to newest
      },
      include: {
        sender: {
          select: { name: true, role: true }
        }
      }
    })

    return NextResponse.json({ data: messages })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
