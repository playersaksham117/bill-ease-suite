// API Response Cache Utility
// Provides intelligent caching with TTL and invalidation support

class CacheManager {
  constructor() {
    this.cache = new Map()
    this.defaultTTL = 5 * 60 * 1000 // 5 minutes default
    this.maxSize = 100 // Maximum number of cached items
  }

  // Generate cache key from URL and params
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')
    return `${url}${sortedParams ? `?${sortedParams}` : ''}`
  }

  // Get cached value
  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  // Set cached value
  set(key, data, ttl = this.defaultTTL) {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now()
    })
  }

  // Invalidate cache by pattern
  invalidate(pattern) {
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  // Clear all cache
  clear() {
    this.cache.clear()
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Singleton instance
const cacheManager = new CacheManager()

// Cached fetch wrapper
export const cachedFetch = async (url, options = {}, ttl = null) => {
  // Only cache GET requests
  if (options.method && options.method !== 'GET') {
    return fetch(url, options).then(res => res.json()).catch(() => [])
  }

  const cacheKey = cacheManager.generateKey(url, options.params || {})
  const cached = cacheManager.get(cacheKey)

  if (cached !== null) {
    return Promise.resolve(cached)
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()

    // Cache successful responses
    if (response.ok) {
      cacheManager.set(cacheKey, data, ttl)
    }

    return data
  } catch (error) {
    // Return empty array on error to prevent crashes
    return []
  }
}

// Invalidate cache for specific endpoint
export const invalidateCache = (pattern) => {
  cacheManager.invalidate(pattern)
}

// Clear all cache
export const clearCache = () => {
  cacheManager.clear()
}

// Get cache statistics
export const getCacheStats = () => {
  return cacheManager.getStats()
}

export default cacheManager

