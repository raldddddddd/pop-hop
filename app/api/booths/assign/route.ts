import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { boothId, vendorId } = body

    if (!boothId || !vendorId) {
      return new Response("Missing data", { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Get booth
      const booth = await tx.booth.findUnique({
        where: { id: boothId }
      })

      if (!booth) throw new Error("Booth not found")

      // 2. Check if already taken
      if (booth.vendorId) {
        throw new Error("Booth already assigned")
      }

      // 3. Find approved application
      const application = await tx.application.findFirst({
        where: {
          userId: vendorId,
          eventId: booth.eventId,
          status: "APPROVED"
        }
      })

      if (!application) {
        throw new Error("Vendor is not approved for this event")
      }

      // 4. Check if vendor already has a booth
      const existingBooth = await tx.booth.findFirst({
        where: {
          eventId: booth.eventId,
          vendorId: vendorId
        }
      })

      if (existingBooth) {
        throw new Error("Vendor already has a booth")
      }

      // 5. Assign booth
      await tx.booth.update({
        where: { id: boothId },
        data: { vendorId }
      })

      // 6. Link application to booth
      await tx.application.update({
        where: { id: application.id },
        data: { boothId }
      })

      return { success: true }
    })

    return Response.json(result)

  } catch (error: any) {
    return new Response(error.message, { status: 400 })
  }
}