import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, eventId } = body

    const application = await prisma.application.create({
      data: {
        userId,
        eventId
      }
    })

    return Response.json(application)

  } catch (error) {
    return new Response(
      JSON.stringify({ message: "You already applied to this event" }),
      { status: 400 }
    )
  }
}