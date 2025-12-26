import React, { useState } from 'react'
import { RotateCcw, Search, Calendar, Plus, Receipt, X } from 'lucide-react'
import { usePOS } from '../POS'
import '../POS.css'

const ReturnsRefunds = () => {
  const { returns, sales, addReturn } = usePOS()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [returnForm, setReturnForm] = useState({
    saleId: '',
    reason: '',
    items: [],
    refundAmount: '',
    refundMethod: 'cash'
  })
  const [selectedSale, setSelectedSale] = useState(null)

  const filteredReturns = returns.filter(ret => {
    const matchesSearch = ret.saleId?.toString().includes(searchTerm) ||
                         ret.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !filterDate || ret.date.startsWith(filterDate)
    return matchesSearch && matchesDate
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSelectSale = (saleId) => {
    const sale = sales.find(s => s.id.toString() === saleId)
    if (sale) {
      setSelectedSale(sale)
      setReturnForm({
        ...returnForm,
        saleId: saleId,
        items: sale.items.map(item => ({ ...item, returnQty: 0 })),
        refundAmount: sale.total.toFixed(2)
      })
    }
  }

  const updateReturnQuantity = (itemId, qty) => {
    const updatedItems = returnForm.items.map(item => 
      item.productId === itemId 
        ? { ...item, returnQty: Math.max(0, Math.min(qty, item.quantity)) }
        : item
    )
    
    // Calculate refund amount
    const totalRefund = updatedItems.reduce((sum, item) => {
      if (item.returnQty > 0) {
        return sum + (item.price * item.returnQty)
      }
      return sum
    }, 0)
    const tax = totalRefund * 0.18
    
    setReturnForm({
      ...returnForm,
      items: updatedItems,
      refundAmount: (totalRefund + tax).toFixed(2)
    })
  }

  const handleProcessReturn = () => {
    if (!returnForm.saleId) {
      alert('Please select a sale')
      return
    }

    const returnItems = returnForm.items.filter(item => item.returnQty > 0)
    if (returnItems.length === 0) {
      alert('Please select items to return')
      return
    }

    addReturn({
      saleId: parseInt(returnForm.saleId),
      reason: returnForm.reason,
      items: returnItems,
      refundAmount: parseFloat(returnForm.refundAmount),
      refundMethod: returnForm.refundMethod
    })

    setShowAddModal(false)
    setReturnForm({
      saleId: '',
      reason: '',
      items: [],
      refundAmount: '',
      refundMethod: 'cash'
    })
    setSelectedSale(null)
    alert('Return processed successfully!')
  }

  return (
    <div className="pos-container">
      <div className="page-header">
        <h2>Returns & Refunds</h2>
        <div className="header-actions">
          <button className="action-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Process Return
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Returns</div>
          <div className="stat-value">{filteredReturns.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Refunded</div>
          <div className="stat-value">
            ₹{filteredReturns.reduce((sum, r) => sum + r.refundAmount, 0).toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Refund</div>
          <div className="stat-value">
            ₹{filteredReturns.length > 0 
              ? (filteredReturns.reduce((sum, r) => sum + r.refundAmount, 0) / filteredReturns.length).toFixed(2)
              : '0.00'}
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by sale ID or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="date-filter">
          <Calendar size={20} />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        {filteredReturns.length === 0 ? (
          <div className="empty-state">
            <RotateCcw size={48} />
            <p>No returns found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Date & Time</th>
                <th>Sale ID</th>
                <th>Reason</th>
                <th>Items Returned</th>
                <th>Refund Amount</th>
                <th>Refund Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map(ret => (
                <tr key={ret.id}>
                  <td>#{ret.id}</td>
                  <td>{formatDate(ret.date)}</td>
                  <td>#{ret.saleId}</td>
                  <td>{ret.reason || 'N/A'}</td>
                  <td>{ret.items.length} item(s)</td>
                  <td className="amount-cell">₹{ret.refundAmount.toFixed(2)}</td>
                  <td>
                    <span className={`payment-badge ${ret.refundMethod}`}>
                      {ret.refundMethod.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge completed">{ret.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content return-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Process Return</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Sale ID *</label>
                <div className="sale-selector">
                  <input
                    type="text"
                    placeholder="Enter sale ID"
                    value={returnForm.saleId}
                    onChange={(e) => handleSelectSale(e.target.value)}
                  />
                  {selectedSale && (
                    <div className="sale-info">
                      <p>Sale #{selectedSale.id} - {selectedSale.customerName}</p>
                      <p>Total: ₹{selectedSale.total.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedSale && (
                <>
                  <div className="form-group">
                    <label>Select Items to Return</label>
                    <div className="return-items-list">
                      {returnForm.items.map((item, idx) => (
                        <div key={idx} className="return-item">
                          <div className="return-item-info">
                            <span>{item.name}</span>
                            <span>₹{item.price.toFixed(2)} × {item.quantity}</span>
                          </div>
                          <div className="return-item-controls">
                            <button onClick={() => updateReturnQuantity(item.productId, item.returnQty - 1)}>
                              -
                            </button>
                            <span>{item.returnQty || 0}</span>
                            <button onClick={() => updateReturnQuantity(item.productId, item.returnQty + 1)}>
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Reason for Return</label>
                    <select
                      value={returnForm.reason}
                      onChange={(e) => setReturnForm({...returnForm, reason: e.target.value})}
                    >
                      <option value="">Select reason</option>
                      <option value="defective">Defective Product</option>
                      <option value="wrong_item">Wrong Item</option>
                      <option value="customer_request">Customer Request</option>
                      <option value="damaged">Damaged in Transit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Refund Amount</label>
                    <input
                      type="text"
                      value={`₹${returnForm.refundAmount}`}
                      disabled
                      className="disabled-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Refund Method</label>
                    <div className="payment-methods">
                      <button
                        className={`payment-method-btn ${returnForm.refundMethod === 'cash' ? 'active' : ''}`}
                        onClick={() => setReturnForm({...returnForm, refundMethod: 'cash'})}
                      >
                        Cash
                      </button>
                      <button
                        className={`payment-method-btn ${returnForm.refundMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setReturnForm({...returnForm, refundMethod: 'card'})}
                      >
                        Card
                      </button>
                      <button
                        className={`payment-method-btn ${returnForm.refundMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setReturnForm({...returnForm, refundMethod: 'upi'})}
                      >
                        UPI
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleProcessReturn} disabled={!selectedSale}>
                Process Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReturnsRefunds

