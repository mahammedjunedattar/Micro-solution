import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      password: hashedPassword,
      name: 'Test User'
    }
  })
  
  console.log('✅ Database seeded successfully')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
