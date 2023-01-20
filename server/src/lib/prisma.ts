import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
    // Mostrar todas as queries feitas no banco
    log: ['query']
})