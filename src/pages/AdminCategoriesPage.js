export default class AdminCategoriesPage {
  constructor(dataService) {
    this.dataService = dataService
    this.categories = this.dataService.categories || []
  }

  async render() {
    const container = document.createElement('div')
    container.className = 'flex-1 flex flex-col gap-lg max-w-[800px] w-full mx-auto'

    container.innerHTML = `
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="flex text-sm text-on-surface-variant mb-4 font-label-md">
        <ol class="inline-flex items-center space-x-1 space-x-reverse md:space-x-2">
          <li class="inline-flex items-center">
            <a class="hover:text-primary transition-colors" href="/admin">لوحة التحكم</a>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <span class="material-symbols-outlined text-[16px] mx-1">chevron_left</span>
              <span class="text-on-surface font-semibold">إدارة التصنيفات</span>
            </div>
          </li>
        </ol>
      </nav>

      <div class="flex justify-between items-center mb-md">
        <div>
          <h1 class="font-headline-lg text-headline-lg font-bold text-on-surface">إدارة التصنيفات</h1>
          <p class="text-on-surface-variant text-sm mt-1">إضافة وحذف تصنيفات المقالات</p>
        </div>
      </div>

      <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm p-6 mb-lg">
        <form id="add-category-form" class="flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-bold text-on-surface mb-2">اسم التصنيف الجديد</label>
            <input type="text" id="category-name" required class="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface" placeholder="مثال: تطوير الويب">
          </div>
          <button type="submit" class="px-6 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors font-label-md flex items-center gap-2 h-[42px]">
            <span class="material-symbols-outlined text-[18px]">add</span>
            إضافة
          </button>
        </form>
      </div>

      <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-right border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant font-label-md">
              <th class="px-4 py-3">اسم التصنيف</th>
              <th class="px-4 py-3 w-24">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            ${this.categories.length > 0 ? this.categories.map(cat => `
              <tr class="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors group">
                <td class="px-4 py-3">
                  <div class="font-bold text-on-surface">${cat}</div>
                </td>
                <td class="px-4 py-3">
                  <button data-delete-cat="${cat}" class="p-1.5 bg-error-container text-on-error-container rounded hover:bg-error/20 transition-colors opacity-0 group-hover:opacity-100" title="حذف">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="2" class="px-4 py-8 text-center text-on-surface-variant">لا توجد تصنيفات.</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `

    // Form submission
    const form = container.querySelector('#add-category-form')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const name = container.querySelector('#category-name').value.trim()
      if (name) {
        this.dataService.addCategory(name)
        window.location.reload()
      }
    })

    // Deletion
    container.querySelectorAll('[data-delete-cat]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.deleteCat
        if (confirm(`هل أنت متأكد من حذف التصنيف "${cat}"؟`)) {
          this.dataService.deleteCategory(cat)
          window.location.reload()
        }
      })
    })

    return container
  }
}
