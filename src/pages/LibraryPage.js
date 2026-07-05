import Card from '../components/Card.js'
import Sidebar from '../components/Sidebar.js'
import Pagination from '../components/Pagination.js'
import { debounce } from '../utils/helpers.js'

export default class LibraryPage {
  constructor(dataService) {
    this.dataService = dataService
    this.posts = dataService.posts || []
    this.categories = dataService.categories || []
    this.tags = dataService.tags || []
    this.currentPage = 1
    this.pageSize = 9
    this.filters = {
      category: '',
      tag: '',
      sort: 'newest',
      search: '',
    }
    this.filteredPosts = []
  }

  async render() {
    const container = document.createElement('div')
    container.className = 'flex-1 flex flex-col gap-2xl pb-3xl w-full'

    this.applyFilters()
    const totalPages = Math.ceil(this.filteredPosts.length / this.pageSize)
    const paginatedPosts = this.getPaginatedPosts()

    container.innerHTML = `
      <!-- Hero / Search Section -->
      <section class="bg-surface-container-lowest border border-tertiary-fixed rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-2xl text-center flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
        <div class="absolute inset-0 z-0 opacity-10">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="2" cy="2" fill="#004ac6" r="2"></circle>
              </pattern>
            </defs>
            <rect fill="url(#dots)" width="100%" height="100%" x="0" y="0"></rect>
          </svg>
        </div>
        <div class="relative z-10 w-full max-w-2xl flex flex-col gap-lg items-center">
          <h1 class="font-headline-lg text-headline-lg text-on-surface">استكشف المكتبة الرقمية</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant">ابحث في آلاف المقالات، الأدوات، والبرمجيات المفتوحة المصدر</p>
          <div class="w-full flex bg-surface-bright border border-outline-variant rounded-full focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-fixed transition-all overflow-hidden shadow-sm">
            <span class="material-symbols-outlined text-outline p-md flex items-center justify-center">search</span>
            <input data-library-search class="w-full bg-transparent border-none focus:ring-0 font-body-md text-body-md px-md py-md text-on-surface placeholder:text-on-surface-variant/60" placeholder="ابحث عن أدوات، مكتبات، أو مقالات..." type="text"/>
            <button data-search-btn class="bg-primary text-on-primary font-label-md text-label-md px-lg py-md hover:bg-primary-fixed-variant transition-colors">بحث</button>
          </div>
        </div>
      </section>

      <!-- Library Content -->
      <section class="flex flex-col gap-lg w-full">
        <!-- Filters & Controls Toolbar -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-surface-container-lowest p-md rounded-lg border border-tertiary-fixed shadow-[0_4px_20px_rgba(0,0,0,0.04)] w-full">
          <div class="flex flex-wrap gap-sm">
            <select data-filter-category class="bg-surface-bright border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary">
              <option value="">كل التصنيفات</option>
              ${this.categories.map(cat => `
                <option value="${cat}">${cat}</option>
              `).join('')}
            </select>
            <select data-filter-tag class="bg-surface-bright border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary">
              <option value="">جميع الوسوم</option>
              ${this.tags.map(tag => `
                <option value="${tag}">${tag}</option>
              `).join('')}
            </select>
            <select data-filter-sort class="bg-surface-bright border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary">
              <option value="newest">أحدث الإضافات</option>
              <option value="popular">الأكثر تقييماً</option>
              <option value="alphabetical">الاسم (أ-ي)</option>
            </select>
          </div>
          <div class="flex items-center gap-sm">
            <button data-view-grid class="p-sm text-primary bg-primary-container/10 rounded hover:bg-primary-container/20 transition-colors" title="عرض شبكي">
              <span class="material-symbols-outlined filled-icon">grid_view</span>
            </button>
            <button data-view-list class="p-sm text-on-surface-variant hover:bg-surface-container-high rounded transition-colors" title="عرض قائمة">
              <span class="material-symbols-outlined">view_list</span>
            </button>
          </div>
        </div>

        <!-- Results count -->
        <div class="text-sm text-on-surface-variant">
          عرض ${paginatedPosts.length} من ${this.filteredPosts.length} مقالة
        </div>

        <!-- Grid -->
        <div data-posts-grid class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg w-full">
          ${paginatedPosts.length > 0 ? paginatedPosts.map(post => {
            const card = new Card(post)
            return card.render().outerHTML
          }).join('') : `
            <div class="col-span-full text-center py-12">
              <span class="material-symbols-outlined text-4xl text-outline block mb-4">search_off</span>
              <p class="text-on-surface-variant">لا توجد نتائج مطابقة لبحثك</p>
            </div>
          `}
        </div>

        <!-- Pagination -->
        ${totalPages > 1 ? `
          <div data-pagination-container></div>
        ` : ''}
      </section>
    `

    // Setup pagination
    const paginationContainer = container.querySelector('[data-pagination-container]')
    if (paginationContainer) {
      const pagination = new Pagination(this.currentPage, totalPages, (page) => {
        this.currentPage = page
        this.renderPosts(container)
      })
      paginationContainer.appendChild(pagination.render())
    }

    // Setup event listeners
    this.setupEventListeners(container)

    return container
  }

  setupEventListeners(container) {
    const searchInput = container.querySelector('[data-library-search]')
    const searchBtn = container.querySelector('[data-search-btn]')
    const categorySelect = container.querySelector('[data-filter-category]')
    const tagSelect = container.querySelector('[data-filter-tag]')
    const sortSelect = container.querySelector('[data-filter-sort]')

    const updateFilters = () => {
      this.filters.search = searchInput ? searchInput.value.trim() : ''
      this.filters.category = categorySelect ? categorySelect.value : ''
      this.filters.tag = tagSelect ? tagSelect.value : ''
      this.filters.sort = sortSelect ? sortSelect.value : 'newest'
      this.currentPage = 1
      this.renderPosts(container)
    }

    if (searchInput) {
      searchInput.addEventListener('input', debounce(updateFilters, 300))
    }
    if (searchBtn) {
      searchBtn.addEventListener('click', updateFilters)
    }
    if (categorySelect) {
      categorySelect.addEventListener('change', updateFilters)
    }
    if (tagSelect) {
      tagSelect.addEventListener('change', updateFilters)
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', updateFilters)
    }

    // View toggle
    const gridBtn = container.querySelector('[data-view-grid]')
    const listBtn = container.querySelector('[data-view-list]')
    const grid = container.querySelector('[data-posts-grid]')

    if (gridBtn && listBtn && grid) {
      gridBtn.addEventListener('click', () => {
        grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg w-full'
        gridBtn.classList.add('text-primary', 'bg-primary-container/10')
        listBtn.classList.remove('text-primary', 'bg-primary-container/10')
      })
      listBtn.addEventListener('click', () => {
        grid.className = 'grid grid-cols-1 gap-lg w-full'
        listBtn.classList.add('text-primary', 'bg-primary-container/10')
        gridBtn.classList.remove('text-primary', 'bg-primary-container/10')
      })
    }
  }

  applyFilters() {
    let posts = [...this.posts]

    // Search filter
    if (this.filters.search) {
      const query = this.filters.search.toLowerCase()
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(query) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(query)) ||
        (p.content && p.content.toLowerCase().includes(query)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query))) ||
        (p.category && p.category.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (this.filters.category) {
      posts = posts.filter(p => p.category === this.filters.category)
    }

    // Tag filter
    if (this.filters.tag) {
      posts = posts.filter(p => p.tags && p.tags.includes(this.filters.tag))
    }

    // Sorting
    switch (this.filters.sort) {
      case 'newest':
        posts.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'popular':
        posts.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'alphabetical':
        posts.sort((a, b) => a.title.localeCompare(b.title, 'ar'))
        break
      default:
        posts.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    this.filteredPosts = posts
  }

  getPaginatedPosts() {
    const start = (this.currentPage - 1) * this.pageSize
    const end = start + this.pageSize
    return this.filteredPosts.slice(start, end)
  }

  renderPosts(container) {
    this.applyFilters()
    const totalPages = Math.ceil(this.filteredPosts.length / this.pageSize)
    const paginatedPosts = this.getPaginatedPosts()

    // Update grid
    const grid = container.querySelector('[data-posts-grid]')
    if (grid) {
      grid.innerHTML = paginatedPosts.length > 0 ? paginatedPosts.map(post => {
        const card = new Card(post)
        return card.render().outerHTML
      }).join('') : `
        <div class="col-span-full text-center py-12">
          <span class="material-symbols-outlined text-4xl text-outline block mb-4">search_off</span>
          <p class="text-on-surface-variant">لا توجد نتائج مطابقة لبحثك</p>
        </div>
      `
    }

    // Update results count
    const countEl = container.querySelector('.text-sm.text-on-surface-variant')
    if (countEl) {
      countEl.textContent = `عرض ${paginatedPosts.length} من ${this.filteredPosts.length} مقالة`
    }

    // Update pagination
    const paginationContainer = container.querySelector('[data-pagination-container]')
    if (paginationContainer) {
      if (totalPages > 1) {
        const pagination = new Pagination(this.currentPage, totalPages, (page) => {
          this.currentPage = page
          this.renderPosts(container)
        })
        paginationContainer.innerHTML = ''
        paginationContainer.appendChild(pagination.render())
      } else {
        paginationContainer.innerHTML = ''
      }
    }
  }
}