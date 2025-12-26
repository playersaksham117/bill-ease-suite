// Request Optimization Utilities
// Provides debouncing, throttling, and request queuing

// Debounce function - delays execution until after wait time
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function - limits execution to once per wait time
export const throttle = (func, wait = 300) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), wait)
    }
  }
}

// Request queue for managing concurrent requests
class RequestQueue {
  constructor(maxConcurrent = 5) {
    this.queue = []
    this.running = 0
    this.maxConcurrent = maxConcurrent
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve,
        reject
      })
      this.process()
    })
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return
    }

    this.running++
    const { requestFn, resolve, reject } = this.queue.shift()

    try {
      const result = await requestFn()
      resolve(result)
    } catch (error) {
      reject(error)
    } finally {
      this.running--
      this.process()
    }
  }
}

// Singleton request queue
export const requestQueue = new RequestQueue(5)

// Batch requests together
export const batchRequests = async (requests, batchSize = 5) => {
  const results = []
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(req => req()))
    results.push(...batchResults)
  }
  return results
}

// Retry failed requests with exponential backoff
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
}

