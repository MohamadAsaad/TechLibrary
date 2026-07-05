import Card from '../components/Card.js'
import { formatDate, truncateText } from '../utils/helpers.js'

export default class HomePage {
  constructor(dataService) {
    this.dataService = dataService
    this.posts = dataService.posts || []
    this.downloads = dataService.downloads || []
    this.categories = dataService.categories || []
    this.tags = dataService.tags || []
  }

  async render() {
    const container = document.createElement('div')
    container.className = 'flex-grow flex flex-col gap-3xl pb-2xl min-w-0'

    const featured = this.posts.filter(p => p.featured).slice(0, 3)
    const latest = this.posts.slice(0, 6)
    
    const stats = [
      { icon: 'description', value: `${this.posts.length}+`, label: 'المقالات التقنية' },
      { icon: 'build', value: `${this.downloads.length}+`, label: 'الأدوات والبرمجيات' },
      { icon: 'group', value: '10K+', label: 'مطور عربي' },
      { icon: 'category', value: `${this.categories.length}`, label: 'التصنيفات الشاملة' },
    ]

    container.innerHTML = `
      <!-- Hero Section -->
      <section class="flex flex-col items-center justify-center text-center py-[100px] px-md rounded-3xl bg-surface-container-lowest border border-surface-variant shadow-sm relative overflow-hidden animate-fade-in">
        <div class="absolute inset-0 bg-gradient-to-br from-surface-container-highest via-surface-container-lowest to-transparent pointer-events-none"></div>
        
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-highest text-primary font-label-sm text-sm mb-6 border border-surface-variant backdrop-blur-md relative z-10">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          اكتشف أحدث المقالات التقنية
        </div>

        <h1 class="font-display-lg text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-l from-primary to-primary-fixed mb-6 relative z-10 leading-tight">
          مكتبتك التقنية الشخصية<br/>نحو احتراف البرمجة
        </h1>
        
        <p class="font-body-lg text-lg md:text-xl text-on-surface-variant max-w-2xl mb-10 relative z-10 leading-relaxed">
          انضم إلى مجتمع المطورين العرب، واستكشف آلاف المقالات والأدوات والتطبيقات المصممة لتعزيز رحلتك في عالم التكنولوجيا.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 w-full max-w-xl mb-10 relative z-10">
          <div class="relative flex-grow group">
            <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
            <input data-hero-search class="w-full bg-surface-bright border border-outline-variant rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface transition-all font-body-md text-lg shadow-sm" placeholder="ما الذي تبحث عنه اليوم؟" type="text"/>
          </div>
        </div>
        
        <div class="flex flex-wrap justify-center gap-4 relative z-10">
          <a href="/library" class="bg-primary text-on-primary font-label-lg text-lg px-8 py-3 rounded-xl hover:opacity-90 hover:scale-105 hover:shadow-lg transition-all flex items-center gap-2">
            استكشف المكتبة
            <span class="material-symbols-outlined">explore</span>
          </a>
          <a href="#latest" class="bg-surface text-on-surface border border-outline-variant font-label-lg text-lg px-8 py-3 rounded-xl hover:bg-surface-variant hover:scale-105 transition-all flex items-center gap-2">
            آخر المقالات
            <span class="material-symbols-outlined">arrow_downward</span>
          </a>
        </div>
      </section>

      <!-- Statistics -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-md animate-fade-in-delay-1">
        ${stats.map(stat => `
          <div class="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-variant shadow-sm flex flex-col items-center justify-center text-center group hover:-translate-y-2 hover:shadow-md transition-all duration-300">
            <div class="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-4 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <span class="material-symbols-outlined filled-icon text-3xl">${stat.icon}</span>
            </div>
            <span class="font-headline-lg text-3xl md:text-4xl text-on-surface font-black mb-1">${stat.value}</span>
            <span class="font-label-md text-sm md:text-base text-on-surface-variant">${stat.label}</span>
          </div>
        `).join('')}
      </section>

      <!-- Featured Posts -->
      ${featured.length > 0 ? `
        <section class="animate-fade-in-delay-2">
          <div class="flex items-center justify-between mb-8">
            <h2 class="font-headline-md text-3xl font-black text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-3xl">stars</span>
              مختارات مميزة
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-lg">
            ${featured.map(post => {
              const card = new Card(post)
              return card.render().outerHTML
            }).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Latest Posts -->
      <section id="latest" class="animate-fade-in-delay-2 pt-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="font-headline-md text-3xl font-black text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-3xl">new_releases</span>
            أحدث المقالات
          </h2>
          <a href="/library" class="hidden sm:flex items-center gap-1 text-primary hover:text-primary-fixed transition-colors font-label-md">
            عرض الكل
            <span class="material-symbols-outlined text-sm">arrow_left</span>
          </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          ${latest.map(post => {
            const card = new Card(post)
            return card.render().outerHTML
          }).join('')}
        </div>
        ${this.posts.length > 6 ? `
          <div class="text-center mt-12 sm:hidden">
            <a href="/library" class="inline-flex items-center justify-center gap-2 text-on-primary bg-primary w-full py-3 rounded-xl hover:opacity-90 transition-colors font-label-md text-lg">
              عرض جميع المقالات
            </a>
          </div>
        ` : ''}
      </section>
    `

    // Setup hero search
    const heroSearch = container.querySelector('[data-hero-search]')
    if (heroSearch) {
      heroSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = e.target.value.trim()
          if (query) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`
          }
        }
      })
    }

    return container
  }
}