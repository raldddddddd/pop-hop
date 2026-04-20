import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId, senderId, receiverId, content } = body

    if (!eventId || !senderId || !receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: { eventId, senderId, receiverId, content }
    })

    return NextResponse.json({ data: message })
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/messages?userId=xxx — returns all unique conversation threads for the inbox
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    // Find all messages where user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } },
        event: { select: { id: true, title: true } },
      }
    })

    // Deduplicate into threads: key = eventId + otherUserId
    const threadMap = new Map<string, any>()
    for (const msg of messages) {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender
      const key = `${msg.eventId}::${otherUser.id}`
      if (!threadMap.has(key)) {
        threadMap.set(key, {
          key,
          eventId: msg.eventId,
          eventTitle: msg.event.title,
          otherUser,
          lastMessage: msg.content,
          lastAt: msg.createdAt,
        })
      }
    }

    return NextResponse.json({ data: Array.from(threadMap.values()) })
  } catch (error) {
    console.error('Fetch inbox error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
