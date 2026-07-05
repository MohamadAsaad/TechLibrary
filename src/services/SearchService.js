import Fuse from 'fuse.js'

export default class SearchService {
  constructor() {
    this.fuse = null
    this.items = []
    this.options = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'excerpt', weight: 0.2 },
        { name: 'content', weight: 0.2 },
        { name: 'category', weight: 0.1 },
        { name: 'tags', weight: 0.1 },
      ],
      threshold: 0.3,
      distance: 100,
      ignoreLocation: true,
      useExtendedSearch: true,
      includeScore: true,
      isCaseSensitive: false,
    }
  }

  init(items) {
    this.items = items
    this.fuse = new Fuse(items, this.options)
  }

  search(query) {
    if (!query || query.trim().length === 0) {
      return []
    }

    const results = this.fuse.search(query.trim())
    return results.map(result => result.item)
  }

  searchWithHighlights(query) {
    const results = this.search(query)
    return results.map(item => ({
      ...item,
      highlighted: this.highlightMatches(item, query),
    }))
  }

  highlightMatches(item, query) {
    const words = query.trim().split(/\s+/)
    let highlighted = item.title

    words.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi')
      highlighted = highlighted.replace(regex, '<mark>$1</mark>')
    })

    return highlighted
  }

  getSuggestions(query, limit = 5) {
    if (!query || query.trim().length === 0) {
      return []
    }

    const results = this.fuse.search(query.trim(), { limit })
    return results.map(result => ({
      title: result.item.title,
      slug: result.item.slug || result.item.id,
      score: result.score,
    }))
  }

  updateItems(items) {
    this.items = items
    this.fuse = new Fuse(items, this.options)
  }

  addItem(item) {
    this.items.push(item)
    this.fuse = new Fuse(this.items, this.options)
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id)
    this.fuse = new Fuse(this.items, this.options)
  }
}