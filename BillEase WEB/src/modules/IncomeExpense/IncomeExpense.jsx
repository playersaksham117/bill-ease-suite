import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Plus, TrendingUp, TrendingDown, Filter, Calendar, Edit, Trash2, Download, PieChart, FileText, X, Save, User, Users, Building2, Settings, Repeat, Target, BarChart3, Wallet, CreditCard, Banknote, Clock, Tag } from 'lucide-react'
import { incomeExpenseAPI } from '../../utils/api'
import './IncomeExpense.css'

const IncomeExpense = () => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('income_expense_mode')
    return saved || 'individual' // 'individual', 'family', 'business'
  })
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState({ income: [], expense: [] })
  const [budgets, setBudgets] = useState([])
  const [recurringTransactions, setRecurringTransactions] = useState([])
  const [familyMembers, setFamilyMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [showModeModal, setShowModeModal] = useState(false)
  const [formData, setFormData] = useState({ 
    type: 'income', 
    description: '', 
    amount: '', 
    date: new Date().toISOString().split('T')[0], 
    category: '', 
    notes: '',
    member_id: null,
    payment_method: 'cash',
    tags: []
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categoryForm, setCategoryForm] = useState({ type: 'income', name: '', icon: '' })
  const [budgetForm, setBudgetForm] = useState({ category: '', amount: '', period: 'monthly' })
  const [recurringForm, setRecurringForm] = useState({ 
    type: 'expense', 
    description: '', 
    amount: '', 
    category: '', 
    frequency: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    notes: ''
  })
  const [memberForm, setMemberForm] = useState({ name: '', email: '', role: 'member' })
  const [filter, setFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [modalType, setModalType] = useState('add')
  const [selectedMember, setSelectedMember] = useState(null)

  useEffect(() => {
    loadData()
  }, [mode])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [transactionsData, incomeCats, expenseCats, budgetsData, recurringData, membersData] = await Promise.all([
        incomeExpenseAPI.getTransactions().catch(() => []),
        incomeExpenseAPI.getIncomeCategories().catch(() => []),
        incomeExpenseAPI.getExpenseCategories().catch(() => []),
        incomeExpenseAPI.getBudgets(mode).catch(() => []),
        incomeExpenseAPI.getRecurringTransactions(mode).catch(() => []),
        mode === 'family' ? incomeExpenseAPI.getFamilyMembers().catch(() => []) : Promise.resolve([])
      ])
      
      setTransactions(transactionsData)
      setCategories({ income: incomeCats, expense: expenseCats })
      setBudgets(budgetsData)
      setRecurringTransactions(recurringData)
      if (mode === 'family') {
        setFamilyMembers(membersData)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    localStorage.setItem('income_expense_mode', newMode)
    setShowModeModal(false)
    loadData()
  }

  const validateTransactionForm = () => {
    const errors = {}
    
    if (!formData.description || formData.description.trim() === '') {
      errors.description = 'Description is required'
    }
    
    if (!formData.amount || formData.amount === '') {
      errors.amount = 'Amount is required'
    } else {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        errors.amount = 'Amount must be a positive number'
      }
    }
    
    if (!formData.category || formData.category === '') {
      errors.category = 'Category is required'
    }
    
    if (!formData.date || formData.date === '') {
      errors.date = 'Date is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent double submission
    if (isSubmitting) return
    
    // Validate form
    if (!validateTransactionForm()) {
      return
    }
    
    setIsSubmitting(true)
    setFormErrors({})
    
    try {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount')
      }
      
      const transactionData = {
        type: formData.type,
        description: formData.description.trim(),
        amount: amount,
        date: formData.date,
        category: formData.category,
        notes: (formData.notes || '').trim(),
        mode,
        member_id: formData.member_id || null,
        payment_method: formData.payment_method || 'cash',
        tags: formData.tags || []
      }
      
      if (modalType === 'add') {
        await incomeExpenseAPI.createTransaction(transactionData)
      } else {
        if (!selectedTransaction || !selectedTransaction.id) {
          throw new Error('Invalid transaction selected')
        }
        await incomeExpenseAPI.updateTransaction(selectedTransaction.id, transactionData)
      }
      
      await loadData()
      setShowModal(false)
      resetForm()
    } catch (err) {
      const errorMessage = err.message || 'Error saving transaction'
      setFormErrors({ submit: errorMessage })
      // Keep modal open on error so user can fix issues
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction)
    setFormData({
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount.toString(),
      date: transaction.date,
      category: transaction.category,
      notes: transaction.notes || '',
      member_id: transaction.member_id || null,
      payment_method: transaction.payment_method || 'cash',
      tags: transaction.tags || []
    })
    setModalType('edit')
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await incomeExpenseAPI.deleteTransaction(id)
        await loadData()
      } catch (err) {
        alert('Error deleting transaction: ' + err.message)
      }
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!categoryForm.name || categoryForm.name.trim() === '') {
      alert('Category name is required')
      return
    }
    
    try {
      const categoryName = categoryForm.name.trim()
      if (categoryForm.type === 'income') {
        await incomeExpenseAPI.createIncomeCategory(categoryName)
      } else {
        await incomeExpenseAPI.createExpenseCategory(categoryName)
      }
      await loadData()
      setShowCategoryModal(false)
      setCategoryForm({ type: 'income', name: '', icon: '' })
    } catch (err) {
      alert('Error adding category: ' + (err.message || 'Unknown error'))
    }
  }

  const handleDeleteCategory = async (type, categoryName) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      try {
        if (type === 'income') {
          await incomeExpenseAPI.deleteIncomeCategory(categoryName)
        } else {
          await incomeExpenseAPI.deleteExpenseCategory(categoryName)
        }
        await loadData()
      } catch (err) {
        alert('Error deleting category: ' + err.message)
      }
    }
  }

  const handleAddBudget = async (e) => {
    e.preventDefault()
    try {
      await incomeExpenseAPI.createBudget({ ...budgetForm, mode, amount: parseFloat(budgetForm.amount) })
      await loadData()
      setShowBudgetModal(false)
      setBudgetForm({ category: '', amount: '', period: 'monthly' })
    } catch (err) {
      alert('Error adding budget: ' + err.message)
    }
  }

  const handleAddRecurring = async (e) => {
    e.preventDefault()
    try {
      await incomeExpenseAPI.createRecurringTransaction({ ...recurringForm, mode, amount: parseFloat(recurringForm.amount) })
      await loadData()
      setShowRecurringModal(false)
      setRecurringForm({ 
        type: 'expense', 
        description: '', 
        amount: '', 
        category: '', 
        frequency: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        notes: ''
      })
    } catch (err) {
      alert('Error adding recurring transaction: ' + err.message)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    try {
      await incomeExpenseAPI.createFamilyMember(memberForm)
      await loadData()
      setShowMemberModal(false)
      setMemberForm({ name: '', email: '', role: 'member' })
    } catch (err) {
      alert('Error adding member: ' + err.message)
    }
  }

  const resetForm = () => {
    setFormData({ 
      type: 'income', 
      description: '', 
      amount: '', 
      date: new Date().toISOString().split('T')[0], 
      category: '', 
      notes: '',
      member_id: null,
      payment_method: 'cash',
      tags: []
    })
    setFormErrors({})
    setIsSubmitting(false)
    setSelectedTransaction(null)
    setModalType('add')
  }

  const exportReport = () => {
    const reportData = filteredTransactions.map(t => ({
      Date: t.date,
      Type: t.type === 'income' ? 'Income' : 'Expense',
      Description: t.description,
      Category: t.category,
      Amount: t.amount,
      PaymentMethod: t.payment_method || 'cash',
      Member: mode === 'family' && t.member_id ? (familyMembers.find(m => m.id === t.member_id)?.name || 'N/A') : 'N/A',
      Notes: t.notes || ''
    }))
    
    const csv = [
      Object.keys(reportData[0]).join(','),
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `income_expense_report_${mode}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getCategoryTotals = () => {
    const incomeByCategory = {}
    const expenseByCategory = {}
    
    filteredTransactions.forEach(t => {
      if (t.type === 'income') {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount
      } else {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount
      }
    })
    
    return { incomeByCategory, expenseByCategory }
  }

  const getFilteredTransactions = () => {
    let filtered = transactions
    
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter)
    }
    
    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(t => t.date === today.toISOString().split('T')[0])
          break
        case 'week':
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          filtered = filtered.filter(t => new Date(t.date) >= weekAgo)
          break
        case 'month':
          filtered = filtered.filter(t => {
            const tDate = new Date(t.date)
            return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear()
          })
          break
        case 'year':
          filtered = filtered.filter(t => {
            const tDate = new Date(t.date)
            return tDate.getFullYear() === now.getFullYear()
          })
          break
        default:
          break
      }
    }
    
    if (selectedMember) {
      filtered = filtered.filter(t => t.member_id === selectedMember.id)
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const filteredTransactions = getFilteredTransactions()

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const getBudgetStatus = () => {
    const status = {}
    budgets.forEach(budget => {
      const spent = filteredTransactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0)
      status[budget.category] = {
        budget: budget.amount,
        spent,
        remaining: budget.amount - spent,
        percentage: (spent / budget.amount) * 100
      }
    })
    return status
  }

  const OverviewView = () => {
    if (loading) {
      return (
        <div className="income-expense-container">
          <div className="loading-state">Loading transactions...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="income-expense-container">
          <div className="error-state">Error: {error}. Please make sure the backend server is running.</div>
        </div>
      )
    }

    const budgetStatus = getBudgetStatus()

    return (
      <div className="income-expense-container">
        <div className="mode-selector-bar">
          <div className="mode-buttons">
            <button 
              className={`mode-btn ${mode === 'individual' ? 'active' : ''}`}
              onClick={() => setShowModeModal(true)}
            >
              <User size={18} />
              {mode === 'individual' ? 'Individual' : mode === 'family' ? 'Family' : 'Business'}
            </button>
            <button className="settings-btn" onClick={() => setShowModeModal(true)}>
              <Settings size={18} />
            </button>
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card income">
            <div className="card-icon">
              <TrendingUp size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Total Income</p>
              <p className="card-value">₹{totalIncome.toLocaleString()}</p>
            </div>
          </div>
          <div className="summary-card expense">
            <div className="card-icon">
              <TrendingDown size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Total Expense</p>
              <p className="card-value">₹{totalExpense.toLocaleString()}</p>
            </div>
          </div>
          <div className="summary-card balance">
            <div className="card-icon">
              <Wallet size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Balance</p>
              <p className={`card-value ${balance >= 0 ? 'positive' : 'negative'}`}>
                ₹{balance.toLocaleString()}
              </p>
            </div>
          </div>
          {mode === 'family' && (
            <div className="summary-card members">
              <div className="card-icon">
                <Users size={24} />
              </div>
              <div className="card-content">
                <p className="card-label">Family Members</p>
                <p className="card-value">{familyMembers.length}</p>
              </div>
            </div>
          )}
        </div>

        {budgets.length > 0 && (
          <div className="budgets-section">
            <div className="section-header">
              <h3>Budget Status</h3>
              <button className="add-btn small" onClick={() => setShowBudgetModal(true)}>
                <Plus size={16} />
                Add Budget
              </button>
            </div>
            <div className="budgets-grid">
              {budgets.map(budget => {
                const status = budgetStatus[budget.category]
                return (
                  <div key={budget.id} className="budget-card">
                    <div className="budget-header">
                      <span className="budget-category">{budget.category}</span>
                      <span className="budget-period">{budget.period}</span>
                    </div>
                    <div className="budget-progress">
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${status.percentage > 100 ? 'over' : ''}`}
                          style={{ width: `${Math.min(status.percentage, 100)}%` }}
                        />
                      </div>
                      <div className="budget-amounts">
                        <span>₹{status.spent.toLocaleString()} / ₹{status.budget.toLocaleString()}</span>
                        <span className={status.remaining < 0 ? 'negative' : ''}>
                          ₹{Math.abs(status.remaining).toLocaleString()} {status.remaining < 0 ? 'over' : 'left'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="transactions-section">
          <div className="section-header">
            <div className="filter-group">
              <div className="filter-tabs">
                <button 
                  className={filter === 'all' ? 'active' : ''}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={filter === 'income' ? 'active' : ''}
                  onClick={() => setFilter('income')}
                >
                  Income
                </button>
                <button 
                  className={filter === 'expense' ? 'active' : ''}
                  onClick={() => setFilter('expense')}
                >
                  Expense
                </button>
              </div>
              <select 
                className="date-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              {mode === 'family' && (
                <select 
                  className="member-filter"
                  value={selectedMember?.id || 'all'}
                  onChange={(e) => {
                    if (e.target.value === 'all') {
                      setSelectedMember(null)
                    } else {
                      setSelectedMember(familyMembers.find(m => m.id === parseInt(e.target.value)))
                    }
                  }}
                >
                  <option value="all">All Members</option>
                  {familyMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="action-buttons">
              <button className="add-btn" onClick={() => { resetForm(); setShowModal(true) }}>
                <Plus size={20} />
                Add Transaction
              </button>
              {mode === 'family' && (
                <button className="add-btn secondary" onClick={() => setShowMemberModal(true)}>
                  <Users size={20} />
                  Add Member
                </button>
              )}
              <button className="add-btn secondary" onClick={() => setShowBudgetModal(true)}>
                <Target size={20} />
                Budget
              </button>
              <button className="add-btn secondary" onClick={() => setShowRecurringModal(true)}>
                <Repeat size={20} />
                Recurring
              </button>
            </div>
          </div>

          <div className="transactions-list">
            {filteredTransactions.length === 0 ? (
              <div className="empty-state">
                <p>No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map(transaction => (
                <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-icon">
                    {transaction.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div className="transaction-details">
                    <h4>{transaction.description}</h4>
                    <p className="transaction-meta">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                      {transaction.payment_method && ` • ${transaction.payment_method}`}
                      {mode === 'family' && transaction.member_id && (
                        <> • {familyMembers.find(m => m.id === transaction.member_id)?.name || 'Unknown'}</>
                      )}
                    </p>
                  </div>
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </div>
                  <div className="transaction-actions">
                    <button className="icon-btn" onClick={() => handleEdit(transaction)}>
                      <Edit size={16} />
                    </button>
                    <button className="icon-btn danger" onClick={() => handleDelete(transaction.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm() }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-content">
                <h3>{modalType === 'add' ? 'Add Transaction' : 'Edit Transaction'}</h3>
                <button className="close-btn" onClick={() => { setShowModal(false); resetForm() }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="transaction-type-select">Type *</label>
                  <select
                    id="transaction-type-select"
                    name="transaction-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              <div className="form-group">
                <label htmlFor="transaction-description-input">Description *</label>
                <input
                  id="transaction-description-input"
                  name="transaction-description"
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value })
                    if (formErrors.description) {
                      setFormErrors({ ...formErrors, description: null })
                    }
                  }}
                  className={formErrors.description ? 'error' : ''}
                />
                {formErrors.description && (
                  <span className="error-message">{formErrors.description}</span>
                )}
              </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="transaction-amount-input">Amount *</label>
                    <input
                      id="transaction-amount-input"
                      name="transaction-amount"
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => {
                        setFormData({ ...formData, amount: e.target.value })
                        if (formErrors.amount) {
                          setFormErrors({ ...formErrors, amount: null })
                        }
                      }}
                      className={formErrors.amount ? 'error' : ''}
                    />
                    {formErrors.amount && (
                      <span className="error-message">{formErrors.amount}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="transaction-date-input">Date *</label>
                    <input
                      id="transaction-date-input"
                      name="transaction-date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="transaction-category-select">Category *</label>
                    <select
                      id="transaction-category-select"
                      name="transaction-category"
                      required
                      value={formData.category}
                      onChange={(e) => {
                        setFormData({ ...formData, category: e.target.value })
                        if (formErrors.category) {
                          setFormErrors({ ...formErrors, category: null })
                        }
                      }}
                      className={formErrors.category ? 'error' : ''}
                    >
                      <option value="">Select category</option>
                      {categories[formData.type].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <span className="error-message">{formErrors.category}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="payment-method-select">Payment Method</label>
                    <select
                      id="payment-method-select"
                      name="payment-method"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                {mode === 'family' && (
                  <div className="form-group">
                    <label htmlFor="member-select">Family Member</label>
                    <select
                      id="member-select"
                      name="member"
                      value={formData.member_id || ''}
                      onChange={(e) => setFormData({ ...formData, member_id: e.target.value ? parseInt(e.target.value) : null })}
                    >
                      <option value="">Select member</option>
                      {familyMembers.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="transaction-notes-textarea">Notes</label>
                  <textarea
                    id="transaction-notes-textarea"
                    name="transaction-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="3"
                  />
                </div>
                {formErrors.submit && (
                  <div className="form-error-banner">
                    {formErrors.submit}
                  </div>
                )}
                <div className="form-actions">
                  <button type="button" onClick={() => { setShowModal(false); resetForm() }} disabled={isSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (modalType === 'add' ? 'Add' : 'Update')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModeModal && (
          <div className="modal-overlay" onClick={() => setShowModeModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-content">
                <h3>Select Mode</h3>
                <button className="close-btn" onClick={() => setShowModeModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="mode-selection">
                <div className="mode-option" onClick={() => handleModeChange('individual')}>
                  <User size={32} />
                  <h4>Individual</h4>
                  <p>Personal finance management</p>
                </div>
                <div className="mode-option" onClick={() => handleModeChange('family')}>
                  <Users size={32} />
                  <h4>Family</h4>
                  <p>Track expenses for multiple family members</p>
                </div>
                <div className="mode-option" onClick={() => handleModeChange('business')}>
                  <Building2 size={32} />
                  <h4>Business</h4>
                  <p>Business income and expense tracking</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCategoryModal && (
          <div className="modal-overlay" onClick={() => { setShowCategoryModal(false); setCategoryForm({ type: 'income', name: '', icon: '' }) }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-content">
                <h3>Add Category</h3>
                <button className="close-btn" onClick={() => { setShowCategoryModal(false); setCategoryForm({ type: 'income', name: '', icon: '' }) }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddCategory}>
                <div className="form-group">
                  <label htmlFor="category-type-select">Type *</label>
                  <select
                    id="category-type-select"
                    name="category-type"
                    value={categoryForm.type}
                    onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value })}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="category-name-input">Category Name *</label>
                  <input
                    id="category-name-input"
                    name="category-name"
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => { setShowCategoryModal(false); setCategoryForm({ type: 'income', name: '', icon: '' }) }}>Cancel</button>
                  <button type="submit">Add Category</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showBudgetModal && (
          <div className="modal-overlay" onClick={() => { setShowBudgetModal(false); setBudgetForm({ category: '', amount: '', period: 'monthly' }) }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-content">
                <h3>Add Budget</h3>
                <button className="close-btn" onClick={() => { setShowBudgetModal(false); setBudgetForm({ category: '', amount: '', period: 'monthly' }) }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddBudget}>
                <div className="form-group">
                  <label htmlFor="budget-category-select">Category *</label>
                  <select
                    id="budget-category-select"
                    name="budget-category"
                    required
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {categories.expense.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="budget-amount-input">Amount *</label>
                    <input
                      id="budget-amount-input"
                      name="budget-amount"
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="budget-period-select">Period *</label>
                    <select
                      id="budget-period-select"
                      name="budget-period"
                      required
                      value={budgetForm.period}
                      onChange={(e) => setBudgetForm({ ...budgetForm, period: e.target.value })}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => { setShowBudgetModal(false); setBudgetForm({ category: '', amount: '', period: 'monthly' }) }}>Cancel</button>
                  <button type="submit">Add Budget</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showRecurringModal && (
          <div className="modal-overlay" onClick={() => setShowRecurringModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-content">
                <h3>Add Recurring Transaction</h3>
                <button className="close-btn" onClick={() => setShowRecurringModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddRecurring}>
                <div className="form-group">
                  <label htmlFor="recurring-type-select">Type *</label>
                  <select
                    id="recurring-type-select"
                    name="recurring-type"
                    value={recurringForm.type}
                    onChange={(e) => setRecurringForm({ ...recurringForm, type: e.target.value, category: '' })}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="recurring-description-input">Description *</label>
                  <input
                    id="recurring-description-input"
                    name="recurring-description"
                    type="text"
                    required
                    value={recurringForm.description}
                    onChange={(e) => setRecurringForm({ ...recurringForm, description: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="recurring-amount-input">Amount *</label>
                    <input
                      id="recurring-amount-input"
                      name="recurring-amount"
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={recurringForm.amount}
                      onChange={(e) => setRecurringForm({ ...recurringForm, amount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="recurring-frequency-select">Frequency *</label>
                    <select
                      id="recurring-frequency-select"
                      name="recurring-frequency"
                      required
                      value={recurringForm.frequency}
                      onChange={(e) => setRecurringForm({ ...recurringForm, frequency: e.target.value })}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="recurring-category-select">Category *</label>
                  <select
                    id="recurring-category-select"
                    name="recurring-category"
                    required
                    value={recurringForm.category}
                    onChange={(e) => setRecurringForm({ ...recurringForm, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {categories[recurringForm.type].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="recurring-start-date-input">Start Date *</label>
                    <input
                      id="recurring-start-date-input"
                      name="recurring-start-date"
                      type="date"
                      required
                      value={recurringForm.start_date}
                      onChange={(e) => setRecurringForm({ ...recurringForm, start_date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="recurring-end-date-input">End Date (Optional)</label>
                    <input
                      id="recurring-end-date-input"
                      name="recurring-end-date"
                      type="date"
                      value={recurringForm.end_date}
                      onChange={(e) => setRecurringForm({ ...recurringForm, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="recurring-notes-textarea">Notes</label>
                  <textarea
                    id="recurring-notes-textarea"
                    name="recurring-notes"
                    value={recurringForm.notes}
                    onChange={(e) => setRecurringForm({ ...recurringForm, notes: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowRecurringModal(false)}>Cancel</button>
                  <button type="submit">Add Recurring Transaction</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showMemberModal && mode === 'family' && (
          <div className="modal-overlay" onClick={() => { setShowMemberModal(false); setMemberForm({ name: '', email: '', role: 'member' }) }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-content">
                <h3>Add Family Member</h3>
                <button className="close-btn" onClick={() => { setShowMemberModal(false); setMemberForm({ name: '', email: '', role: 'member' }) }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddMember}>
                <div className="form-group">
                  <label htmlFor="member-name-input">Name *</label>
                  <input
                    id="member-name-input"
                    name="member-name"
                    type="text"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="member-email-input">Email</label>
                  <input
                    id="member-email-input"
                    name="member-email"
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="member-role-select">Role</label>
                  <select
                    id="member-role-select"
                    name="member-role"
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => { setShowMemberModal(false); setMemberForm({ name: '', email: '', role: 'member' }) }}>Cancel</button>
                  <button type="submit">Add Member</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  const IncomeView = () => (
    <div className="income-expense-container">
      <div className="section-header">
        <h2>Income Transactions</h2>
        <button className="add-btn" onClick={() => { setFormData({ ...formData, type: 'income' }); setModalType('add'); setShowModal(true) }}>
          <Plus size={20} />
          Add Income
        </button>
      </div>
      <div className="transactions-list">
        {transactions.filter(t => t.type === 'income').map(transaction => (
          <div key={transaction.id} className="transaction-item income">
            <div className="transaction-icon">
              <TrendingUp size={20} />
            </div>
            <div className="transaction-details">
              <h4>{transaction.description}</h4>
              <p className="transaction-meta">
                {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <div className="transaction-amount income">
              +₹{transaction.amount.toLocaleString()}
            </div>
            <div className="transaction-actions">
              <button className="icon-btn" onClick={() => handleEdit(transaction)}>
                <Edit size={16} />
              </button>
              <button className="icon-btn danger" onClick={() => handleDelete(transaction.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const ExpenseView = () => (
    <div className="income-expense-container">
      <div className="section-header">
        <h2>Expense Transactions</h2>
        <button className="add-btn" onClick={() => { setFormData({ ...formData, type: 'expense' }); setModalType('add'); setShowModal(true) }}>
          <Plus size={20} />
          Add Expense
        </button>
      </div>
      <div className="transactions-list">
        {transactions.filter(t => t.type === 'expense').map(transaction => (
          <div key={transaction.id} className="transaction-item expense">
            <div className="transaction-icon">
              <TrendingDown size={20} />
            </div>
            <div className="transaction-details">
              <h4>{transaction.description}</h4>
              <p className="transaction-meta">
                {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <div className="transaction-amount expense">
              -₹{transaction.amount.toLocaleString()}
            </div>
            <div className="transaction-actions">
              <button className="icon-btn" onClick={() => handleEdit(transaction)}>
                <Edit size={16} />
              </button>
              <button className="icon-btn danger" onClick={() => handleDelete(transaction.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const CategoriesView = () => {
    const { incomeByCategory, expenseByCategory } = getCategoryTotals()
    
    return (
      <div className="income-expense-container">
        <div className="section-header">
          <h2>Categories</h2>
          <button className="add-btn" onClick={() => setShowCategoryModal(true)}>
            <Plus size={20} />
            Add Category
          </button>
        </div>
        <div className="categories-section">
          <div className="category-group">
            <h3>Income Categories</h3>
            <div className="categories-list">
              {categories.income.map(cat => (
                <div key={cat} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{cat}</span>
                    <span className="category-total">₹{(incomeByCategory[cat] || 0).toLocaleString()}</span>
                  </div>
                  <button className="icon-btn danger" onClick={() => handleDeleteCategory('income', cat)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="category-group">
            <h3>Expense Categories</h3>
            <div className="categories-list">
              {categories.expense.map(cat => (
                <div key={cat} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{cat}</span>
                    <span className="category-total">₹{(expenseByCategory[cat] || 0).toLocaleString()}</span>
                  </div>
                  <button className="icon-btn danger" onClick={() => handleDeleteCategory('expense', cat)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showCategoryModal && (
          <div className="modal-overlay" onClick={() => { setShowCategoryModal(false); setCategoryForm({ type: 'income', name: '', icon: '' }) }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-content">
                <h3>Add Category</h3>
                <button className="close-btn" onClick={() => { setShowCategoryModal(false); setCategoryForm({ type: 'income', name: '', icon: '' }) }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddCategory}>
                <div className="form-group">
                  <label htmlFor="category-type-select">Type *</label>
                  <select
                    id="category-type-select"
                    name="category-type"
                    value={categoryForm.type}
                    onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value })}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="category-name-input">Category Name *</label>
                  <input
                    id="category-name-input"
                    name="category-name"
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => { setShowCategoryModal(false); setCategoryForm({ type: 'income', name: '', icon: '' }) }}>Cancel</button>
                  <button type="submit">Add Category</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  const ReportsView = () => {
    const { incomeByCategory, expenseByCategory } = getCategoryTotals()
    
    return (
      <div className="income-expense-container">
        <div className="section-header">
          <h2>Reports & Analytics</h2>
          <button className="add-btn" onClick={exportReport}>
            <Download size={20} />
            Export Report
          </button>
        </div>
        <div className="reports-section">
          <div className="report-card">
            <h3>Summary</h3>
            <div className="report-stats">
              <div className="stat-item">
                <span className="stat-label">Total Income</span>
                <span className="stat-value">₹{totalIncome.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Expense</span>
                <span className="stat-value">₹{totalExpense.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Net Balance</span>
                <span className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
                  ₹{balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="report-card">
            <h3>Income by Category</h3>
            <div className="category-breakdown">
              {categories.income.map(cat => (
                <div key={cat} className="breakdown-item">
                  <span>{cat}</span>
                  <span>₹{(incomeByCategory[cat] || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="report-card">
            <h3>Expense by Category</h3>
            <div className="category-breakdown">
              {categories.expense.map(cat => (
                <div key={cat} className="breakdown-item">
                  <span>{cat}</span>
                  <span>₹{(expenseByCategory[cat] || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<OverviewView />} />
      <Route path="/income" element={<IncomeView />} />
      <Route path="/expense" element={<ExpenseView />} />
      <Route path="/categories" element={<CategoriesView />} />
      <Route path="/reports" element={<ReportsView />} />
    </Routes>
  )
}

export default IncomeExpense
