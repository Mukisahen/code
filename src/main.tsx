import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// A lazy-loaded route chunk can 404 if the browser/PWA still has an old
// index.html cached after a redeploy replaced the build's asset files —
// Vite fires this event instead of letting the failed import throw deep
// inside a component tree. A single hard reload fetches the fresh HTML and
// resolves it; the reload-attempted guard stops a loop if the app is
// somehow still stale (e.g. fully offline).
window.addEventListener('vite:preloadError', () => {
  if (sessionStorage.getItem('fb-reload-attempted')) return
  sessionStorage.setItem('fb-reload-attempted', '1')
  window.location.reload()
})

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

// A successful mount means the reload (if one happened) fixed the stale
// chunk — clear the guard so a later redeploy can trigger one more if needed.
sessionStorage.removeItem('fb-reload-attempted')
