// src/app.js
import Router from './router/index.js'
import DataService from './services/DataService.js'
import SearchService from './services/SearchService.js'
import { initTheme, getTheme, toggleTheme } from './utils/storage.js'
import { debounce } from './utils/helpers.js'
import Header from './components/Header.js'
import Footer from './components/Footer.js'

class App {
  constructor() {
    this.router = null
    this.dataService = null
    this.searchService = null
    this.currentPage = null
    this.isInitialized = false
  }

  async init() {
    if (this.isInitialized) return

    try {
      // Initialize services
      this.dataService = new DataService()
      this.searchService = new SearchService()

      // Load data
      await this.dataService.loadAll()

      // Initialize search
      this.searchService.init(this.dataService.posts)

      // Initialize router
      this.router = new Router(this)
      this.router.init()

      // Initialize theme
      initTheme()

      // Render header and footer
      this.renderLayout()

      // Handle initial route - strip base URL if present
      let path = window.location.pathname
      const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
      if (basePath && path.startsWith(basePath)) {
        path = path.slice(basePath.length)
      }
      if (!path) path = '/'
      await this.router.navigate(path)

      // Setup event listeners
      this.setupEventListeners()

      this.isInitialized = true

      console.log('TechLibrary initialized successfully')
    } catch (error) {
      console.error('Failed to initialize TechLibrary:', error)
      this.showError('حدث خطأ أثناء تحميل التطبيق')
    }
  }

  renderLayout() {
    const app = document.getElementById('app')

    if (!app) {
      console.error('App container not found')
      return
    }

    // Create main container
    app.innerHTML = `
      <div id="app-container" class="min-h-screen flex flex-col bg-surface text-on-surface">
        <header id="app-header"></header>
        <main id="app-main" class="flex-1 pt-24 px-4 md:px-8 w-full max-w-[1280px] mx-auto"></main>
        <footer id="app-footer"></footer>
      </div>
    `

    // Render header
    const header = new Header()
    const headerEl = document.getElementById('app-header')
    if (headerEl) {
      headerEl.appendChild(header.render())
    }

    // Render footer
    const footer = new Footer()
    const footerEl = document.getElementById('app-footer')
    if (footerEl) {
      footerEl.appendChild(footer.render())
    }

    // Setup header events
    this.setupHeaderEvents()
  }

  setupHeaderEvents() {
    const header = document.querySelector('header')
    if (!header) return

    // Theme toggle
    const themeBtn = header.querySelector('[data-theme-toggle]')
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const newTheme = toggleTheme()
        this.updateThemeIcon(themeBtn, newTheme)
      })
    }

    // Search input
    const searchInput = header.querySelector('[data-search-input]')
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim()
        if (query.length > 1) {
          this.router.navigate(`/search?q=${encodeURIComponent(query)}`)
        }
      }, 300))
    }

    // Mobile menu toggle logic is now handled inside Header.js

    // Update theme icon
    const currentTheme = getTheme()
    if (themeBtn) {
      this.updateThemeIcon(themeBtn, currentTheme)
    }
  }

  updateThemeIcon(btn, theme) {
    const icon = btn.querySelector('.material-symbols-outlined')
    if (icon) {
      icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode'
    }
  }

  setupEventListeners() {
    // Handle popstate for back/forward navigation
    window.addEventListener('popstate', async (e) => {
      if (e.state && e.state.path) {
        await this.router.navigate(e.state.path)
      } else {
        let path = window.location.pathname
        const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
        if (basePath && path.startsWith(basePath)) {
          path = path.slice(basePath.length)
        }
        if (!path) path = '/'
        await this.router.navigate(path)
      }
    })

    // Handle click on links
    document.addEventListener('click', async (e) => {
      const link = e.target.closest('a[href]')
      if (!link) return

      const href = link.getAttribute('href')

      // Skip external links and anchor links
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) {
        return
      }

      // Skip if it's a file download
      if (href.match(/\.(pdf|zip|rar|exe|dmg|apk)$/i)) {
        return
      }

      e.preventDefault()
      await this.router.navigate(href)
    })
  }

  async navigateTo(path) {
    await this.router.navigate(path)
  }

  showError(message) {
    const app = document.getElementById('app')
    if (app) {
      app.innerHTML = `
        <div class="flex items-center justify-center min-h-screen p-8">
          <div class="bg-error-container text-on-error-container p-6 rounded-xl max-w-md text-center">
            <span class="material-symbols-outlined text-4xl block mb-4">error</span>
            <h2 class="text-xl font-bold mb-2">عذراً، حدث خطأ</h2>
            <p class="mb-4">${message}</p>
            <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors">
              إعادة المحاولة
            </button>
          </div>
        </div>
      `
    }
  }

  getData() {
    return this.dataService
  }

  getSearch() {
    return this.searchService
  }
}

export default App