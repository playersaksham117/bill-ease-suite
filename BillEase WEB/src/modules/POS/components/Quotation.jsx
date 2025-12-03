import React, { useState } from 'react'
import { FileText, Plus, Edit, Trash2, Search, Calendar, Download, Eye, X, Save, Users, Truck, Copy, CheckCircle } from 'lucide-react'
import { usePOS } from '../POS'
import ToastContainer from './ToastContainer'
import '../POS.css'

const Quotation = () => {
  const { quotations, entities, products, addQuotation, updateQuotation, deleteQuotation, addSale } = usePOS()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState(null)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [toasts, setToasts] = useState([])
  
  const [quotationForm, setQuotationForm] = useState({
    entityType: 'Customer',
    entityId: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    validUntil: '',
    notes: ''
  })

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.entityName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || quotation.entityType === filterType
    const matchesDate = !filterDate || quotation.date.startsWith(filterDate)
    return matchesSearch && matchesType && matchesDate
  })

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts([...toasts, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id))
  }

  const filteredEntities = entities.filter(e => e.type === quotationForm.entityType)
  const selectedEntity = entities.find(e => e.id.toString() === quotationForm.entityId)

  const handleAddQuotation = () => {
    setEditingQuotation(null)
    setQuotationForm({
      entityType: 'Customer',
      entityId: '',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      validUntil: '',
      notes: ''
    })
    setShowQuotationModal(true)
  }

  const handleEditQuotation = (quotation) => {
    setEditingQuotation(quotation)
    setQuotationForm({
      entityType: quotation.entityType || 'Customer',
      entityId: quotation.entityId || '',
      items: quotation.items || [],
      subtotal: quotation.subtotal || 0,
      tax: quotation.tax || 0,
      total: quotation.total || 0,
      validUntil: quotation.validUntil || '',
      notes: quotation.notes || ''
    })
    setShowQuotationModal(true)
  }

  const addItemToQuotation = (product) => {
    const existingItem = quotationForm.items.find(item => item.productId === product.id)
    if (existingItem) {
      setQuotationForm({
        ...quotationForm,
        items: quotationForm.items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      })
    } else {
      setQuotationForm({
        ...quotationForm,
        items: [...quotationForm.items, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          subtotal: product.price
        }]
      })
    }
    calculateTotals()
  }

  const updateItemQuantity = (productId, delta) => {
    setQuotationForm({
      ...quotationForm,
      items: quotationForm.items.map(item => {
        if (item.productId === productId) {
          const newQuantity = Math.max(1, item.quantity + delta)
          return { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
        }
        return item
      })
    })
    calculateTotals()
  }

  const removeItem = (productId) => {
    setQuotationForm({
      ...quotationForm,
      items: quotationForm.items.filter(item => item.productId !== productId)
    })
    calculateTotals()
  }

  const calculateTotals = () => {
    const subtotal = quotationForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.18
    const total = subtotal + tax
    setQuotationForm({ ...quotationForm, subtotal, tax, total })
  }

  React.useEffect(() => {
    const subtotal = quotationForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.18
    const total = subtotal + tax
    setQuotationForm(prev => ({ ...prev, subtotal, tax, total }))
  }, [quotationForm.items])

  const handleSaveQuotation = () => {
    if (!quotationForm.entityId) {
      showToast('Please select a customer/supplier', 'warning')
      return
    }
    if (quotationForm.items.length === 0) {
      showToast('Please add at least one item', 'warning')
      return
    }
    if (!quotationForm.validUntil) {
      showToast('Please set quotation validity date', 'warning')
      return
    }

    const quotationData = {
      entityType: quotationForm.entityType,
      entityId: quotationForm.entityId,
      entityName: selectedEntity.name,
      entityDetails: selectedEntity,
      items: quotationForm.items,
      subtotal: quotationForm.subtotal,
      tax: quotationForm.tax,
      total: quotationForm.total,
      validUntil: quotationForm.validUntil,
      notes: quotationForm.notes || ''
    }

    if (editingQuotation) {
      updateQuotation(editingQuotation.id, quotationData)
      showToast('Quotation updated successfully!', 'success')
    } else {
      addQuotation(quotationData)
      showToast('Quotation created successfully!', 'success')
    }

    setShowQuotationModal(false)
    setQuotationForm({
      entityType: 'Customer',
      entityId: '',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      validUntil: '',
      notes: ''
    })
  }

  const convertToInvoice = (quotation) => {
    if (!quotation.entityId) {
      showToast('Cannot convert: Entity not found', 'error')
      return
    }

    const saleData = {
      items: quotation.items,
      subtotal: quotation.subtotal,
      tax: quotation.tax,
      total: quotation.total,
      invoiceType: 'cash',
      paymentMethod: 'cash',
      amountPaid: quotation.total,
      change: 0,
      balance: 0,
      entityType: quotation.entityType,
      entityId: quotation.entityId,
      customerName: quotation.entityName,
      entityDetails: quotation.entityDetails,
      quotationId: quotation.id
    }

    addSale(saleData)
    showToast(`Quotation converted to invoice successfully!`, 'success')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="pos-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="page-header">
        <h2>Quotation</h2>
        <div className="header-actions">
          <button className="action-btn" onClick={handleAddQuotation}>
            <Plus size={18} />
            New Quotation
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Quotations</div>
          <div className="stat-value">{quotations.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Draft</div>
          <div className="stat-value">{quotations.filter(q => q.status === 'draft').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Converted</div>
          <div className="stat-value">{quotations.filter(q => q.status === 'converted').length}</div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by quotation number or customer/supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Customer">Customer</option>
          <option value="Supplier">Supplier</option>
        </select>
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
        {filteredQuotations.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <p>No quotations found</p>
            <button className="action-btn" onClick={handleAddQuotation} style={{ marginTop: '1rem' }}>
              <Plus size={18} />
              Create Your First Quotation
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Quotation No.</th>
                <th>Date</th>
                <th>Type</th>
                <th>Customer/Supplier</th>
                <th>Valid Until</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.map(quotation => (
                <tr key={quotation.id}>
                  <td>
                    <strong className="invoice-number">{quotation.quotationNumber || `#${quotation.id}`}</strong>
                  </td>
                  <td>{formatDate(quotation.date)}</td>
                  <td>
                    <span className={`entity-type-badge ${quotation.entityType?.toLowerCase() || 'customer'}`}>
                      {quotation.entityType === 'Supplier' ? <Truck size={14} /> : <Users size={14} />}
                      {quotation.entityType === 'Supplier' ? 'Supplier' : 'Customer'}
                    </span>
                  </td>
                  <td>{quotation.entityName || 'N/A'}</td>
                  <td>{quotation.validUntil ? formatDate(quotation.validUntil) : 'N/A'}</td>
                  <td>{quotation.items?.length || 0} item(s)</td>
                  <td className="amount-cell">₹{quotation.total?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge ${quotation.status || 'draft'}`}>
                      {quotation.status === 'converted' ? 'Converted' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn"
                        onClick={() => setSelectedQuotation(quotation)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {quotation.status !== 'converted' && (
                        <>
                          <button
                            className="icon-btn"
                            onClick={() => handleEditQuotation(quotation)}
                            title="Edit Quotation"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => convertToInvoice(quotation)}
                            title="Convert to Invoice"
                          >
                            <CheckCircle size={16} />
                          </button>
                        </>
                      )}
                      <button
                        className="icon-btn"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this quotation?')) {
                            deleteQuotation(quotation.id)
                            showToast('Quotation deleted successfully!', 'success')
                          }
                        }}
                        title="Delete Quotation"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showQuotationModal && (
        <div className="modal-overlay" onClick={() => setShowQuotationModal(false)}>
          <div className="modal-content quotation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingQuotation ? 'Edit Quotation' : 'New Quotation'}</h3>
              <button className="close-btn" onClick={() => setShowQuotationModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Entity Type *</label>
                <div className="entity-type-selector">
                  <button
                    type="button"
                    className={`entity-type-btn ${quotationForm.entityType === 'Customer' ? 'active' : ''}`}
                    onClick={() => {
                      setQuotationForm({...quotationForm, entityType: 'Customer', entityId: ''})
                    }}
                  >
                    <Users size={18} />
                    Customer
                  </button>
                  <button
                    type="button"
                    className={`entity-type-btn ${quotationForm.entityType === 'Supplier' ? 'active' : ''}`}
                    onClick={() => {
                      setQuotationForm({...quotationForm, entityType: 'Supplier', entityId: ''})
                    }}
                  >
                    <Truck size={18} />
                    Supplier
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>{quotationForm.entityType} Name *</label>
                <select
                  value={quotationForm.entityId}
                  onChange={(e) => setQuotationForm({...quotationForm, entityId: e.target.value})}
                  className="entity-select"
                  required
                >
                  <option value="">Select {quotationForm.entityType}</option>
                  {filteredEntities.map(entity => (
                    <option key={entity.id} value={entity.id}>
                      {entity.name} {entity.gstin ? `(${entity.gstin})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Add Products</label>
                <div className="products-selector">
                  {products.slice(0, 5).map(product => (
                    <button
                      key={product.id}
                      type="button"
                      className="product-select-btn"
                      onClick={() => addItemToQuotation(product)}
                    >
                      {product.name} - ₹{product.price}
                    </button>
                  ))}
                </div>
              </div>

              {quotationForm.items.length > 0 && (
                <div className="form-group">
                  <label>Items</label>
                  <div className="quotation-items-list">
                    {quotationForm.items.map((item, idx) => (
                      <div key={idx} className="quotation-item">
                        <span>{item.name}</span>
                        <div className="item-controls">
                          <button onClick={() => updateItemQuantity(item.productId, -1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateItemQuantity(item.productId, 1)}>+</button>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeItem(item.productId)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="quotation-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{quotationForm.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax (18%):</span>
                      <span>₹{quotationForm.tax.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total-row">
                      <span>Total:</span>
                      <span>₹{quotationForm.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Valid Until *</label>
                  <input
                    type="date"
                    value={quotationForm.validUntil}
                    onChange={(e) => setQuotationForm({...quotationForm, validUntil: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={quotationForm.notes}
                  onChange={(e) => setQuotationForm({...quotationForm, notes: e.target.value})}
                  placeholder="Additional notes..."
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowQuotationModal(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleSaveQuotation}>
                <Save size={18} />
                {editingQuotation ? 'Update' : 'Save'} Quotation
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedQuotation && (
        <div className="modal-overlay" onClick={() => setSelectedQuotation(null)}>
          <div className="modal-content sale-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Quotation Details - {selectedQuotation.quotationNumber || `#${selectedQuotation.id}`}</h3>
              <button className="close-btn" onClick={() => setSelectedQuotation(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>{selectedQuotation.entityType === 'Supplier' ? 'Supplier' : 'Customer'} Information</h4>
                <p><strong>Quotation Number:</strong> {selectedQuotation.quotationNumber || `#${selectedQuotation.id}`}</p>
                <p><strong>Name:</strong> {selectedQuotation.entityName}</p>
                <p><strong>Date:</strong> {formatDate(selectedQuotation.date)}</p>
                <p><strong>Valid Until:</strong> {selectedQuotation.validUntil ? formatDate(selectedQuotation.validUntil) : 'N/A'}</p>
                <p><strong>Status:</strong> {selectedQuotation.status === 'converted' ? 'Converted to Invoice' : 'Draft'}</p>
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
                    {selectedQuotation.items?.map((item, idx) => (
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
                  <span>Subtotal:</span>
                  <span>₹{selectedQuotation.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (18%):</span>
                  <span>₹{selectedQuotation.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span>₹{selectedQuotation.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedQuotation.status !== 'converted' && (
                <button className="confirm-btn" onClick={() => {
                  convertToInvoice(selectedQuotation)
                  setSelectedQuotation(null)
                }}>
                  <CheckCircle size={18} />
                  Convert to Invoice
                </button>
              )}
              <button className="cancel-btn" onClick={() => setSelectedQuotation(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Quotation

