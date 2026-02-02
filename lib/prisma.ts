
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

// Fix for pg v8+ SSL warning
// The warning states: "The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'."
// To silence this and ensure compatibility with standard libpq behavior, we add uselibpqcompat=true
let poolConfig: { connectionString?: string } = { connectionString }

if (connectionString) {
  try {
    const url = new URL(connectionString)
    if (url.searchParams.has('sslmode')) {
      url.searchParams.set('uselibpqcompat', 'true')
      poolConfig.connectionString = url.toString()
    }
  } catch (e) {
    // If the URL is invalid, we fallback to the original string
    console.warn('Invalid DATABASE_URL format, using original string')
  }
}

const pool = new Pool(poolConfig)
const adapter = new PrismaPg(pool)

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
