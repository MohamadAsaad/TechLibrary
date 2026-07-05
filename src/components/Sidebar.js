export default class Sidebar {
  constructor(activeItem = '') {
    this.activeItem = activeItem
    this.navItems = [
      { id: 'categories', icon: 'category', label: 'التصنيفات', href: '/categories' },
      { id: 'tags', icon: 'label', label: 'الوسوم', href: '/tags' },
      { id: 'articles', icon: 'article', label: 'أحدث المقالات', href: '/library' },
      { id: 'downloads', icon: 'download', label: 'التحميلات', href: '/downloads' },
    ]
  }

  render() {
    const aside = document.createElement('aside')
    aside.className = 'hidden lg:flex flex-col w-72 shrink-0 sticky top-20 right-0 h-[calc(100vh-5rem)] gap-unit bg-surface-container-low rounded-xl border-r border-outline-variant shadow-sm'
    
    aside.innerHTML = `
      <div class="p-md border-b border-outline-variant/50">
        <h2 class="font-headline-md text-headline-md font-bold text-primary">المستودع الرقمي</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant">بوابة المعرفة التقنية</p>
      </div>
      <nav class="flex flex-col py-sm overflow-y-auto">
        ${this.navItems.map(item => `
          <a href="${item.href}" class="flex items-center gap-3 ${this.activeItem === item.id ? 'bg-secondary-container text-on-secondary-container border-r-4 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'} px-4 py-3 transition-all ${this.activeItem === item.id ? 'rounded-l-lg translate-x-1 duration-200' : 'hover:bg-primary-container/10'} font-label-md text-label-md">
            <span class="material-symbols-outlined">${item.icon}</span>
            ${item.label}
          </a>
        `).join('')}
      </nav>
    `

    return aside
  }
}