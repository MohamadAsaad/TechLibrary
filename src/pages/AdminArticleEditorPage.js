import { generateSlug } from '../utils/helpers.js'

export default class AdminArticleEditorPage {
  constructor(dataService, id = null) {
    this.dataService = dataService
    this.id = id
    this.post = id ? this.dataService.posts.find(p => p.id === id) : null
    this.categories = this.dataService.categories || []
  }

  async render() {
    const isEdit = !!this.post
    const container = document.createElement('div')
    container.className = 'flex-1 flex flex-col gap-lg max-w-[1000px] w-full mx-auto pb-3xl'

    const title = isEdit ? 'تعديل المقال' : 'مقال جديد'
    const postData = this.post || { title: '', slug: '', excerpt: '', content: '', category: '', tags: [], coverImage: '', published: true }

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
              <span class="text-on-surface font-semibold">${title}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div class="flex justify-between items-center mb-md">
        <h1 class="font-headline-lg text-headline-lg font-bold text-on-surface">${title}</h1>
      </div>

      <form id="article-form" class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm p-8 flex flex-col gap-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <label class="font-bold text-sm text-on-surface">عنوان المقال *</label>
            <input type="text" id="post-title" value="${postData.title}" required class="bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-on-surface">
          </div>
          
          <div class="flex flex-col gap-2">
            <label class="font-bold text-sm text-on-surface">الرابط المخصص (Slug)</label>
            <input type="text" id="post-slug" value="${postData.slug}" class="bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-on-surface" placeholder="يُترك فارغاً للتوليد التلقائي">
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-bold text-sm text-on-surface">النبذة (Excerpt)</label>
          <textarea id="post-excerpt" rows="2" class="bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-on-surface resize-y">${postData.excerpt}</textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <label class="font-bold text-sm text-on-surface">التصنيف</label>
            <select id="post-category" class="bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-on-surface">
              <option value="">بدون تصنيف</option>
              ${this.categories.map(cat => `
                <option value="${cat}" ${postData.category === cat ? 'selected' : ''}>${cat}</option>
              `).join('')}
            </select>
          </div>
          
          <div class="flex flex-col gap-2">
            <label class="font-bold text-sm text-on-surface">رابط صورة الغلاف</label>
            <input type="url" id="post-cover" value="${postData.coverImage || ''}" class="bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-on-surface" placeholder="https://...">
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-bold text-sm text-on-surface">الوسوم (مفصولة بفاصلة)</label>
          <input type="text" id="post-tags" value="${(postData.tags || []).join(', ')}" class="bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-on-surface" placeholder="تقنية, برمجة, ويب">
        </div>

        <div class="flex flex-col gap-2 flex-1 min-h-[300px]">
          <label class="font-bold text-sm text-on-surface">المحتوى (يدعم Markdown) *</label>
          <textarea id="post-content" required class="flex-1 bg-surface-bright border border-outline-variant rounded-lg px-4 py-4 focus:outline-none focus:border-primary text-on-surface resize-y font-mono text-sm leading-relaxed" style="min-height: 400px">${postData.content}</textarea>
        </div>

        <div class="flex items-center gap-2 mt-4 pt-4 border-t border-outline-variant/30">
          <input type="checkbox" id="post-published" ${postData.published ? 'checked' : ''} class="w-4 h-4 text-primary bg-surface-bright border-outline-variant rounded focus:ring-primary">
          <label for="post-published" class="text-sm font-bold text-on-surface">منشور للعامة</label>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <a href="/admin" class="px-6 py-2 bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-variant transition-colors font-label-md">إلغاء</a>
          <button type="submit" class="px-8 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors font-label-md flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">save</span>
            حفظ المقال
          </button>
        </div>
      </form>
    `

    // Auto-generate slug from title
    const titleInput = container.querySelector('#post-title')
    const slugInput = container.querySelector('#post-slug')
    
    titleInput.addEventListener('blur', () => {
      if (!slugInput.value.trim() && titleInput.value.trim()) {
        slugInput.value = generateSlug(titleInput.value)
      }
    })

    // Handle Submit
    const form = container.querySelector('#article-form')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      
      const title = titleInput.value.trim()
      let slug = slugInput.value.trim()
      if (!slug) slug = generateSlug(title)
      
      const tagsString = container.querySelector('#post-tags').value
      const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean)
      
      const updates = {
        title,
        slug,
        excerpt: container.querySelector('#post-excerpt').value.trim(),
        category: container.querySelector('#post-category').value,
        coverImage: container.querySelector('#post-cover').value.trim(),
        tags,
        content: container.querySelector('#post-content').value.trim(),
        published: container.querySelector('#post-published').checked,
        author: postData.author || 'مدير النظام'
      }

      if (isEdit) {
        this.dataService.updatePost(this.id, updates)
      } else {
        this.dataService.createPost(updates)
      }
      
      // Navigate back to admin dashboard
      window.location.href = '/admin'
    })

    return container
  }
}
