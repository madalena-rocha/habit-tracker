import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'

const app = Fastify ()

app.register(cors) // permite que qualquer aplicação consuma os dados do back-end

// Configurar quais endereços de front-end poderiam acessar o back-end
/*
app.register(cors, {
    origin: ['http://localhost:3000']
})
*/

app.register(appRoutes)

app.listen({
    port: 3333,
    host: '0.0.0.0',
    // Por padrão, o fastify não aceita conexão por IP, somente por localhost
}).then(() => {
    console.log('HTTP Server running!')
})