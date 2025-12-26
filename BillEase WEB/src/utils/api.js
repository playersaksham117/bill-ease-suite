// API utility functions for making HTTP requests to the backend
// Optimized with caching, request queuing, and error handling

import { cachedFetch, invalidateCache } from './cache.js'
import { requestQueue, retryRequest } from './requestOptimizer.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Cache TTLs (in milliseconds)
const CACHE_TTL = {
  SHORT: 1 * 60 * 1000,      // 1 minute for frequently changing data
  MEDIUM: 5 * 60 * 1000,     // 5 minutes for moderately changing data
  LONG: 15 * 60 * 1000,      // 15 minutes for rarely changing data
  VERY_LONG: 60 * 60 * 1000  // 1 hour for static data
}

// Handle fetch errors gracefully without spamming console
const handleFetchError = (error, url) => {
  // Only log non-connection errors to avoid console spam
  if (error.name !== 'TypeError' || !error.message.includes('Failed to fetch')) {
    console.error(`API Error for ${url}:`, error)
  }
  // Return empty array/object based on expected return type
  return []
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || 'Request failed')
  }
  return response.json()
}

// Optimized fetch wrapper with caching, queuing, and retry logic
const safeFetch = async (url, options = {}, cacheTTL = null) => {
  try {
    // Use cached fetch for GET requests
    if ((!options.method || options.method === 'GET') && cacheTTL !== false) {
      return await cachedFetch(url, options, cacheTTL || CACHE_TTL.MEDIUM)
    }

    // For non-GET requests, use request queue and retry logic
    return await requestQueue.add(async () => {
      return await retryRequest(async () => {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          return await handleResponse(response)
        } catch (error) {
          clearTimeout(timeoutId)
          throw error
        }
      })
    })
  } catch (error) {
    // Handle network errors gracefully
    if (error.name === 'TypeError' && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      return []
    }
    if (error.name === 'AbortError') {
      return []
    }
    return []
  }
}

// Invento API
export const inventoAPI = {
  // Warehouses
  getWarehouses: () => safeFetch(`${API_BASE_URL}/invento/warehouses`, {}, CACHE_TTL.MEDIUM).catch(() => []),
  createWarehouse: (data) => {
    invalidateCache('/invento/warehouses')
    return safeFetch(`${API_BASE_URL}/invento/warehouses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, false).catch(() => null)
  },
  deleteWarehouse: (id) => {
    invalidateCache('/invento/warehouses')
    return safeFetch(`${API_BASE_URL}/invento/warehouses/${id}`, {
      method: 'DELETE'
    }, false).catch(() => null)
  },

  // Items
  getItems: () => safeFetch(`${API_BASE_URL}/invento/items`, {}, CACHE_TTL.SHORT).catch(() => []),
  getItem: (id) => safeFetch(`${API_BASE_URL}/invento/items/${id}`, {}, CACHE_TTL.MEDIUM).catch(() => null),
  createItem: (data) => {
    invalidateCache('/invento/items')
    return safeFetch(`${API_BASE_URL}/invento/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, false).catch(() => null)
  },
  updateItem: (id, data) => {
    invalidateCache('/invento/items')
    return safeFetch(`${API_BASE_URL}/invento/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, false).catch(() => null)
  },
  deleteItem: (id) => {
    invalidateCache('/invento/items')
    return safeFetch(`${API_BASE_URL}/invento/items/${id}`, {
      method: 'DELETE'
    }, false).catch(() => null)
  },

  // Transactions
  getTransactions: (type) => {
    const url = type ? `${API_BASE_URL}/invento/transactions?type=${type}` : `${API_BASE_URL}/invento/transactions`
    return safeFetch(url, {}, CACHE_TTL.SHORT).catch(() => [])
  },
  createTransaction: (data) => {
    invalidateCache('/invento/transactions')
    invalidateCache('/invento/alerts')
    return safeFetch(`${API_BASE_URL}/invento/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, false).catch(() => null)
  },

  // Alerts
  getAlerts: () => safeFetch(`${API_BASE_URL}/invento/alerts`, {}, CACHE_TTL.SHORT).catch(() => [])
}

// Income/Expense API
export const incomeExpenseAPI = {
  // Transactions
  getTransactions: (type) => {
    const url = type ? `${API_BASE_URL}/income-expense/transactions?type=${type}` : `${API_BASE_URL}/income-expense/transactions`
    return safeFetch(url).catch(() => [])
  },
  getTransaction: (id) => safeFetch(`${API_BASE_URL}/income-expense/transactions/${id}`).catch(() => null),
  createTransaction: (data) => safeFetch(`${API_BASE_URL}/income-expense/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),
  updateTransaction: (id, data) => safeFetch(`${API_BASE_URL}/income-expense/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),
  deleteTransaction: (id) => safeFetch(`${API_BASE_URL}/income-expense/transactions/${id}`, {
    method: 'DELETE'
  }).catch(() => null),

  // Categories
  getIncomeCategories: () => safeFetch(`${API_BASE_URL}/income-expense/categories/income`).catch(() => []),
  createIncomeCategory: (name) => safeFetch(`${API_BASE_URL}/income-expense/categories/income`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }).catch(() => null),
  deleteIncomeCategory: (name) => safeFetch(`${API_BASE_URL}/income-expense/categories/income/${encodeURIComponent(name)}`, {
    method: 'DELETE'
  }).catch(() => null),

  getExpenseCategories: () => safeFetch(`${API_BASE_URL}/income-expense/categories/expense`).catch(() => []),
  createExpenseCategory: (name) => safeFetch(`${API_BASE_URL}/income-expense/categories/expense`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }).catch(() => null),
  deleteExpenseCategory: (name) => safeFetch(`${API_BASE_URL}/income-expense/categories/expense/${encodeURIComponent(name)}`, {
    method: 'DELETE'
  }).catch(() => null),

  // Budgets
  getBudgets: (mode) => {
    const url = mode ? `${API_BASE_URL}/income-expense/budgets?mode=${mode}` : `${API_BASE_URL}/income-expense/budgets`
    return safeFetch(url).catch(() => [])
  },
  createBudget: (data) => safeFetch(`${API_BASE_URL}/income-expense/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),

  // Recurring Transactions
  getRecurringTransactions: (mode) => {
    const url = mode ? `${API_BASE_URL}/income-expense/recurring?mode=${mode}` : `${API_BASE_URL}/income-expense/recurring`
    return safeFetch(url).catch(() => [])
  },
  createRecurringTransaction: (data) => safeFetch(`${API_BASE_URL}/income-expense/recurring`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),

  // Family Members
  getFamilyMembers: () => safeFetch(`${API_BASE_URL}/income-expense/family-members`).catch(() => []),
  createFamilyMember: (data) => safeFetch(`${API_BASE_URL}/income-expense/family-members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),

  // Summary
  getSummary: () => safeFetch(`${API_BASE_URL}/income-expense/summary`).catch(() => null)
}

// POS API
export const posAPI = {
  // Products
  getProducts: () => fetch(`${API_BASE_URL}/pos/products`).then(handleResponse),
  createProduct: (data) => fetch(`${API_BASE_URL}/pos/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateProduct: (id, data) => fetch(`${API_BASE_URL}/pos/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteProduct: (id) => fetch(`${API_BASE_URL}/pos/products/${id}`, {
    method: 'DELETE'
  }).then(handleResponse),

  // Entities
  getEntities: (type) => {
    const url = type ? `${API_BASE_URL}/pos/entities?type=${type}` : `${API_BASE_URL}/pos/entities`
    return fetch(url).then(handleResponse)
  },
  createEntity: (data) => fetch(`${API_BASE_URL}/pos/entities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateEntity: (id, data) => fetch(`${API_BASE_URL}/pos/entities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteEntity: (id) => fetch(`${API_BASE_URL}/pos/entities/${id}`, {
    method: 'DELETE'
  }).then(handleResponse),

  // Sales
  getSales: () => fetch(`${API_BASE_URL}/pos/sales`).then(handleResponse),
  createSale: (data) => fetch(`${API_BASE_URL}/pos/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Payments
  getPayments: () => fetch(`${API_BASE_URL}/pos/payments`).then(handleResponse),
  createPayment: (data) => fetch(`${API_BASE_URL}/pos/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Quotations
  getQuotations: () => fetch(`${API_BASE_URL}/pos/quotations`).then(handleResponse),
  createQuotation: (data) => fetch(`${API_BASE_URL}/pos/quotations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse)
}

// CRM API
export const crmAPI = {
  // Customers
  getCustomers: () => safeFetch(`${API_BASE_URL}/crm/customers`).catch(() => []),
  getCustomer: (id) => safeFetch(`${API_BASE_URL}/crm/customers/${id}`).catch(() => null),
  createCustomer: (data) => safeFetch(`${API_BASE_URL}/crm/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),
  updateCustomer: (id, data) => safeFetch(`${API_BASE_URL}/crm/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),
  deleteCustomer: (id) => safeFetch(`${API_BASE_URL}/crm/customers/${id}`, {
    method: 'DELETE'
  }).catch(() => null),

  // Leads
  getLeads: (status) => {
    const url = status ? `${API_BASE_URL}/crm/leads?status=${status}` : `${API_BASE_URL}/crm/leads`
    return safeFetch(url).catch(() => [])
  },
  getLead: (id) => safeFetch(`${API_BASE_URL}/crm/leads/${id}`).catch(() => null),
  createLead: (data) => safeFetch(`${API_BASE_URL}/crm/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),
  updateLead: (id, data) => safeFetch(`${API_BASE_URL}/crm/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),
  deleteLead: (id) => safeFetch(`${API_BASE_URL}/crm/leads/${id}`, {
    method: 'DELETE'
  }).catch(() => null),

  // Activities
  getActivities: (customerId, leadId) => {
    let url = `${API_BASE_URL}/crm/activities`
    const params = []
    if (customerId) params.push(`customer_id=${customerId}`)
    if (leadId) params.push(`lead_id=${leadId}`)
    if (params.length > 0) url += '?' + params.join('&')
    return safeFetch(url).catch(() => [])
  },
  createActivity: (data) => safeFetch(`${API_BASE_URL}/crm/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),
  updateActivity: (id, data) => safeFetch(`${API_BASE_URL}/crm/activities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),
  deleteActivity: (id) => safeFetch(`${API_BASE_URL}/crm/activities/${id}`, {
    method: 'DELETE'
  }).catch(() => null),

  // Communications
  getCommunications: (customerId, leadId) => {
    let url = `${API_BASE_URL}/crm/communications`
    const params = []
    if (customerId) params.push(`customer_id=${customerId}`)
    if (leadId) params.push(`lead_id=${leadId}`)
    if (params.length > 0) url += '?' + params.join('&')
    return safeFetch(url).catch(() => [])
  },
  createCommunication: (data) => safeFetch(`${API_BASE_URL}/crm/communications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => null),
  deleteCommunication: (id) => safeFetch(`${API_BASE_URL}/crm/communications/${id}`, {
    method: 'DELETE'
  }).catch(() => null),

  // Analytics
  getAnalytics: () => safeFetch(`${API_BASE_URL}/crm/analytics`).catch(() => null)
}

// AccountsPlus API
export const accountsPlusAPI = {
  // Companies
  getCompanies: () => fetch(`${API_BASE_URL}/accounts-plus/companies`).then(handleResponse),
  createCompany: (data) => fetch(`${API_BASE_URL}/accounts-plus/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateCompany: (id, data) => fetch(`${API_BASE_URL}/accounts-plus/companies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Ledgers
  getLedgers: () => fetch(`${API_BASE_URL}/accounts-plus/ledgers`).then(handleResponse),
  createLedger: (data) => fetch(`${API_BASE_URL}/accounts-plus/ledgers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateLedger: (id, data) => fetch(`${API_BASE_URL}/accounts-plus/ledgers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteLedger: (id) => fetch(`${API_BASE_URL}/accounts-plus/ledgers/${id}`, {
    method: 'DELETE'
  }).then(handleResponse),

  // Parties
  getParties: (type) => {
    const url = type ? `${API_BASE_URL}/accounts-plus/parties?type=${type}` : `${API_BASE_URL}/accounts-plus/parties`
    return fetch(url).then(handleResponse)
  },
  createParty: (data) => fetch(`${API_BASE_URL}/accounts-plus/parties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateParty: (id, data) => fetch(`${API_BASE_URL}/accounts-plus/parties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteParty: (id) => fetch(`${API_BASE_URL}/accounts-plus/parties/${id}`, {
    method: 'DELETE'
  }).then(handleResponse),

  // Items
  getItems: () => fetch(`${API_BASE_URL}/accounts-plus/items`).then(handleResponse),
  createItem: (data) => fetch(`${API_BASE_URL}/accounts-plus/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateItem: (id, data) => fetch(`${API_BASE_URL}/accounts-plus/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteItem: (id) => fetch(`${API_BASE_URL}/accounts-plus/items/${id}`, {
    method: 'DELETE'
  }).then(handleResponse),

  // Expense Heads
  getExpenseHeads: () => fetch(`${API_BASE_URL}/accounts-plus/expense-heads`).then(handleResponse),
  createExpenseHead: (data) => fetch(`${API_BASE_URL}/accounts-plus/expense-heads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Income Heads
  getIncomeHeads: () => fetch(`${API_BASE_URL}/accounts-plus/income-heads`).then(handleResponse),
  createIncomeHead: (data) => fetch(`${API_BASE_URL}/accounts-plus/income-heads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Employees
  getEmployees: () => fetch(`${API_BASE_URL}/accounts-plus/employees`).then(handleResponse),
  createEmployee: (data) => fetch(`${API_BASE_URL}/accounts-plus/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateEmployee: (id, data) => fetch(`${API_BASE_URL}/accounts-plus/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteEmployee: (id) => fetch(`${API_BASE_URL}/accounts-plus/employees/${id}`, {
    method: 'DELETE'
  }).then(handleResponse)
}

