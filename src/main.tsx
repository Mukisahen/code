import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const loader = document.getElementById('app-loading')
if (loader) {
  loader.classList.add('is-hidden')
  loader.addEventListener('transitionend', () => loader.remove())
  setTimeout(() => loader.remove(), 600)
}
