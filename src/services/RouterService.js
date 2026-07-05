// src/services/RouterService.js
export default class RouterService {
  constructor(app) {
    this.app = app
    this.routes = []
    this.currentPath = '/'
    this.currentPage = null
    this.notFoundRoute = null
    this.basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
  }

  addRoute(path, handler) {
    this.routes.push({ path, handler })
    return this
  }

  setNotFound(handler) {
    this.notFoundRoute = handler
    return this
  }

  async navigate(path) {
    // Clean path
    path = this.normalizePath(path)
    
    // Construct browser path
    let browserPath = path
    if (this.basePath) {
      // Extract query string to attach it correctly
      let search = ''
      let cleanPath = path
      const qIndex = path.indexOf('?')
      if (qIndex !== -1) {
        search = path.slice(qIndex)
        cleanPath = path.slice(0, qIndex)
      }
      browserPath = this.basePath + (cleanPath === '/' ? '' : cleanPath) + search
      if (!browserPath) browserPath = '/'
    }

    // Update browser history
    if (window.location.pathname + window.location.search !== browserPath) {
      window.history.pushState({ path }, '', browserPath)
    }

    await this.handleRoute(path)
  }

  async handleRoute(path) {
    try {
      // Clean path
      path = this.normalizePath(path)
      this.currentPath = path
      
      // Extract path without query for matching
      let matchPath = path
      const qIndex = path.indexOf('?')
      if (qIndex !== -1) {
        matchPath = path.slice(0, qIndex)
      }

      // Find matching route
      let handler = null
      let params = {}

      for (const route of this.routes) {
        const match = this.matchRoute(matchPath, route.path)
        if (match) {
          handler = route.handler
          params = match.params
          break
        }
      }

      if (!handler) {
        handler = this.notFoundRoute || this.defaultNotFound
      }

      // Update page
      const main = document.getElementById('app-main')
      if (main) {
        // Destroy current page if it has destroy method
        if (this.currentPage && typeof this.currentPage.destroy === 'function') {
          this.currentPage.destroy()
        }

        // Render new page with transition
        main.style.opacity = '0'
        main.style.transform = 'translateY(8px)'
        main.style.transition = 'opacity 0.2s ease, transform 0.2s ease'
        
        const pageContent = await handler({ path, params, app: this.app })
        main.innerHTML = ''
        main.appendChild(pageContent)
        this.currentPage = pageContent

        // Animate in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            main.style.opacity = '1'
            main.style.transform = 'translateY(0)'
          })
        })

        // Update SEO
        this.updateSEO(path)

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      console.error('Router error:', error)
      this.showError('حدث خطأ أثناء تحميل الصفحة')
    }
  }

  matchRoute(path, routePath) {
    // Handle exact match
    if (routePath === path) {
      return { params: {} }
    }

    // Handle dynamic routes
    const routeSegments = routePath.split('/').filter(Boolean)
    const pathSegments = path.split('/').filter(Boolean)

    if (routeSegments.length !== pathSegments.length) {
      return null
    }

    const params = {}
    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i]
      const pathSegment = pathSegments[i]

      if (routeSegment.startsWith(':')) {
        params[routeSegment.slice(1)] = decodeURIComponent(pathSegment)
      } else if (routeSegment !== pathSegment) {
        return null
      }
    }

    return { params }
  }

  normalizePath(path) {
    // Remove trailing slash
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1)
    }
    // Ensure leading slash
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    // Handle empty path
    if (!path) {
      path = '/'
    }
    return path
  }

  defaultNotFound() {
    const container = document.createElement('div')
    container.className = 'flex-1 flex flex-col items-center justify-center text-center py-3xl'
    container.innerHTML = `
      <span class="material-symbols-outlined text-6xl text-outline mb-4">error</span>
      <h2 class="font-headline-lg text-headline-lg text-on-surface mb-2">الصفحة غير موجودة</h2>
      <p class="text-on-surface-variant mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
      <a href="/" class="px-6 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors">العودة إلى الرئيسية</a>
    `
    return container
  }

  showError(message) {
    const main = document.getElementById('app-main')
    if (main) {
      main.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center text-center py-3xl">
          <span class="material-symbols-outlined text-6xl text-error mb-4">error</span>
          <h2 class="font-headline-lg text-headline-lg text-on-surface mb-2">عذراً، حدث خطأ</h2>
          <p class="text-on-surface-variant mb-6">${message}</p>
          <button onclick="location.reload()" class="px-6 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors">إعادة المحاولة</button>
        </div>
      `
    }
  }

  updateSEO(path) {
    // Update document title
    const title = this.getPageTitle(path)
    document.title = `${title} - TechLibrary`

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    const desc = this.getPageDescription(path)
    metaDesc.setAttribute('content', desc)

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `https://techlibrary.com${path}`)
  }

  getPageTitle(path) {
    if (path === '/') return 'الرئيسية'
    if (path === '/library') return 'المكتبة'
    if (path === '/about') return 'حول الموقع'
    if (path === '/search') return 'البحث'
    if (path.startsWith('/article/')) return 'المقالة'
    if (path.startsWith('/category/')) return 'التصنيف'
    if (path.startsWith('/tag/')) return 'الوسم'
    return 'الصفحة'
  }

  getPageDescription(path) {
    const defaults = {
      '/': 'مكتبتك التقنية الشخصية والمعرفية - استكشف آلاف المقالات والأدوات',
      '/library': 'استكشف المكتبة الرقمية - مقالات، أدوات، وبرمجيات مفتوحة المصدر',
      '/about': 'تعرف على مهمتنا وفريق العمل في TechLibrary',
      '/search': 'ابحث في محتوى TechLibrary',
    }
    return defaults[path] || 'TechLibrary - مكتبتك التقنية الشخصية'
  }
}