import { formatDate } from '../utils/helpers.js'

export default class AdminDashboardPage {
  constructor(dataService) {
    this.dataService = dataService
    this.posts = this.dataService.posts || []
  }

  async render() {
    const container = document.createElement('div')
    container.className = 'flex-1 flex flex-col gap-lg max-w-[1000px] w-full mx-auto'

    container.innerHTML = `
      <div class="flex justify-between items-center mb-md">
        <div>
          <h1 class="font-headline-lg text-headline-lg font-bold text-on-surface">لوحة التحكم</h1>
          <p class="text-on-surface-variant text-sm mt-1">إدارة المقالات والمحتوى</p>
        </div>
        <div class="flex gap-sm">
          <a href="/admin/categories" class="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-variant transition-colors font-label-md flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">category</span>
            التصنيفات
          </a>
          <a href="/admin/article/new" class="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors font-label-md flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">add</span>
            مقال جديد
          </a>
        </div>
      </div>

      <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-right border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant font-label-md">
                <th class="px-4 py-3">المقال</th>
                <th class="px-4 py-3">التصنيف</th>
                <th class="px-4 py-3">التاريخ</th>
                <th class="px-4 py-3">المشاهدات</th>
                <th class="px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              ${this.posts.length > 0 ? this.posts.map(post => `
                <tr class="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors group">
                  <td class="px-4 py-3">
                    <div class="font-bold text-on-surface line-clamp-1 max-w-[300px]" title="${post.title}">${post.title}</div>
                    <div class="text-xs text-on-surface-variant mt-1">/${post.slug || post.id}</div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="bg-surface-container-high text-on-surface-variant text-xs px-2 py-1 rounded-full">${post.category || 'عام'}</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-on-surface-variant">${formatDate(post.date)}</td>
                  <td class="px-4 py-3 text-sm text-on-surface-variant">${post.views || 0}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href="/admin/article/edit/${post.id}" class="p-1.5 bg-secondary-container text-on-secondary-container rounded hover:bg-secondary/20 transition-colors" title="تعديل">
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                      </a>
                      <button data-delete-id="${post.id}" class="p-1.5 bg-error-container text-on-error-container rounded hover:bg-error/20 transition-colors" title="حذف">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" class="px-4 py-8 text-center text-on-surface-variant">لا توجد مقالات مضافة حالياً.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `

    // Handle Deletions
    container.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.deleteId
        if (confirm('هل أنت متأكد أنك تريد حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.')) {
          this.dataService.deletePost(id)
          // reload the page to show changes
          window.location.reload()
        }
      })
    })

    return container
  }
}
