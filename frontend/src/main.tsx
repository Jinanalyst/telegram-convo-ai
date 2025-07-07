import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UidProvider } from './UidContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UidProvider>
      <App />
    </UidProvider>
  </StrictMode>,
)
