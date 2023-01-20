import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './App'

// Chama o método createRoot que vem de dentro de ReactDOM, que é a integração do React com a DOM com o browser, passando o document.getElementById('root') e dentro dele renderiza o componente <App />
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
