import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Utiliser le client Prisma généré
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  const email = 'admin@eberay.ne'
  const password = 'Admin123!' // À changer après la première connexion
  const name = 'Administrateur'

  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('❌ Un utilisateur avec cet email existe déjà')
    return
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10)

  // Créer l'admin
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    }
  })

  console.log('✅ Administrateur créé avec succès!')
  console.log('📧 Email:', email)
  console.log('🔑 Mot de passe:', password)
  console.log('⚠️  Veuillez changer le mot de passe après la première connexion')
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

