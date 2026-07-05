export default class Card {
  constructor(data) {
    this.data = data
  }

  render() {
    const card = document.createElement('article')
    card.className = 'bg-surface-container-lowest border border-tertiary-fixed rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col group'
    
    const coverImage = this.data.coverImage || this.data.image || '/images/default-cover.jpg'
    const category = this.data.category || 'عام'
    const tags = this.data.tags || []
    
    card.innerHTML = `
      <div class="h-40 bg-surface-container relative overflow-hidden flex items-center justify-center">
        <img class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300" src="${coverImage}" alt="${this.data.title}" loading="lazy"/>
        <div class="absolute top-sm right-sm bg-primary/90 text-on-primary font-label-md text-xs px-sm py-xs rounded-full backdrop-blur-sm">${category}</div>
      </div>
      <div class="p-lg flex-1 flex flex-col gap-sm">
        <a href="/article/${this.data.slug || this.data.id}" class="font-headline-md text-body-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">${this.data.title}</a>
        <p class="font-body-md text-sm text-on-surface-variant line-clamp-2 flex-1">${this.data.excerpt || ''}</p>
        <div class="flex items-center gap-xs mt-auto pt-sm border-t border-outline-variant/30">
          ${tags.slice(0, 2).map(tag => `
            <span class="bg-surface-container-high text-on-surface-variant text-xs px-sm py-xs rounded">${tag}</span>
          `).join('')}
        </div>
      </div>
    `

    return card
  }
}