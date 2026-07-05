// src/services/DataService.js
export default class DataService {
  constructor() {
    this.posts = []
    this.downloads = []
    this.categories = []
    this.tags = []
    this.settings = {}
    this.isLoaded = false
  }

  async loadAll() {
    try {
      await Promise.all([
        this.loadPosts(),
        this.loadDownloads(),
        this.loadCategories(),
        this.loadTags(),
        this.loadSettings(),
      ])
      this.isLoaded = true
    } catch (error) {
      console.error('Failed to load data:', error)
      // Use fallback data even if loading fails
      this.useFallbackData()
    }
  }

  async loadPosts() {
    try {
      const response = await fetch('/src/data/posts.json')
      if (!response.ok) throw new Error('Failed to load posts')
      const defaultPosts = await response.json()
      this.mergeLocalPosts(defaultPosts)
    } catch (error) {
      console.warn('Using fallback posts data')
      this.mergeLocalPosts(this.getFallbackPosts())
    }
  }

  mergeLocalPosts(defaultPosts) {
    let localPosts = []
    try {
      localPosts = JSON.parse(localStorage.getItem('techlibrary-admin-posts') || '[]')
    } catch (e) {}
    
    const postMap = new Map()
    defaultPosts.forEach(p => postMap.set(p.id, p))
    localPosts.forEach(p => postMap.set(p.id, p))
    
    this.posts = Array.from(postMap.values()).filter(p => !p._deleted)
    this.posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async loadDownloads() {
    try {
      const response = await fetch('/src/data/downloads.json')
      if (!response.ok) throw new Error('Failed to load downloads')
      this.downloads = await response.json()
    } catch (error) {
      console.warn('Using fallback downloads data')
      this.downloads = []
    }
  }

  async loadCategories() {
    try {
      const response = await fetch('/src/data/categories.json')
      if (!response.ok) throw new Error('Failed to load categories')
      this.categories = await response.json()
      this.mergeLocalCategories()
    } catch (error) {
      console.warn('Using fallback categories data')
      this.categories = this.extractCategories()
      this.mergeLocalCategories()
    }
  }

  mergeLocalCategories() {
    let localCats = []
    try {
      localCats = JSON.parse(localStorage.getItem('techlibrary-admin-categories') || '[]')
    } catch (e) {}
    
    const catSet = new Set(this.categories)
    localCats.forEach(c => {
      if (c._deleted) catSet.delete(c.name)
      else catSet.add(c.name)
    })
    this.categories = Array.from(catSet)
  }

  async loadTags() {
    try {
      const response = await fetch('/src/data/tags.json')
      if (!response.ok) throw new Error('Failed to load tags')
      this.tags = await response.json()
    } catch (error) {
      console.warn('Using fallback tags data')
      this.tags = this.extractTags()
    }
  }

  async loadSettings() {
    try {
      const response = await fetch('/src/data/settings.json')
      if (!response.ok) throw new Error('Failed to load settings')
      this.settings = await response.json()
    } catch (error) {
      console.warn('Using fallback settings')
      this.settings = {
        siteName: 'TechLibrary',
        siteDescription: 'مكتبتك التقنية الشخصية والمعرفية',
        siteUrl: 'https://techlibrary.com',
        language: 'ar',
        direction: 'rtl',
      }
    }
  }

  useFallbackData() {
    if (this.posts.length === 0) {
      this.posts = this.getFallbackPosts()
    }
    if (this.categories.length === 0) {
      this.categories = this.extractCategories()
    }
    if (this.tags.length === 0) {
      this.tags = this.extractTags()
    }
  }

  extractCategories() {
    const categories = new Set()
    this.posts.forEach(post => {
      if (post.category) {
        categories.add(post.category)
      }
    })
    return Array.from(categories)
  }

  extractTags() {
    const tags = new Set()
    this.posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags)
  }

  getFallbackPosts() {
    return [
      {
        id: '1',
        slug: 'tailwind-css-guide',
        title: 'بناء واجهات مستخدم حديثة ومتجاوبة باستخدام Tailwind CSS',
        excerpt: 'دليل شامل لاستخدام Tailwind CSS في بناء واجهات مستخدم عصرية وسريعة التحميل مع أمثلة عملية.',
        content: `# بناء واجهات مستخدم حديثة باستخدام Tailwind CSS

## مقدمة
تعتبر Tailwind CSS من أشهر إطارات عمل CSS المعتمدة على الـ Utility-First...

## لماذا Tailwind CSS؟
النهج التقليدي في كتابة CSS يتطلب التبديل المستمر بين ملفات HTML و CSS...

## مثال على المكونات الأساسية
\`\`\`html
<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
  <div class="flex items-center gap-4">
    <img class="w-12 h-12 rounded-full" src="avatar.jpg" alt="User">
    <div>
      <h3 class="font-bold text-gray-900">سارة أحمد</h3>
      <p class="text-sm text-gray-500">مطور واجهات أمامية</p>
    </div>
  </div>
</div>
\`\`\`

## خلاصة
Tailwind CSS توفر طريقة سريعة وفعالة لبناء واجهات المستخدم.`,
        coverImage: 'https://picsum.photos/seed/tailwind/800/400',
        author: 'أحمد محمد',
        date: '2024-05-20',
        category: 'تطوير الويب',
        tags: ['tailwind', 'css', 'frontend'],
        views: 4520,
        featured: true,
        published: true,
      },
      {
        id: '2',
        slug: 'javascript-advanced-patterns',
        title: 'أنماط برمجية متقدمة في JavaScript',
        excerpt: 'استكشاف الأنماط البرمجية المتقدمة في JavaScript وكيفية تطبيقها في مشاريعك.',
        content: `# أنماط برمجية متقدمة في JavaScript

## مقدمة
الأنماط البرمجية هي حلول قابلة للتكرار لمشاكل شائعة في تصميم البرمجيات...`,
        coverImage: 'https://picsum.photos/seed/javascript/800/400',
        author: 'سارة أحمد',
        date: '2024-05-18',
        category: 'JavaScript',
        tags: ['javascript', 'patterns', 'advanced'],
        views: 3200,
        featured: true,
        published: true,
      },
      {
        id: '3',
        slug: 'react-hooks-deep-dive',
        title: 'فهم متقدم لميزات React Hooks',
        excerpt: 'شرح متعمق لميزات React Hooks وكيفية استخدامها بفعالية في تطبيقاتك.',
        content: `# فهم متقدم لميزات React Hooks

## مقدمة
React Hooks هي ميزة قوية تم تقديمها في React 16.8...`,
        coverImage: 'https://picsum.photos/seed/react/800/400',
        author: 'محمد علي',
        date: '2024-05-15',
        category: 'React',
        tags: ['react', 'hooks', 'frontend'],
        views: 2800,
        featured: false,
        published: true,
      },
    ]
  }

  // --- Admin CRUD Operations ---

  createPost(post) {
    post.id = Date.now().toString()
    post.date = new Date().toISOString().split('T')[0]
    post.views = 0
    this.saveLocalPost(post)
  }

  updatePost(id, updates) {
    const post = this.posts.find(p => p.id === id) || { id }
    Object.assign(post, updates)
    this.saveLocalPost(post)
  }

  deletePost(id) {
    this.saveLocalPost({ id, _deleted: true })
  }

  saveLocalPost(post) {
    let localPosts = []
    try {
      localPosts = JSON.parse(localStorage.getItem('techlibrary-admin-posts') || '[]')
    } catch (e) {}
    
    const index = localPosts.findIndex(p => p.id === post.id)
    if (index > -1) {
      localPosts[index] = post
    } else {
      localPosts.push(post)
    }
    localStorage.setItem('techlibrary-admin-posts', JSON.stringify(localPosts))
    
    // Update memory
    const memoryIndex = this.posts.findIndex(p => p.id === post.id)
    if (post._deleted) {
      if (memoryIndex > -1) this.posts.splice(memoryIndex, 1)
    } else {
      if (memoryIndex > -1) this.posts[memoryIndex] = post
      else this.posts.unshift(post)
    }
  }

  addCategory(name) {
    this.saveLocalCategory({ name })
  }

  deleteCategory(name) {
    this.saveLocalCategory({ name, _deleted: true })
  }

  saveLocalCategory(category) {
    let localCats = []
    try {
      localCats = JSON.parse(localStorage.getItem('techlibrary-admin-categories') || '[]')
    } catch (e) {}
    
    const index = localCats.findIndex(c => c.name === category.name)
    if (index > -1) {
      localCats[index] = category
    } else {
      localCats.push(category)
    }
    localStorage.setItem('techlibrary-admin-categories', JSON.stringify(localCats))
    this.mergeLocalCategories() // Refresh categories
  }
}