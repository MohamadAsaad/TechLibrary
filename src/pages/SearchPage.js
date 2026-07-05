import Card from '../components/Card.js'
import { debounce } from '../utils/helpers.js'

export default class SearchPage {
  constructor(dataService, searchService, query = '') {
    this.dataService = dataService
    this.searchService = searchService
    this.query = query
    this.results = []
  }

  async render() {
    const container = document.createElement('div')
    container.className = 'flex-1 flex flex-col gap-lg'

    // Perform search if query exists
    if (this.query) {
      this.results = this.searchService.search(this.query)
    }

    container.innerHTML = `
      <!-- Search Header -->
      <div class="bg-surface-container-lowest border border-tertiary-fixed rounded-xl p-2xl">
        <h1 class="font-headline-lg text-headline-lg text-on-surface mb-4">نتائج البحث</h1>
        <div class="flex gap-4">
          <input data-search-input type="text" value="${this.query}" class="flex-1 bg-surface-bright border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface" placeholder="ابحث عن مقالات، أدوات، أو مكتبات..."/>
          <button data-search-btn class="px-6 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors">بحث</button>
        </div>
      </div>

      <!-- Results -->
      <div class="flex flex-col gap-lg">
        <div class="text-sm text-on-surface-variant">
          ${this.results.length > 0 ? `عرض ${this.results.length} نتيجة` : this.query ? 'لا توجد نتائج مطابقة لبحثك' : 'اكتب كلمة للبحث'}
        </div>
        <div data-results-grid class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg w-full">
          ${this.results.map(post => {
            const card = new Card(post)
            return card.render().outerHTML
          }).join('')}
        </div>
      </div>
    `

    this.setupEventListeners(container)

    return container
  }

  setupEventListeners(container) {
    const searchInput = container.querySelector('[data-search-input]')
    const searchBtn = container.querySelector('[data-search-btn]')

    const performSearch = () => {
      const query = searchInput.value.trim()
      if (query) {
        window.location.href = `/search?q=${encodeURIComponent(query)}`
      }
    }

    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          performSearch()
        }
      })
      searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim()
        if (query.length > 1) {
          const results = this.searchService.search(query)
          const grid = container.querySelector('[data-results-grid]')
          if (grid) {
            grid.innerHTML = results.length > 0 ? results.map(post => {
              const card = new Card(post)
              return card.render().outerHTML
            }).join('') : `
              <div class="col-span-full text-center py-12">
                <span class="material-symbols-outlined text-4xl text-outline block mb-4">search_off</span>
                <p class="text-on-surface-variant">لا توجد نتائج مطابقة</p>
              </div>
            `
            const count = container.querySelector('.text-sm.text-on-surface-variant')
            if (count) {
              count.textContent = results.length > 0 ? `عرض ${results.length} نتيجة` : 'لا توجد نتائج مطابقة لبحثك'
            }
          }
        }
      }, 300))
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', performSearch)
    }
  }
}