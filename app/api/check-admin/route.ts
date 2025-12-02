import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'admin' }
    })

    return NextResponse.json({ 
      hasAdmin: adminCount > 0,
      count: adminCount 
    })
  } catch (error) {
    console.error('Erreur check-admin:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

