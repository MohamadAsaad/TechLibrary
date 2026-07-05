import { marked } from 'marked'
import hljs from 'highlight.js'
import { formatDate, getReadingTime, shareOn } from '../utils/helpers.js'
import { getBookmarks, toggleBookmark } from '../utils/storage.js'

export default class ArticlePage {
  constructor(dataService, slug) {
    this.dataService = dataService
    this.slug = slug
    this.post = null
    this.relatedPosts = []
  }

  async render() {
    // Find post by slug
    this.post = this.dataService.posts.find(p => p.slug === this.slug || p.id === this.slug)
    
    if (!this.post) {
      return this.renderNotFound()
    }

    // Get related posts
    this.relatedPosts = this.dataService.posts
      .filter(p => p.id !== this.post.id && p.category === this.post.category)
      .slice(0, 3)

    const container = document.createElement('div')
    container.className = 'flex-grow max-w-[800px]'

    // Configure marked with highlight.js
    marked.setOptions({
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value
        }
        return hljs.highlightAuto(code).value
      },
      breaks: true,
      gfm: true,
    })

    const rawContent = marked.parse(this.post.content || '')
    
    // Parse headings for TOC
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = rawContent
    const headings = tempDiv.querySelectorAll('h2, h3')
    
    headings.forEach((h, index) => {
      h.id = `heading-${index}`
      // Add some Tailwind classes to the headings for better styling
      if(h.tagName === 'H2') h.className = 'font-headline-md text-2xl font-bold mt-10 mb-4 text-on-surface border-b border-outline-variant/30 pb-2'
      if(h.tagName === 'H3') h.className = 'font-title-lg text-xl font-bold mt-8 mb-3 text-on-surface'
    })
    
    const contentHtml = tempDiv.innerHTML

    const tocHtml = headings.length > 0 ? `
      <div class="hidden lg:block w-72 flex-shrink-0">
        <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-6 sticky top-24 shadow-sm">
          <h3 class="font-bold text-on-surface mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">list</span>
            محتويات المقال
          </h3>
          <ul class="flex flex-col gap-2 font-body-sm">
            ${Array.from(headings).map((h, i) => `
              <li class="${h.tagName === 'H3' ? 'pr-4 border-r-2 border-surface-variant' : 'font-bold text-on-surface mt-2'}">
                <a href="#heading-${i}" class="text-on-surface-variant hover:text-primary transition-colors block py-1 line-clamp-2">${h.textContent}</a>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    ` : ''

    const isBookmarked = getBookmarks().includes(this.post.id)

    container.innerHTML = `
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="flex text-sm text-on-surface-variant mb-md font-label-md">
        <ol class="inline-flex items-center space-x-1 space-x-reverse md:space-x-2">
          <li class="inline-flex items-center">
            <a class="hover:text-primary transition-colors" href="/">الرئيسية</a>
          </li>
          <li>
            <div class="flex items-center">
              <span class="material-symbols-outlined text-[16px] mx-1">chevron_left</span>
              <a class="hover:text-primary transition-colors" href="/library">المكتبة</a>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <span class="material-symbols-outlined text-[16px] mx-1">chevron_left</span>
              <span class="text-on-surface font-semibold">${this.post.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Article Header -->
      <header class="mb-lg">
        <h1 class="font-headline-lg text-3xl md:text-5xl font-black text-on-surface mb-6 leading-tight">${this.post.title}</h1>
        <div class="flex flex-wrap items-center gap-4 md:gap-6 text-on-surface-variant font-label-md text-label-md mb-lg border-b border-surface-variant pb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-surface-container-highest text-primary flex items-center justify-center font-bold text-lg">
              ${this.post.author ? this.post.author.charAt(0) : 'أ'}
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-on-surface">${this.post.author || 'مكتبة تك'}</span>
              <span class="text-xs text-on-surface-variant">الكاتب</span>
            </div>
          </div>
          <span class="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
          <div class="flex flex-col">
            <span class="text-xs text-on-surface-variant mb-0.5">تاريخ النشر</span>
            <div class="flex items-center gap-1.5 font-bold text-on-surface">
              <span class="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
              <time datetime="${this.post.date}">${formatDate(this.post.date)}</time>
            </div>
          </div>
          <span class="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
          <div class="flex flex-col">
            <span class="text-xs text-on-surface-variant mb-0.5">وقت القراءة</span>
            <div class="flex items-center gap-1.5 font-bold text-on-surface">
              <span class="material-symbols-outlined text-[16px] text-primary">timer</span>
              <span>${getReadingTime(this.post.content || '')} دقيقة</span>
            </div>
          </div>
          <span class="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
          <div class="flex flex-col">
            <span class="text-xs text-on-surface-variant mb-0.5">المشاهدات</span>
            <div class="flex items-center gap-1.5 font-bold text-on-surface">
              <span class="material-symbols-outlined text-[16px] text-primary">visibility</span>
              <span>${this.post.views || 0}</span>
            </div>
          </div>
        </div>

        <!-- Cover Image -->
        ${this.post.coverImage ? `
          <figure class="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-sm border border-surface-variant mb-xl relative">
            <img class="w-full h-full object-cover" src="${this.post.coverImage}" alt="${this.post.title}" loading="lazy"/>
          </figure>
        ` : ''}
      </header>

      <div class="flex flex-col lg:flex-row gap-10 relative">
        <!-- Article Body & Tags Container -->
        <div class="flex-1 min-w-0">
          <div class="prose prose-lg dark:prose-invert max-w-none mb-3xl">
            ${contentHtml}
          </div>

          <!-- Tags -->
          ${this.post.tags && this.post.tags.length > 0 ? `
            <div class="flex flex-wrap gap-2 mb-3xl">
              ${this.post.tags.map(tag => `
                <a href="/tag/${tag}" class="px-3 py-1.5 bg-surface-container-high text-on-surface-variant font-label-md rounded-full text-sm hover:bg-primary hover:text-on-primary transition-colors">#${tag}</a>
              `).join('')}
            </div>
          ` : ''}

          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-4 mb-3xl pb-3xl border-b border-surface-variant">
            <button data-bookmark class="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors font-label-md">
              <span class="material-symbols-outlined ${isBookmarked ? 'filled-icon text-primary' : ''}">bookmark</span>
              <span>${isBookmarked ? 'محفوظ' : 'حفظ'}</span>
            </button>
            <button data-copy-link class="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors font-label-md">
              <span class="material-symbols-outlined">link</span>
              <span>نسخ الرابط</span>
            </button>
            <div class="flex items-center gap-2 mr-auto">
              <span class="text-on-surface-variant text-sm font-label-md">مشاركة:</span>
              <button data-share="twitter" class="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary">
                <span class="material-symbols-outlined">alternate_email</span>
              </button>
              <button data-share="facebook" class="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary">
                <span class="material-symbols-outlined">chat</span>
              </button>
              <button data-share="linkedin" class="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary">
                <span class="material-symbols-outlined">work</span>
              </button>
            </div>
          </div>

          <!-- Related Posts -->
          ${this.relatedPosts.length > 0 ? `
            <section class="mb-3xl">
              <h3 class="font-headline-md text-2xl font-black text-on-surface mb-6">مقالات ذات صلة</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                ${this.relatedPosts.map(post => `
                  <a href="/article/${post.slug || post.id}" class="group block bg-surface-container-lowest border border-surface-variant rounded-2xl overflow-hidden hover:shadow-md transition-all">
                    ${post.coverImage ? `
                      <div class="h-32 overflow-hidden border-b border-surface-variant">
                        <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${post.coverImage}" alt="${post.title}" loading="lazy"/>
                      </div>
                    ` : ''}
                    <div class="p-5">
                      <h4 class="font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">${post.title}</h4>
                      <p class="text-sm text-on-surface-variant line-clamp-2 mt-2 leading-relaxed">${post.excerpt || ''}</p>
                    </div>
                  </a>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
        
        <!-- Sidebar (TOC) -->
        ${tocHtml}
      </div>
    `

    // Setup event listeners
    this.setupEventListeners(container)
    
    // Trigger syntax highlighting after rendering
    if (typeof hljs !== 'undefined') {
      requestAnimationFrame(() => {
        container.querySelectorAll('pre code').forEach(block => {
          hljs.highlightElement(block)
        })
      })
    }

    return container
  }

  setupEventListeners(container) {
    // Bookmark toggle
    const bookmarkBtn = container.querySelector('[data-bookmark]')
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => {
        toggleBookmark(this.post.id)
        const icon = bookmarkBtn.querySelector('.material-symbols-outlined')
        const text = bookmarkBtn.querySelector('span:last-child')
        if (icon) {
          icon.classList.toggle('filled-icon')
          icon.classList.toggle('text-primary')
        }
        if (text) {
          text.textContent = icon.classList.contains('filled-icon') ? 'محفوظ' : 'حفظ'
        }
      })
    }

    // Copy link
    const copyBtn = container.querySelector('[data-copy-link]')
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const url = window.location.href
        navigator.clipboard.writeText(url).then(() => {
          const text = copyBtn.querySelector('span:last-child')
          if (text) {
            const original = text.textContent
            text.textContent = 'تم النسخ!'
            setTimeout(() => text.textContent = original, 2000)
          }
        })
      })
    }

    // Share buttons
    container.querySelectorAll('[data-share]').forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.share
        const url = window.location.href
        const title = this.post.title
        shareOn(platform, url, title)
      })
    })
  }

  renderNotFound() {
    const container = document.createElement('div')
    container.className = 'flex-grow max-w-[800px] flex flex-col items-center justify-center text-center py-3xl'
    container.innerHTML = `
      <span class="material-symbols-outlined text-6xl text-outline mb-4">article</span>
      <h2 class="font-headline-lg text-headline-lg text-on-surface mb-2">المقال غير موجود</h2>
      <p class="text-on-surface-variant mb-6">عذراً، المقال الذي تبحث عنه غير موجود أو تم حذفه.</p>
      <a href="/" class="px-6 py-3 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-colors">العودة إلى الرئيسية</a>
    `
    return container
  }
}