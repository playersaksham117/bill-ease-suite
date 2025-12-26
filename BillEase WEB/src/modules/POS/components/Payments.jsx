import React, { useState } from 'react'
import { CreditCard, Search, Calendar, Plus, Users, Truck, X } from 'lucide-react'
import { usePOS } from '../POS'
import ToastContainer from './ToastContainer'
import '../POS.css'

const Payments = () => {
  const { payments, sales, entities, addPayment } = usePOS()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [toasts, setToasts] = useState([])
  const [paymentForm, setPaymentForm] = useState({
    entityType: 'Customer',
    entityId: '',
    saleId: '',
    amount: '',
    paymentMethod: 'cash',
    reference: '',
    notes: ''
  })

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts([...toasts, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id))
  }

  const filteredEntities = entities.filter(e => e.type === paymentForm.entityType)
  const selectedEntity = entities.find(e => e.id.toString() === paymentForm.entityId)

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.saleId?.toString().includes(searchTerm)
    const matchesDate = !filterDate || payment.date.startsWith(filterDate)
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

  const getTotalByMethod = (method) => {
    return filteredPayments
      .filter(p => p.paymentMethod === method)
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const handleAddPayment = () => {
    // Mandatory validation: Customer/Supplier must be selected
    if (!paymentForm.entityId) {
      showToast(`Please select a ${paymentForm.entityType} to continue`, 'error')
      return
    }

    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      showToast('Please enter a valid amount', 'error')
      return
    }

    addPayment({
      entityType: paymentForm.entityType,
      entityId: paymentForm.entityId,
      entityName: selectedEntity?.name || '',
      saleId: paymentForm.saleId || null,
      amount: parseFloat(paymentForm.amount),
      paymentMethod: paymentForm.paymentMethod,
      reference: paymentForm.reference,
      notes: paymentForm.notes
    })

    setShowAddModal(false)
    setPaymentForm({
      entityType: 'Customer',
      entityId: '',
      saleId: '',
      amount: '',
      paymentMethod: 'cash',
      reference: '',
      notes: ''
    })
    showToast('Payment recorded successfully!', 'success')
  }

  return (
    <div className="pos-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="page-header">
        <h2>Payments</h2>
        <div className="header-actions">
          <button className="action-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Payment
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Payments</div>
          <div className="stat-value">₹{filteredPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cash Payments</div>
          <div className="stat-value">₹{getTotalByMethod('cash').toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Card Payments</div>
          <div className="stat-value">₹{getTotalByMethod('card').toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">UPI Payments</div>
          <div className="stat-value">₹{getTotalByMethod('upi').toFixed(2)}</div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by reference or sale ID..."
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
        {filteredPayments.length === 0 ? (
          <div className="empty-state">
            <CreditCard size={48} />
            <p>No payments found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Date & Time</th>
                <th>Customer/Supplier</th>
                <th>Sale ID</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment.id}>
                  <td>#{payment.id}</td>
                  <td>{formatDate(payment.date)}</td>
                  <td>
                    {payment.entityName || 'N/A'}
                    {payment.entityType && (
                      <span className={`entity-type-badge ${payment.entityType.toLowerCase()}`} style={{ marginLeft: '0.5rem' }}>
                        {payment.entityType === 'Supplier' ? <Truck size={12} /> : <Users size={12} />}
                        {payment.entityType}
                      </span>
                    )}
                  </td>
                  <td>{payment.saleId ? `#${payment.saleId}` : 'N/A'}</td>
                  <td className="amount-cell">₹{payment.amount.toFixed(2)}</td>
                  <td>
                    <span className={`payment-badge ${payment.paymentMethod}`}>
                      {payment.paymentMethod.toUpperCase()}
                    </span>
                  </td>
                  <td>{payment.reference || 'N/A'}</td>
                  <td>
                    <span className="status-badge completed">{payment.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Payment</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Entity Type *</label>
                <div className="entity-type-selector">
                  <button
                    type="button"
                    className={`entity-type-btn ${paymentForm.entityType === 'Customer' ? 'active' : ''}`}
                    onClick={() => {
                      setPaymentForm({...paymentForm, entityType: 'Customer', entityId: ''})
                    }}
                  >
                    <Users size={18} />
                    Customer
                  </button>
                  <button
                    type="button"
                    className={`entity-type-btn ${paymentForm.entityType === 'Supplier' ? 'active' : ''}`}
                    onClick={() => {
                      setPaymentForm({...paymentForm, entityType: 'Supplier', entityId: ''})
                    }}
                  >
                    <Truck size={18} />
                    Supplier
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>{paymentForm.entityType} Name *</label>
                <select
                  value={paymentForm.entityId}
                  onChange={(e) => setPaymentForm({...paymentForm, entityId: e.target.value})}
                  className="entity-select"
                  required
                >
                  <option value="">Select {paymentForm.entityType} *</option>
                  {filteredEntities.map(entity => (
                    <option key={entity.id} value={entity.id}>
                      {entity.name} {entity.gstin ? `(${entity.gstin})` : ''}
                    </option>
                  ))}
                </select>
                {filteredEntities.length === 0 && (
                  <p className="form-hint" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    No {paymentForm.entityType.toLowerCase()}s found. Please add a {paymentForm.entityType.toLowerCase()} first.
                  </p>
                )}
                {selectedEntity && (
                  <div className="selected-entity-info" style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f3f4f6', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
                    <p><strong>Address:</strong> {selectedEntity.address || 'N/A'}</p>
                    {selectedEntity.gstin && <p><strong>GSTIN:</strong> {selectedEntity.gstin}</p>}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Sale ID (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter sale ID"
                  value={paymentForm.saleId}
                  onChange={(e) => setPaymentForm({...paymentForm, saleId: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-methods">
                  <button
                    className={`payment-method-btn ${paymentForm.paymentMethod === 'cash' ? 'active' : ''}`}
                    onClick={() => setPaymentForm({...paymentForm, paymentMethod: 'cash'})}
                  >
                    Cash
                  </button>
                  <button
                    className={`payment-method-btn ${paymentForm.paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentForm({...paymentForm, paymentMethod: 'card'})}
                  >
                    Card
                  </button>
                  <button
                    className={`payment-method-btn ${paymentForm.paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentForm({...paymentForm, paymentMethod: 'upi'})}
                  >
                    UPI
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Reference Number (Optional)</label>
                <input
                  type="text"
                  placeholder="Transaction reference"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({...paymentForm, reference: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  placeholder="Additional notes"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => {
                setShowAddModal(false)
                setPaymentForm({
                  entityType: 'Customer',
                  entityId: '',
                  saleId: '',
                  amount: '',
                  paymentMethod: 'cash',
                  reference: '',
                  notes: ''
                })
              }}>
                Cancel
              </button>
              <button 
                className="confirm-btn" 
                onClick={handleAddPayment}
                disabled={!paymentForm.entityId}
                title={!paymentForm.entityId ? `Please select a ${paymentForm.entityType} to continue` : 'Add Payment'}
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payments

