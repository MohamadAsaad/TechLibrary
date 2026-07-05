export default class Pagination {
  constructor(currentPage, totalPages, onPageChange) {
    this.currentPage = currentPage
    this.totalPages = totalPages
    this.onPageChange = onPageChange
  }

  render() {
    const container = document.createElement('div')
    container.className = 'flex justify-center items-center gap-sm mt-xl w-full'
    
    const pages = this.getPageNumbers()
    
    container.innerHTML = `
      <button class="pagination-prev w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors ${this.currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}" ${this.currentPage <= 1 ? 'disabled' : ''}>
        <span class="material-symbols-outlined">chevron_right</span>
      </button>
      ${pages.map(page => {
        if (page === '...') {
          return `<span class="text-on-surface-variant px-sm">...</span>`
        }
        return `
          <button class="pagination-page w-10 h-10 rounded-full ${page === this.currentPage ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface hover:bg-surface-container-high hover:text-primary'} font-label-md text-label-md flex items-center justify-center transition-colors">
            ${page}
          </button>
        `
      }).join('')}
      <button class="pagination-next w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors ${this.currentPage >= this.totalPages ? 'opacity-50 cursor-not-allowed' : ''}" ${this.currentPage >= this.totalPages ? 'disabled' : ''}>
        <span class="material-symbols-outlined">chevron_left</span>
      </button>
    `

    // Add event listeners
    container.querySelectorAll('.pagination-page').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.textContent)
        if (page !== this.currentPage && this.onPageChange) {
          this.onPageChange(page)
        }
      })
    })

    container.querySelector('.pagination-prev').addEventListener('click', () => {
      if (this.currentPage > 1 && this.onPageChange) {
        this.onPageChange(this.currentPage - 1)
      }
    })

    container.querySelector('.pagination-next').addEventListener('click', () => {
      if (this.currentPage < this.totalPages && this.onPageChange) {
        this.onPageChange(this.currentPage + 1)
      }
    })

    return container
  }

  getPageNumbers() {
    const pages = []
    const total = this.totalPages
    const current = this.currentPage

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total - 1, total)
      } else if (current >= total - 2) {
        pages.push(1, 2, '...', total - 3, total - 2, total - 1, total)
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total)
      }
    }

    return pages
  }
}