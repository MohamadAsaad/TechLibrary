export function updateSEO(data) {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    siteName = 'TechLibrary',
    twitterCard = 'summary_large_image',
    twitterSite = '@techlibrary',
    keywords = '',
    robots = 'index, follow',
    canonical,
  } = data

  // Title
  if (title) {
    document.title = `${title} - ${siteName}`
  }

  // Meta Description
  updateMetaTag('description', description)

  // Keywords
  updateMetaTag('keywords', keywords)

  // Robots
  updateMetaTag('robots', robots)

  // Canonical URL
  updateLinkTag('canonical', canonical || window.location.href)

  // Open Graph
  updateMetaTag('og:title', title)
  updateMetaTag('og:description', description)
  updateMetaTag('og:image', image)
  updateMetaTag('og:url', url || window.location.href)
  updateMetaTag('og:type', type)
  updateMetaTag('og:site_name', siteName)
  updateMetaTag('og:locale', 'ar_AR')

  // Twitter Cards
  updateMetaTag('twitter:card', twitterCard)
  updateMetaTag('twitter:site', twitterSite)
  updateMetaTag('twitter:title', title)
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:image', image)

  // Structured Data
  if (type === 'article') {
    updateStructuredData(generateArticleStructuredData(data))
  } else {
    updateStructuredData(generateWebsiteStructuredData(data))
  }
}

export function updateMetaTag(name, content) {
  if (!content) return
  let meta = document.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

export function updateLinkTag(rel, href) {
  if (!href) return
  let link = document.querySelector(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export function updateStructuredData(data) {
  let script = document.querySelector('#structured-data')
  if (!script) {
    script = document.createElement('script')
    script.id = 'structured-data'
    script.setAttribute('type', 'application/ld+json')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export function generateWebsiteStructuredData(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.siteName || 'TechLibrary',
    description: data.description || 'مكتبتك التقنية الشخصية',
    url: data.url || window.location.href,
    sameAs: data.sameAs || [],
  }
}

export function generateArticleStructuredData(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image,
    author: {
      '@type': 'Person',
      name: data.author || 'TechLibrary',
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    publisher: {
      '@type': 'Organization',
      name: data.siteName || 'TechLibrary',
      logo: {
        '@type': 'ImageObject',
        url: data.logo || 'https://techlibrary.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url || window.location.href,
    },
  }
}

export function generateSitemap(pages = []) {
  const baseUrl = 'https://techlibrary.com'
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>
  `).join('')}
</urlset>`
  return sitemap
}