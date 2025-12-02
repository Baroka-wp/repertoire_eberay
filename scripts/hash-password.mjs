import bcrypt from 'bcryptjs'

const password = process.argv[2] || 'Admin123!'

async function generateHash() {
  const hash = await bcrypt.hash(password, 10)
  console.log('🔑 Mot de passe:', password)
  console.log('🔐 Hash bcrypt:', hash)
  console.log('')
  console.log('Copiez ce hash dans votre requête SQL:')
  console.log(`'${hash}'`)
}

generateHash()

