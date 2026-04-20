import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const profile = await prisma.vendorProfile.findUnique({
      where: { userId }
    })

    return NextResponse.json({ data: profile })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, description, productType, address, socialLinks, imageUrl } = body

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const profile = await prisma.vendorProfile.upsert({
      where: { userId },
      update: {
        description,
        productType,
        address,
        socialLinks,
        imageUrl
      },
      create: {
        userId,
        description,
        productType,
        address,
        socialLinks,
        imageUrl
      }
    })

    return NextResponse.json({ data: profile })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
