import './styles/global.css'
import './lib/dayjs'
import { Header } from './components/Header'
import { SummaryTable } from './components/SummaryTable'
import { api } from './lib/axios'

// import { Habit } from "./components/Habit"

// Local Notification => não é possível fazer Scheduling e enviar notificação com o App fechado
/*
window.Notification.requestPermission(permission => {
  if (permission === 'granted') {
    new window.Notification('Habits', {
      body: 'Texto',
    })
  }
})
*/

navigator.serviceWorker.register('service-worker.js')
  .then(async serviceWorker => {
    // Assinatura do usuário com o serviço de notificações
    // Verificar se o usuário já tem uma incrição ativa
    let subscription = await serviceWorker.pushManager.getSubscription()
    
    // Se não tiver, criar uma nova inscrição
    if (!subscription) {
      const publicKeyResponse = await api.get('/push/public_key')

      subscription = await serviceWorker.pushManager.subscribe({
        // o userVisibleOnly vai usar as notificações apenas para notificações visíveis para o usuário
        userVisibleOnly: true,
        applicationServerKey: publicKeyResponse.data.publicKey,
      })
    }

    await api.post('/push/send', {
      subscription,
    })
  })

export function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header />
        <SummaryTable />
      </div>
    </div>
  )
}
