import { prisma } from "@/lib/prisma"
import { ApplicationStatus } from "@prisma/client"

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split("/").pop()

    if (!id) {
      return new Response("Missing ID", { status: 400 })
    }

    const body = await req.json()
    const { status } = body

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return new Response("Invalid status", { status: 400 })
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: ApplicationStatus[status as keyof typeof ApplicationStatus]
      }
    })

    return Response.json(updated)

  } catch (error) {
    return new Response("Failed to update application", { status: 500 })
  }
}