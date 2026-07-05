// src/router/index.js
import RouterService from '../services/RouterService.js'
import HomePage from '../pages/HomePage.js'
import ArticlePage from '../pages/ArticlePage.js'
import LibraryPage from '../pages/LibraryPage.js'
import AboutPage from '../pages/AboutPage.js'
import SearchPage from '../pages/SearchPage.js'
import CategoryPage from '../pages/CategoryPage.js'
import TagPage from '../pages/TagPage.js'
import AdminDashboardPage from '../pages/AdminDashboardPage.js'
import AdminCategoriesPage from '../pages/AdminCategoriesPage.js'
import AdminArticleEditorPage from '../pages/AdminArticleEditorPage.js'

export default class Router {
  constructor(app) {
    this.app = app
    this.routerService = new RouterService(app)
    this.currentPath = '/'
  }

  updateSEO(title, description) {
    document.title = title ? `${title} - TechLibrary` : 'TechLibrary - مكتبتك التقنية الشخصية'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', description || 'TechLibrary - استكشف آلاف المقالات، والأدوات، والتطبيقات المصممة لتعزيز رحلتك في عالم التكنولوجيا.')
    }
  }

  init() {
    // Define routes
    this.routerService
      .addRoute('/', async () => {
        this.updateSEO('الرئيسية')
        const page = new HomePage(this.app.getData())
        return await page.render()
      })
      .addRoute('/library', async () => {
        this.updateSEO('المكتبة', 'تصفح جميع المقالات والمحتوى التقني في TechLibrary.')
        const page = new LibraryPage(this.app.getData())
        return await page.render()
      })
      .addRoute('/about', async () => {
        this.updateSEO('حول الموقع', 'تعرف على TechLibrary ورسالتنا في إثراء المحتوى التقني.')
        const page = new AboutPage()
        return await page.render()
      })
      .addRoute('/search', async ({ params, app }) => {
        const url = new URL(window.location.href)
        const query = url.searchParams.get('q') || ''
        this.updateSEO(`نتائج البحث عن "${query}"`)
        const page = new SearchPage(app.getData(), app.getSearch(), query)
        return await page.render()
      })
      .addRoute('/article/:slug', async ({ params, app }) => {
        const page = new ArticlePage(app.getData(), params.slug)
        const rendered = await page.render()
        if (page.post) {
          this.updateSEO(page.post.title, page.post.excerpt || page.post.title)
        }
        return rendered
      })
      .addRoute('/category/:name', async ({ params, app }) => {
        this.updateSEO(`تصنيف: ${params.name}`)
        const page = new CategoryPage(app.getData(), params.name)
        return await page.render()
      })
      .addRoute('/categories', async ({ app }) => {
        this.updateSEO('التصنيفات', 'استعرض جميع التصنيفات في TechLibrary')
        // Show all categories page
        const data = app.getData()
        const container = document.createElement('div')
        container.className = 'flex-grow pb-3xl'
        container.innerHTML = `
          <div style="margin-bottom:2rem;">
            <h1 style="font-family:'Cairo',sans-serif;font-weight:900;font-size:2rem;color:var(--on-surface);margin-bottom:0.5rem;">جميع التصنيفات</h1>
            <p style="color:var(--on-surface-variant);font-family:'Cairo',sans-serif;">استعرض المقالات حسب التصنيف</p>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;">
            ${(data.categories || []).map(cat => `
              <a href="/category/${encodeURIComponent(cat.name || cat)}" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.75rem;padding:1.5rem;background-color:var(--surface-container-lowest);border:1px solid var(--outline-variant);border-radius:16px;text-decoration:none;color:var(--on-surface);font-family:'Cairo',sans-serif;font-weight:700;font-size:1rem;transition:all 0.2s;text-align:center;">
                <span class="material-symbols-outlined" style="font-size:2rem;color:var(--primary);">folder</span>
                ${cat.name || cat}
              </a>
            `).join('')}
          </div>
        `
        return container
      })
      .addRoute('/tags', async ({ app }) => {
        this.updateSEO('الوسوم', 'استعرض جميع الوسوم في TechLibrary')
        const data = app.getData()
        const container = document.createElement('div')
        container.className = 'flex-grow pb-3xl'
        container.innerHTML = `
          <div style="margin-bottom:2rem;">
            <h1 style="font-family:'Cairo',sans-serif;font-weight:900;font-size:2rem;color:var(--on-surface);margin-bottom:0.5rem;">جميع الوسوم</h1>
            <p style="color:var(--on-surface-variant);font-family:'Cairo',sans-serif;">استعرض المقالات حسب الوسم</p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:0.75rem;">
            ${(data.tags || []).map(tag => `
              <a href="/tag/${encodeURIComponent(tag)}" style="display:inline-flex;align-items:center;gap:0.35rem;padding:0.5rem 1.1rem;background-color:var(--surface-container-low);border:1px solid var(--outline-variant);border-radius:24px;text-decoration:none;color:var(--on-surface-variant);font-family:'Cairo',sans-serif;font-weight:600;font-size:0.9rem;transition:all 0.2s;">#${tag}</a>
            `).join('')}
          </div>
        `
        return container
      })
      .addRoute('/tag/:name', async ({ params, app }) => {
        this.updateSEO(`وسم: ${params.name}`)
        const page = new TagPage(app.getData(), params.name)
        return await page.render()
      })
      .addRoute('/admin', async ({ app }) => {
        this.updateSEO('لوحة التحكم')
        const page = new AdminDashboardPage(app.getData())
        return await page.render()
      })
      .addRoute('/admin/categories', async ({ app }) => {
        this.updateSEO('إدارة التصنيفات - لوحة التحكم')
        const page = new AdminCategoriesPage(app.getData())
        return await page.render()
      })
      .addRoute('/admin/article/new', async ({ app }) => {
        this.updateSEO('مقال جديد - لوحة التحكم')
        const page = new AdminArticleEditorPage(app.getData())
        return await page.render()
      })
      .addRoute('/admin/article/edit/:id', async ({ params, app }) => {
        this.updateSEO('تعديل المقال - لوحة التحكم')
        const page = new AdminArticleEditorPage(app.getData(), params.id)
        return await page.render()
      })
      .setNotFound(() => {
        this.updateSEO('الصفحة غير موجودة')
        const container = document.createElement('div')
        container.className = 'flex-1 flex flex-col items-center justify-center text-center py-3xl'
        container.innerHTML = `
          <span class="material-symbols-outlined text-6xl text-outline mb-4">error</span>
          <h2 class="font-headline-lg text-headline-lg text-on-surface mb-2">الصفحة غير موجودة</h2>
          <p class="text-on-surface-variant mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
          <a href="/" class="px-6 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors">العودة إلى الرئيسية</a>
        `
        return container
      })

    // Handle initial route
    const path = window.location.pathname
    this.routerService.handleRoute(path)
  }

  async navigate(path) {
    await this.routerService.navigate(path)
  }

  getCurrentPath() {
    return this.routerService.currentPath
  }
}