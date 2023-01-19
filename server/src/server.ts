import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const app = Fastify ()
const prisma = new PrismaClient()

app.register(cors) // permite que qualquer aplicação consuma os dados do back-end
// Configurar quais endereços de front-end poderiam acessar o back-end
/*
app.register(cors, {
    origin: ['http://localhost:3000']
})
*/

app.get('/hello', async () =>  {
    // Buscar vários hábitos no banco de dados
    const habits = await prisma.habit.findMany()
    /*
    const habits = await prisma.habit.findMany({
        // Buscar todos hábitos onde o título começa com 'Beber'
        where: {
            title: {
                startsWith: 'Beber'
            }
        }
    })
    */
    
    return habits
})

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP Server running!')
})