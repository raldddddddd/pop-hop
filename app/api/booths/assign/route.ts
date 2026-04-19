import { assignBooth } from '@/services/booth.service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await assignBooth(body.boothId, body.vendorId)
    return Response.json(result)
  } catch (error: any) {
    return new Response(error.message, { status: 400 })
  }
}