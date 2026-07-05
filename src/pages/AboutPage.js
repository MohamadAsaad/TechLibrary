export default class AboutPage {
  async render() {
    const container = document.createElement('div')
    container.className = 'flex-1 w-full min-w-0 flex flex-col gap-3xl'

    container.innerHTML = `
      <!-- Hero / Mission Section -->
      <section class="flex flex-col md:flex-row gap-2xl items-center bg-surface-container-lowest border border-tertiary-fixed p-lg md:p-2xl rounded-xl shadow-sm relative overflow-hidden">
        <div class="absolute -top-32 -left-32 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl pointer-events-none"></div>
        <div class="flex-1 flex flex-col gap-lg z-10">
          <h1 class="font-headline-lg text-headline-lg text-on-surface">مهمتنا: تمكين المطور العربي</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            TechLibrary هي مبادرة تهدف إلى إثراء المحتوى التقني العربي وتوفير مرجع موثوق وحديث للمطورين والمهندسين. نؤمن بأن المعرفة التقنية يجب أن تكون متاحة للجميع بلغتهم الأم، مع الحفاظ على أعلى معايير الجودة والمصداقية.
          </p>
          <div class="flex gap-md pt-sm">
            <a href="/library" class="inline-flex items-center justify-center gap-2 bg-primary-container text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary-container/90 transition-colors shadow-sm">
              تواصل معنا
              <span class="material-symbols-outlined filled-icon">arrow_back</span>
            </a>
            <a href="https://github.com" target="_blank" class="inline-flex items-center justify-center gap-2 border border-outline text-on-surface px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined">code</span>
              المستودع المفتوح
            </a>
          </div>
        </div>

        <!-- Personal / Professional Card -->
        <div class="w-full md:w-[340px] shrink-0 bg-surface-container-lowest border border-tertiary-fixed rounded-xl p-lg flex flex-col items-center text-center shadow-[0px_8px_30px_rgba(0,0,0,0.08)] z-10 relative group">
          <div class="w-32 h-32 rounded-full mb-md overflow-hidden border-4 border-surface-bright shadow-sm relative">
            <img class="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=أحمد+مطور&background=2563eb&color=fff&size=128" alt="أحمد مطور"/>
          </div>
          <h3 class="font-headline-md text-headline-md text-on-surface mb-xs">أحمد مطور</h3>
          <p class="font-body-md text-body-md text-primary mb-lg">مؤسس ومطور رئيسي</p>
          <div class="w-full h-[1px] bg-outline-variant/30 mb-lg"></div>
          <p class="font-body-sm text-body-md text-on-surface-variant mb-lg px-sm">
            مهندس برمجيات شغوف بالتقنيات مفتوحة المصدر وتطوير واجهات المستخدم. يسعى لبناء مجتمعات تقنية عربية قوية.
          </p>
          <div class="flex gap-sm justify-center w-full">
            <a href="#" class="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-high rounded-full">
              <span class="material-symbols-outlined">mail</span>
            </a>
            <a href="#" class="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-high rounded-full">
              <span class="material-symbols-outlined">link</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Technologies Grid -->
      <section class="flex flex-col gap-lg">
        <div class="flex items-center gap-sm">
          <span class="material-symbols-outlined text-primary text-[32px]">terminal</span>
          <h2 class="font-headline-lg text-headline-lg text-on-surface">التقنيات المستخدمة</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div class="bg-surface-container-lowest border border-tertiary-fixed rounded-xl p-lg flex flex-col gap-sm shadow-sm hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
            <div class="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-sm">
              <span class="material-symbols-outlined text-primary text-[28px]">html</span>
            </div>
            <h4 class="font-headline-md text-headline-md text-on-surface text-lg">التطوير الأمامي</h4>
            <p class="font-body-md text-body-md text-on-surface-variant">
              مبني باستخدام HTML5 و Tailwind CSS لضمان تجربة مستخدم سريعة، متجاوبة، ومتوافقة تماماً مع التصميم.
            </p>
          </div>
          <div class="bg-surface-container-lowest border border-tertiary-fixed rounded-xl p-lg flex flex-col gap-sm shadow-sm hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
            <div class="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-sm">
              <span class="material-symbols-outlined text-primary text-[28px]">database</span>
            </div>
            <h4 class="font-headline-md text-headline-md text-on-surface text-lg">بنية البيانات</h4>
            <p class="font-body-md text-body-md text-on-surface-variant">
              نظام إدارة محتوى مهيكل لضمان تصنيف وتنظيم المقالات والموارد التقنية بكفاءة عالية.
            </p>
          </div>
          <div class="bg-surface-container-lowest border border-tertiary-fixed rounded-xl p-lg flex flex-col gap-sm shadow-sm hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
            <div class="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-sm">
              <span class="material-symbols-outlined text-primary text-[28px]">design_services</span>
            </div>
            <h4 class="font-headline-md text-headline-md text-on-surface text-lg">نظام التصميم</h4>
            <p class="font-body-md text-body-md text-on-surface-variant">
              اعتماد نظام تصميم مبني على Material 3 مع تخصيصات تناسب المحتوى التقني عالي الكثافة.
            </p>
          </div>
        </div>
      </section>
    `

    return container
  }
}