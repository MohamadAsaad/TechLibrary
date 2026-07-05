export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date)) return dateString
  
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function truncateText(text, maxLength = 150) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function getReadingTime(content, wordsPerMinute = 200) {
  if (!content) return 0
  const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ')
  const words = text.split(' ').length
  const minutes = Math.ceil(words / wordsPerMinute)
  return Math.max(1, minutes)
}

export function debounce(fn, delay = 300) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

export function throttle(fn, limit = 300) {
  let lastCall = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastCall >= limit) {
      lastCall = now
      fn.apply(this, args)
    }
  }
}

export function generateSlug(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-\u0600-\u06FF]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function shareOn(platform, url, title = '') {
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offscreen/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  }

  const shareUrl = shareUrls[platform]
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    try {
      textarea.select()
      document.execCommand('copy')
      resolve()
    } catch (err) {
      reject(err)
    } finally {
      document.body.removeChild(textarea)
    }
  })
}

export function getUrlParams(url = window.location.href) {
  const params = {}
  const urlObj = new URL(url)
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

export function buildUrl(path, params = {}) {
  const url = new URL(path, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value)
    }
  })
  return url.toString()
}

export function isMobile() {
  return window.innerWidth < 768
}

export function isRTL() {
  return document.dir === 'rtl' || document.documentElement.dir === 'rtl'
}

export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase()
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getColorFromString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = ['#2563eb', '#7c3aed', '#dc2626', '#059669', '#d97706', '#4f46e5']
  return colors[Math.abs(hash) % colors.length]
}