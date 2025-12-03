import React, { useState, useMemo } from 'react'
import { FileText, Download, Search, Calendar, Users, Truck, Wallet, CreditCard, Percent, Eye, X, Printer } from 'lucide-react'
import { usePOS } from '../POS'
import '../POS.css'

const Reports = () => {
  const { sales, payments, entities } = usePOS()
  const [selectedEntityType, setSelectedEntityType] = useState('') // 'Customer', 'Supplier', or '' for all
  const [selectedEntityId, setSelectedEntityId] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedEntities, setExpandedEntities] = useState(new Set())
  const [selectedEntityDetails, setSelectedEntityDetails] = useState(null)

  // Filter entities based on type
  const filteredEntities = useMemo(() => {
    let filtered = entities
    if (selectedEntityType) {
      filtered = filtered.filter(e => e.type === selectedEntityType)
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(searchLower) ||
        e.gstin?.toLowerCase().includes(searchLower) ||
        e.address?.toLowerCase().includes(searchLower)
      )
    }
    return filtered
  }, [entities, selectedEntityType, searchTerm])

  // Calculate entity reports
  const entityReports = useMemo(() => {
    return filteredEntities.map(entity => {
      // Get all bills for this entity
      const entityBills = sales.filter(sale => 
        sale.entityId?.toString() === entity.id.toString() &&
        (!dateRange.start || sale.date >= dateRange.start) &&
        (!dateRange.end || sale.date <= dateRange.end)
      ).sort((a, b) => new Date(a.date) - new Date(b.date))

      // Get all payments for this entity
      const entityPayments = payments.filter(payment =>
        payment.entityId?.toString() === entity.id.toString() &&
        (!dateRange.start || payment.date >= dateRange.start) &&
        (!dateRange.end || payment.date <= dateRange.end)
      ).sort((a, b) => new Date(a.date) - new Date(b.date))

      // Combine bills and payments and sort by date
      const transactions = [
        ...entityBills.map(bill => ({
          type: 'bill',
          id: bill.id,
          date: bill.date,
          invoiceNumber: bill.invoiceNumber || `#${bill.id}`,
          invoiceType: bill.invoiceType || 'cash',
          amount: bill.total || 0,
          paid: bill.amountPaid || 0,
          balance: bill.balance || 0,
          paymentMethod: bill.paymentMethod || 'cash',
          items: bill.items || []
        })),
        ...entityPayments.map(payment => ({
          type: 'payment',
          id: payment.id,
          date: payment.date,
          invoiceNumber: payment.invoiceNumber || '',
          invoiceType: payment.paymentType || 'payment',
          amount: payment.amount || 0,
          paid: payment.amount || 0,
          balance: 0,
          paymentMethod: payment.paymentMethod || 'cash',
          notes: payment.notes || ''
        }))
      ].sort((a, b) => new Date(a.date) - new Date(b.date))

      // Calculate running balance
      let runningBalance = 0
      const transactionsWithBalance = transactions.map(transaction => {
        if (transaction.type === 'bill') {
          // For bills: add outstanding amount to balance
          // Customer: positive balance means receivable (they owe us)
          // Supplier: negative balance means payable (we owe them)
          const outstanding = transaction.balance || (transaction.amount - transaction.paid)
          if (entity.type === 'Customer') {
            runningBalance += outstanding
          } else {
            runningBalance -= outstanding
          }
        } else {
          // For payments: reduce the balance
          // Customer payment: reduces receivable (negative)
          // Supplier payment: reduces payable (positive)
          if (entity.type === 'Customer') {
            runningBalance -= transaction.amount
          } else {
            runningBalance += transaction.amount
          }
        }
        return { ...transaction, runningBalance: parseFloat(runningBalance.toFixed(2)) }
      })

      // Calculate totals
      const totalBills = entityBills.reduce((sum, bill) => sum + (bill.total || 0), 0)
      const totalPaid = entityBills.reduce((sum, bill) => sum + (bill.amountPaid || 0), 0)
      const totalPayments = entityPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
      const finalBalance = transactionsWithBalance.length > 0 
        ? transactionsWithBalance[transactionsWithBalance.length - 1].runningBalance 
        : 0

      return {
        entity,
        bills: entityBills,
        payments: entityPayments,
        transactions: transactionsWithBalance,
        totalBills,
        totalPaid,
        totalPayments,
        finalBalance
      }
    })
  }, [filteredEntities, sales, payments, dateRange])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleEntityExpansion = (entityId) => {
    const newExpanded = new Set(expandedEntities)
    if (newExpanded.has(entityId)) {
      newExpanded.delete(entityId)
    } else {
      newExpanded.add(entityId)
    }
    setExpandedEntities(newExpanded)
  }

  const getInvoiceTypeIcon = (type) => {
    switch (type) {
      case 'cash': return <Wallet size={14} />
      case 'credit': return <CreditCard size={14} />
      case 'partial': return <Percent size={14} />
      default: return null
    }
  }

  const getInvoiceTypeBadge = (type) => {
    const baseClass = 'invoice-type-badge-report'
    switch (type) {
      case 'cash': return `${baseClass} cash`
      case 'credit': return `${baseClass} credit`
      case 'partial': return `${baseClass} partial`
      default: return `${baseClass} cash`
    }
  }

  const exportEntityReport = (report) => {
    const reportData = {
      entity: report.entity.name,
      type: report.entity.type,
      period: `${dateRange.start || 'All'} to ${dateRange.end || 'All'}`,
      transactions: report.transactions,
      summary: {
        totalBills: report.totalBills,
        totalPaid: report.totalPaid,
        totalPayments: report.totalPayments,
        finalBalance: report.finalBalance
      }
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.entity.name}_Report_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="pos-container">
      <div className="page-header">
        <h2>Customer/Supplier Reports</h2>
        <div className="header-actions">
          <button className="action-btn" onClick={() => window.print()}>
            <Printer size={18} />
            Print Report
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, GSTIN, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={selectedEntityType}
          onChange={(e) => setSelectedEntityType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Customer">Customers</option>
          <option value="Supplier">Suppliers</option>
        </select>
        <div className="date-range-filter">
          <Calendar size={20} />
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            placeholder="Start Date"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            placeholder="End Date"
          />
        </div>
      </div>

      <div className="reports-summary">
        <div className="summary-card">
          <div className="summary-label">Total Entities</div>
          <div className="summary-value">{filteredEntities.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Bills</div>
          <div className="summary-value">{entityReports.reduce((sum, r) => sum + r.bills.length, 0)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Payments</div>
          <div className="summary-value">{entityReports.reduce((sum, r) => sum + r.payments.length, 0)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Outstanding</div>
          <div className="summary-value">
            ₹{entityReports.reduce((sum, r) => sum + Math.abs(r.finalBalance), 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="entity-reports-list">
        {entityReports.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <p>No entities found</p>
          </div>
        ) : (
          entityReports.map((report) => (
            <div key={report.entity.id} className="entity-report-card">
              <div className="entity-report-header" onClick={() => toggleEntityExpansion(report.entity.id)}>
                <div className="entity-report-title">
                  {report.entity.type === 'Supplier' ? <Truck size={20} /> : <Users size={20} />}
                  <div>
                    <h3>{report.entity.name}</h3>
                    <p className="entity-subtitle">
                      {report.entity.gstin && `GSTIN: ${report.entity.gstin} • `}
                      {report.entity.address && `${report.entity.address}`}
                    </p>
                  </div>
                </div>
                <div className="entity-report-summary">
                  <div className="summary-item">
                    <span>Bills:</span>
                    <strong>{report.bills.length}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Total:</span>
                    <strong>₹{report.totalBills.toFixed(2)}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Paid:</span>
                    <strong>₹{report.totalPaid.toFixed(2)}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Payments:</span>
                    <strong>{report.payments.length}</strong>
                  </div>
                  <div className="summary-item balance-item">
                    <span>Final Balance:</span>
                    <strong className={report.finalBalance >= 0 ? 'balance-positive' : 'balance-negative'}>
                      ₹{Math.abs(report.finalBalance).toFixed(2)}
                      {report.entity.type === 'Customer' 
                        ? (report.finalBalance >= 0 ? ' (Receivable)' : ' (Advance)')
                        : (report.finalBalance >= 0 ? ' (Payable)' : ' (Advance)')
                      }
                    </strong>
                  </div>
                </div>
                <button className="expand-btn">
                  {expandedEntities.has(report.entity.id) ? '▼' : '▶'}
                </button>
              </div>

              {expandedEntities.has(report.entity.id) && (
                <div className="entity-report-details">
                  <div className="transactions-table-container">
                    <table className="transactions-table">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Type</th>
                          <th>Invoice No.</th>
                          <th>Invoice Type</th>
                          <th>Amount</th>
                          <th>Paid</th>
                          <th>Balance</th>
                          <th>Running Balance</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.transactions.map((transaction, idx) => (
                          <tr key={`${transaction.type}-${transaction.id}`} className={transaction.type === 'payment' ? 'payment-row' : ''}>
                            <td>{formatDateTime(transaction.date)}</td>
                            <td>
                              <span className={`transaction-type-badge ${transaction.type}`}>
                                {transaction.type === 'bill' ? 'BILL' : 'PAYMENT'}
                              </span>
                            </td>
                            <td>
                              {transaction.invoiceNumber && (
                                <strong className="invoice-number">{transaction.invoiceNumber}</strong>
                              )}
                            </td>
                            <td>
                              {transaction.type === 'bill' && (
                                <span className={getInvoiceTypeBadge(transaction.invoiceType)}>
                                  {getInvoiceTypeIcon(transaction.invoiceType)}
                                  {transaction.invoiceType.toUpperCase()}
                                </span>
                              )}
                              {transaction.type === 'payment' && (
                                <span className="payment-method-badge">
                                  {transaction.paymentMethod?.toUpperCase() || 'PAYMENT'}
                                </span>
                              )}
                            </td>
                            <td className="amount-cell">
                              {transaction.type === 'bill' ? `₹${transaction.amount.toFixed(2)}` : '-'}
                            </td>
                            <td className="amount-cell">
                              {transaction.type === 'bill' ? `₹${transaction.paid.toFixed(2)}` : `₹${transaction.amount.toFixed(2)}`}
                            </td>
                            <td className="amount-cell">
                              {transaction.type === 'bill' ? `₹${transaction.balance.toFixed(2)}` : '-'}
                            </td>
                            <td className={`amount-cell running-balance ${transaction.runningBalance >= 0 ? 'positive' : 'negative'}`}>
                              ₹{Math.abs(transaction.runningBalance).toFixed(2)}
                            </td>
                            <td>
                              {transaction.type === 'bill' && (
                                <button
                                  className="icon-btn-small"
                                  onClick={() => setSelectedEntityDetails(transaction)}
                                  title="View Details"
                                >
                                  <Eye size={14} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="totals-row">
                          <td colSpan="4"><strong>Totals:</strong></td>
                          <td className="amount-cell"><strong>₹{report.totalBills.toFixed(2)}</strong></td>
                          <td className="amount-cell"><strong>₹{(report.totalPaid + report.totalPayments).toFixed(2)}</strong></td>
                          <td className="amount-cell"><strong>₹{(report.totalBills - report.totalPaid).toFixed(2)}</strong></td>
                          <td className={`amount-cell final-balance ${report.finalBalance >= 0 ? 'positive' : 'negative'}`}>
                            <strong>₹{Math.abs(report.finalBalance).toFixed(2)}</strong>
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="entity-report-actions">
                    <button className="action-btn-small" onClick={() => exportEntityReport(report)}>
                      <Download size={16} />
                      Export Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedEntityDetails && (
        <div className="modal-overlay" onClick={() => setSelectedEntityDetails(null)}>
          <div className="modal-content sale-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice Details - {selectedEntityDetails.invoiceNumber}</h3>
              <button className="close-btn" onClick={() => setSelectedEntityDetails(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Invoice Information</h4>
                <p><strong>Invoice Number:</strong> {selectedEntityDetails.invoiceNumber}</p>
                <p><strong>Date:</strong> {formatDateTime(selectedEntityDetails.date)}</p>
                <p><strong>Invoice Type:</strong> 
                  <span className={getInvoiceTypeBadge(selectedEntityDetails.invoiceType)}>
                    {getInvoiceTypeIcon(selectedEntityDetails.invoiceType)}
                    {selectedEntityDetails.invoiceType.toUpperCase()}
                  </span>
                </p>
                <p><strong>Payment Method:</strong> {selectedEntityDetails.paymentMethod?.toUpperCase() || 'N/A'}</p>
              </div>
              <div className="detail-section">
                <h4>Items</h4>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEntityDetails.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>₹{item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="detail-section">
                <div className="summary-row">
                  <span>Amount:</span>
                  <span>₹{selectedEntityDetails.amount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Paid:</span>
                  <span>₹{selectedEntityDetails.paid.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Balance:</span>
                  <span className="balance-amount">₹{selectedEntityDetails.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setSelectedEntityDetails(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports

