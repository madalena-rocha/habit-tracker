import WebPush from 'web-push'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

// Gera duas chaves, uma privada e uma pública
// A chave privada pode criptografar e assinar uma informação
// A chave pública não pode criptografar novas informações, mas pode validar se uma mensagem foi criptografada pela chave privada ou não
// Como vai enviar notificação de um back-end para um front-end, que é o Service Worker, o front-end precisa saber que o back-end que está enviando a notificação é o back-end que ele deu permissão para enviar notificação

// console.log(WebPush.generateVAPIDKeys())

const publicKey = 'BDhcalsFR_pNJcX_3HWKo3_MEcUzgKbTAmJeqitornL0nOCev_EBDA7kW2kydqcARpgvJNpY8ef0bf4lKmdJCeM'
const privateKey = '8ncBO5WuHGSAnD2UCFF2xQZpm6gu6yNoYYi__Uelt0M'

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey)

export async function notificationRoutes(app: FastifyInstance) {
  // Rota para o front-end conseguir obter a chave pública
  app.get('/push/public_key', () => {
    return {
      publicKey,
    }
  })

  // Quando o usuário assina a aplicação para receber notificações, reeberá um id para identificá-lo dentro do sistema de notificações
  // Rota para associar o id do usuário que aceitou receber notificações com o id do usuário logado
  app.post('/push/register', (request, reply) => {
    console.log(request.body)

    return reply.status(201).send()
  })

  // Rota para simular o envio de notificação
  app.post('/push/send', async (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      })
    })

    const { subscription } = sendPushBody.parse(request.body)

    setTimeout(() => {
      WebPush.sendNotification(subscription, 'HELLO DO BACKEND')
    }, 5000)

    return reply.status(201).send()
  })

}
