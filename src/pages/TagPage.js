import Card from '../components/Card.js'

export default class TagPage {
  constructor(dataService, tagName = '') {
    this.dataService = dataService
    this.tagName = tagName
    this.posts = dataService.posts || []
    this.tags = dataService.tags || []
  }

  async render() {
    const container = document.createElement('div')
    container.className = 'flex-1 flex flex-col gap-lg'

    const tag = this.tags.find(t => t === this.tagName)
    const tagPosts = this.posts.filter(p => p.tags && p.tags.includes(this.tagName))

    if (!tag && this.tagName) {
      return this.renderNotFound(container)
    }

    container.innerHTML = `
      <div class="bg-surface-container-lowest border border-tertiary-fixed rounded-xl p-2xl">
        <h1 class="font-headline-lg text-headline-lg text-on-surface mb-2">
          ${tag ? `الوسم: #${tag}` : 'جميع الوسوم'}
        </h1>
        <p class="text-on-surface-variant">${tagPosts.length} مقالة تحت هذا الوسم</p>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        ${this.tags.map(t => `
          <a href="/tag/${t}" class="px-3 py-1 rounded-full ${t === this.tagName ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary'} transition-colors text-sm">
            #${t}
          </a>
        `).join('')}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg w-full">
        ${tagPosts.map(post => {
          const card = new Card(post)
          return card.render().outerHTML
        }).join('')}
      </div>

      ${tagPosts.length === 0 && tag ? `
        <div class="text-center py-12">
          <span class="material-symbols-outlined text-4xl text-outline block mb-4">label</span>
          <p class="text-on-surface-variant">لا توجد مقالات تحت هذا الوسم</p>
        </div>
      ` : ''}
    `

    return container
  }

  renderNotFound(container) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center py-3xl">
        <span class="material-symbols-outlined text-6xl text-outline mb-4">label</span>
        <h2 class="font-headline-lg text-headline-lg text-on-surface mb-2">الوسم غير موجود</h2>
        <p class="text-on-surface-variant mb-6">عذراً، الوسم الذي تبحث عنه غير موجود.</p>
        <a href="/" class="px-6 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors">العودة إلى الرئيسية</a>
      </div>
    `
    return container
  }
}