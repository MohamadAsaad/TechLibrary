import './index.css'
import './assets/styles/main.css'
import App from './app.js'

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App()
  app.init()
})

// Service worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/sw.js')
}