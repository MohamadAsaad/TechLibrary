import Card from '../components/Card.js'
import Sidebar from '../components/Sidebar.js'

export default class CategoryPage {
  constructor(dataService, categoryName = '') {
    this.dataService = dataService
    this.categoryName = categoryName
    this.posts = dataService.posts || []
    this.categories = dataService.categories || []
  }

  async render() {
    const container = document.createElement('div')
    container.className = 'flex-1 flex flex-col gap-lg'

    const category = this.categories.find(c => c === this.categoryName)
    const categoryPosts = this.posts.filter(p => p.category === this.categoryName)

    if (!category && this.categoryName) {
      return this.renderNotFound(container)
    }

    container.innerHTML = `
      <div class="bg-surface-container-lowest border border-tertiary-fixed rounded-xl p-2xl">
        <h1 class="font-headline-lg text-headline-lg text-on-surface mb-2">
          ${category ? `التصنيف: ${category}` : 'جميع التصنيفات'}
        </h1>
        <p class="text-on-surface-variant">${categoryPosts.length} مقالة في هذا التصنيف</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg w-full">
        ${categoryPosts.map(post => {
          const card = new Card(post)
          return card.render().outerHTML
        }).join('')}
      </div>

      ${categoryPosts.length === 0 && category ? `
        <div class="text-center py-12">
          <span class="material-symbols-outlined text-4xl text-outline block mb-4">category</span>
          <p class="text-on-surface-variant">لا توجد مقالات في هذا التصنيف</p>
        </div>
      ` : ''}
    `

    return container
  }

  renderNotFound(container) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center py-3xl">
        <span class="material-symbols-outlined text-6xl text-outline mb-4">category</span>
        <h2 class="font-headline-lg text-headline-lg text-on-surface mb-2">التصنيف غير موجود</h2>
        <p class="text-on-surface-variant mb-6">عذراً، التصنيف الذي تبحث عنه غير موجود.</p>
        <a href="/" class="px-6 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors">العودة إلى الرئيسية</a>
      </div>
    `
    return container
  }
}