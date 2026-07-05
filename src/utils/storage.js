// src/utils/storage.js

// Theme functions
export function getTheme() {
  return localStorage.getItem('techlibrary-theme') || 'light'
}

export function setTheme(theme) {
  localStorage.setItem('techlibrary-theme', theme)
}

// تصدير saveTheme كاسم مستعار لـ setTheme
export function saveTheme(theme) {
  setTheme(theme)
}

export function toggleTheme() {
  const current = getTheme()
  const newTheme = current === 'dark' ? 'light' : 'dark'
  setTheme(newTheme)
  applyTheme(newTheme)
  return newTheme
}

export function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function initTheme() {
  const theme = getTheme()
  applyTheme(theme)
  return theme
}

// Bookmark functions
export function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem('techlibrary-bookmarks') || '[]')
  } catch {
    return []
  }
}

export function setBookmarks(bookmarks) {
  localStorage.setItem('techlibrary-bookmarks', JSON.stringify(bookmarks))
}

export function toggleBookmark(id) {
  const bookmarks = getBookmarks()
  const index = bookmarks.indexOf(id)
  if (index > -1) {
    bookmarks.splice(index, 1)
  } else {
    bookmarks.push(id)
  }
  setBookmarks(bookmarks)
  return bookmarks
}

export function isBookmarked(id) {
  return getBookmarks().includes(id)
}

// Reading History
export function getReadingHistory() {
  try {
    return JSON.parse(localStorage.getItem('techlibrary-history') || '[]')
  } catch {
    return []
  }
}

export function setReadingHistory(history) {
  localStorage.setItem('techlibrary-history', JSON.stringify(history))
}

export function addToReadingHistory(id) {
  let history = getReadingHistory()
  history = history.filter(item => item !== id)
  history.unshift(id)
  if (history.length > 50) {
    history = history.slice(0, 50)
  }
  setReadingHistory(history)
  return history
}

// Last Search
export function getLastSearch() {
  return localStorage.getItem('techlibrary-last-search') || ''
}

export function setLastSearch(query) {
  localStorage.setItem('techlibrary-last-search', query)
}

// Favorites
export function getFavoriteArticles() {
  try {
    return JSON.parse(localStorage.getItem('techlibrary-favorites') || '[]')
  } catch {
    return []
  }
}

export function setFavoriteArticles(favorites) {
  localStorage.setItem('techlibrary-favorites', JSON.stringify(favorites))
}

export function toggleFavorite(id) {
  const favorites = getFavoriteArticles()
  const index = favorites.indexOf(id)
  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(id)
  }
  setFavoriteArticles(favorites)
  return favorites
}

export function isFavorite(id) {
  return getFavoriteArticles().includes(id)
}

// Clear all
export function clearAllStorage() {
  localStorage.removeItem('techlibrary-theme')
  localStorage.removeItem('techlibrary-bookmarks')
  localStorage.removeItem('techlibrary-history')
  localStorage.removeItem('techlibrary-last-search')
  localStorage.removeItem('techlibrary-favorites')
}