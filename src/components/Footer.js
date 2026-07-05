export default class Footer {
  render() {
    const footer = document.createElement('footer')
    footer.className = 'w-full bg-surface-container-highest border-t border-surface-variant mt-20 relative overflow-hidden'

    const year = new Date().getFullYear()

    footer.innerHTML = `
      <div class="max-w-[1280px] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        <!-- Brand -->
        <div class="lg:col-span-2 flex flex-col items-start">
          <a href="/" class="font-display-lg text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-primary to-primary-fixed mb-4 inline-block select-none transition-transform hover:scale-105">
            TechLibrary
          </a>
          <p class="text-on-surface-variant font-body-md text-base leading-relaxed max-w-sm mb-6">
            مكتبتك التقنية الشخصية. مكانك المفضل لاستكشاف المقالات التقنية والبرمجية وتعلم مهارات جديدة في عالم البرمجة وتطوير البرمجيات.
          </p>
          <div class="flex items-center gap-3">
            <a href="#" class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all duration-300 hover:-translate-y-1" title="مشاركة">
              <span class="material-symbols-outlined text-[20px]">share</span>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all duration-300 hover:-translate-y-1" title="راسلنا">
              <span class="material-symbols-outlined text-[20px]">mail</span>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all duration-300 hover:-translate-y-1" title="نسخ الرابط">
              <span class="material-symbols-outlined text-[20px]">link</span>
            </a>
          </div>
        </div>

        <!-- Explore -->
        <div>
          <h3 class="font-headline-sm text-lg font-bold text-on-surface mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">استكشف</h3>
          <nav class="flex flex-col gap-3">
            ${[
              { href: '/library', label: 'المكتبة' },
              { href: '/categories', label: 'التصنيفات' },
              { href: '/tags', label: 'الوسوم' },
              { href: '/about', label: 'عن المكتبة' },
            ].map(l => `
              <a href="${l.href}" class="text-on-surface-variant hover:text-primary font-label-md text-base flex items-center gap-2 transition-colors group w-fit">
                <span class="material-symbols-outlined text-[18px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_left</span>
                ${l.label}
              </a>
            `).join('')}
          </nav>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="font-headline-sm text-lg font-bold text-on-surface mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">النشرة البريدية</h3>
          <p class="text-on-surface-variant font-body-sm text-sm mb-4 leading-relaxed">اشترك ليصلك أحدث المقالات التقنية والبرمجية فور نشرها.</p>
          <form class="flex flex-col gap-3" onsubmit="event.preventDefault();alert('تم الاشتراك بنجاح!')">
            <div class="relative">
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">mail</span>
              <input type="email" placeholder="البريد الإلكتروني" required class="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-3 pr-10 pl-4 font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"/>
            </div>
            <button type="submit" class="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md font-bold text-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
              اشترك الآن
              <span class="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-surface-variant bg-surface-container-high py-4">
        <div class="max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-right">
          <p class="text-on-surface-variant font-body-sm text-sm font-bold">
            &copy; ${year} TechLibrary. جميع الحقوق محفوظة.
          </p>
          <div class="flex items-center justify-center gap-1.5 text-on-surface-variant font-body-sm text-sm font-bold">
            <span>صنع بـ</span>
            <span class="material-symbols-outlined text-[16px] text-error filled-icon animate-pulse">favorite</span>
            <span>بواسطة فريق TechLibrary</span>
          </div>
        </div>
      </div>
    `

    return footer
  }
}
