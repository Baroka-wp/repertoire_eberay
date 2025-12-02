import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmins = await prisma.user.count({
      where: { role: 'admin' }
    })

    if (existingAdmins > 0) {
      return NextResponse.json(
        { error: 'Un administrateur existe déjà' },
        { status: 400 }
      )
    }

    // Créer l'administrateur
    const hashedPassword = await bcrypt.hash('Admin123!', 10)

    const admin = await prisma.user.create({
      data: {
        email: 'admin@eberay.ne',
        password: hashedPassword,
        name: 'Administrateur',
        role: 'admin'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Administrateur créé avec succès',
      email: admin.email
    })
  } catch (error) {
    console.error('Erreur création admin:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'administrateur' },
      { status: 500 }
    )
  }
}

