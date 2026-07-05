export default class Header {
  constructor() {
    this.navLinks = [
      { href: '/', label: 'الرئيسية', icon: 'home' },
      { href: '/library', label: 'المكتبة', icon: 'menu_book' },
      { href: '/categories', label: 'التصنيفات', icon: 'category' },
      { href: '/tags', label: 'الوسوم', icon: 'label' },
      { href: '/about', label: 'عن المكتبة', icon: 'info' },
    ]
  }

  render() {
    const header = document.createElement('header')
    header.id = 'main-header'
    header.className = 'fixed top-0 left-0 right-0 w-full h-[72px] z-50 bg-surface border-b border-surface-variant shadow-sm transition-all duration-300'

    const navLinksHTML = this.navLinks.map(link =>
      `<a href="${link.href}" class="nav-link text-on-surface-variant hover:text-primary hover:bg-surface-container px-4 py-2 rounded-xl font-label-md font-bold text-sm transition-all whitespace-nowrap flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[18px] opacity-70">${link.icon}</span>
        ${link.label}
      </a>`
    ).join('')

    const mobileNavHTML = this.navLinks.map(link =>
      `<a href="${link.href}" class="mobile-nav-link flex items-center gap-3 text-on-surface hover:bg-surface-container-high px-4 py-3 rounded-xl font-label-md font-bold text-base transition-colors border-b border-surface-variant">
        <span class="material-symbols-outlined text-primary">${link.icon}</span>
        ${link.label}
      </a>`
    ).join('')

    header.innerHTML = `
      <div class="max-w-[1280px] mx-auto h-full px-4 md:px-8 flex items-center justify-between gap-4">
        
        <!-- Logo -->
        <a href="/" class="font-display-lg text-2xl font-black text-primary flex-shrink-0 transition-transform hover:scale-105 select-none flex items-center gap-2">
          <span class="material-symbols-outlined text-[28px]">library_books</span>
          TechLibrary
        </a>

        <!-- Desktop Nav -->
        <nav id="desktop-nav" class="hidden md:flex items-center gap-1">
          ${navLinksHTML}
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 flex-shrink-0">
          
          <!-- Search -->
          <div id="search-wrapper" class="hidden lg:block relative group">
            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors pointer-events-none text-[20px]">search</span>
            <input data-search-input type="text" placeholder="ابحث في المكتبة..." id="header-search" class="bg-surface-container-low border border-outline-variant rounded-full py-2 pr-10 pl-4 font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-[220px] focus:w-[280px] transition-all duration-300 shadow-sm"/>
          </div>

          <!-- Admin Button -->
          <a href="/admin" id="admin-btn" class="hidden sm:flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-full font-label-md font-bold text-sm hover:opacity-90 hover:shadow-md transition-all whitespace-nowrap">
            <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span id="admin-text">لوحة التحكم</span>
          </a>

          <!-- Theme Toggle -->
          <button data-theme-toggle id="theme-btn" class="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors focus:outline-none" aria-label="تغيير المظهر">
            <span class="material-symbols-outlined text-[22px]">dark_mode</span>
          </button>

          <!-- Mobile Menu Button -->
          <button data-menu-toggle id="menu-btn" class="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors focus:outline-none" aria-label="القائمة">
            <span class="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Drawer -->
      <div data-mobile-menu id="mobile-drawer" class="fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-surface-container-lowest z-40 transform translate-x-full transition-transform duration-300 ease-in-out overflow-y-auto border-t border-surface-variant px-4 py-6 md:hidden">
        
        <div class="relative mb-6">
          <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input data-mobile-search type="text" placeholder="ابحث في المكتبة..." class="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pr-12 pl-4 font-body-md text-base text-on-surface focus:outline-none focus:border-primary transition-colors"/>
        </div>

        <nav class="flex flex-col gap-1 mb-8">
          ${mobileNavHTML}
        </nav>
        
        <a href="/admin" class="flex items-center justify-center gap-2 bg-primary text-on-primary p-4 rounded-xl font-label-lg font-bold text-base w-full hover:opacity-90 transition-colors shadow-sm">
          <span class="material-symbols-outlined">admin_panel_settings</span>
          لوحة التحكم
        </a>
      </div>
    `

    const menuBtn = header.querySelector('[data-menu-toggle]')
    const mobileMenu = header.querySelector('[data-mobile-menu]')
    const mobileSearch = header.querySelector('[data-mobile-search]')

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.style.transform === 'translateX(0%)'
        mobileMenu.style.transform = isOpen ? 'translateX(100%)' : 'translateX(0%)'
        const icon = menuBtn.querySelector('.material-symbols-outlined')
        if (icon) icon.textContent = isOpen ? 'menu' : 'close'
        document.body.style.overflow = isOpen ? '' : 'hidden'
      })
      if (mobileSearch) {
        mobileSearch.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const q = e.target.value.trim()
            if (q) {
              window.location.href = `/search?q=${encodeURIComponent(q)}`
            }
          }
        })
      }
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.style.transform = 'translateX(100%)'
          const icon = menuBtn.querySelector('.material-symbols-outlined')
          if (icon) icon.textContent = 'menu'
          document.body.style.overflow = ''
        })
      })
    }

    // Scroll effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('shadow-md')
      } else {
        header.classList.remove('shadow-md')
      }
    })

    return header
  }
}
