self.addEventListener('push', function (event) {
  const body = event.data?.text() ?? ''
  
  event.waitUntil(
    // waitUntil => quando a aplicação carregar o Service Worker, mantenha-se rodando, aguarde receber uma notificação
    self.registration.showNotification('Habits', {
      body,
    })
  )
})

// O Service Worker não se atualiza sozinho, sendo necessário realizar o update manualmente
// Existem bibliotecas que automatizam o processo de update do Service Worker