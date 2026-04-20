import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { applicationId, paymentProof } = body

    if (!applicationId || !paymentProof) {
      return new Response("Missing data", { status: 400 })
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        paymentProof,
        paymentStatus: "PENDING"
      }
    })

    return Response.json(updated)

  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}