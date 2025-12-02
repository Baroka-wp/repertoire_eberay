import { PrismaClient } from '../app/generated/prisma/client.js'

const prisma = new PrismaClient()

async function checkAdmin() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'admin' }
    })

    console.log(`\n📊 Nombre d'administrateurs : ${adminCount}`)

    if (adminCount === 0) {
      console.log(`\n⚠️  Aucun administrateur trouvé !`)
      console.log(`\n👉 Créez le premier admin en visitant : http://localhost:3000/setup-admin`)
    } else {
      const admins = await prisma.user.findMany({
        where: { role: 'admin' },
        select: { email: true, name: true, createdAt: true }
      })

      console.log(`\n✅ Administrateurs existants :`)
      admins.forEach(admin => {
        console.log(`   - ${admin.name} (${admin.email})`)
      })
    }

    await prisma.$disconnect()
  } catch (error) {
    console.error('Erreur:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkAdmin()

