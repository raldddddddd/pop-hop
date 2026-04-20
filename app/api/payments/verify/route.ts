import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { applicationId, status } = body

    if (!["VERIFIED", "REJECTED"].includes(status)) {
      return new Response("Invalid status", { status: 400 })
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        paymentStatus: status
      }
    })

    return Response.json(updated)

  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}