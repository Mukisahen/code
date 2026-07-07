import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

async function main() {
  const phone = requiredEnv('SUPER_ADMIN_PHONE')
  const password = requiredEnv('SUPER_ADMIN_PASSWORD')
  const fullName = process.env.SUPER_ADMIN_NAME ?? 'Farm Bhade Admin'
  const district = process.env.SUPER_ADMIN_DISTRICT ?? 'Kampala'

  if (password.length < 12) {
    throw new Error('SUPER_ADMIN_PASSWORD must be at least 12 characters')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { phone },
    create: {
      fullName,
      phone,
      passwordHash,
      role: 'admin',
      isSuperAdmin: true,
      district,
      verified: true,
    },
    update: { role: 'admin', isSuperAdmin: true, passwordHash },
  })

  console.log(`Supreme admin ready: ${user.fullName} (${user.phone})`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
