import React, { useState, useEffect } from 'react'
import { Plus, Minus, Trash2, Search, ShoppingCart, CreditCard, User, X, Users, Truck, FileText, Wallet, Percent, Edit, Eye, Download, Printer, Mail, MessageCircle } from 'lucide-react'
import { usePOS } from '../POS'
import ToastContainer from './ToastContainer'
import { saveInvoicePDF, printInvoicePDF, shareInvoiceViaEmail, shareInvoiceViaWhatsApp } from '../../../utils/pdfGenerator'
import '../POS.css'

const NewSale = () => {
  const { products, entities, sales, addSale, updateSale, updateProductStock, addEntity } = usePOS()
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showInvoiceSearch, setShowInvoiceSearch] = useState(false)
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('')
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [invoiceType, setInvoiceType] = useState('cash') // cash, credit, partial
  const [entityType, setEntityType] = useState('Customer') // Customer or Supplier
  const [selectedEntityId, setSelectedEntityId] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [toasts, setToasts] = useState([])
  const [completedSale, setCompletedSale] = useState(null)

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts([...toasts, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id))
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter entities based on selected type
  const filteredEntities = entities.filter(e => e.type === entityType)
  
  // Ensure walkin-customer exists and set as default when Customer type is selected
  useEffect(() => {
    if (entityType === 'Customer') {
      // Find walkin-customer entity
      const walkinCustomer = entities.find(e => e.type === 'Customer' && e.name.toLowerCase() === 'walkin-customer')
      
      if (!walkinCustomer) {
        // Create walkin-customer if it doesn't exist (only once)
        const newWalkinCustomer = addEntity({
          name: 'walkin-customer',
          type: 'Customer',
          address: '',
          city: '',
          state: '',
          pincode: '',
          gstin: '',
          phone: '',
          email: ''
        })
        // Auto-select the newly created walkin-customer
        if (newWalkinCustomer && !selectedEntityId) {
          setSelectedEntityId(newWalkinCustomer.id.toString())
        }
      } else {
        // Auto-select existing walkin-customer if no customer is selected
        if (!selectedEntityId) {
          setSelectedEntityId(walkinCustomer.id.toString())
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entities.length])
  
  // Get selected entity details
  const selectedEntity = entities.find(e => e.id.toString() === selectedEntityId)

  // Filter invoices for search
  const filteredInvoices = sales.filter(sale => {
    const searchLower = invoiceSearchTerm.toLowerCase()
    return sale.invoiceNumber?.toLowerCase().includes(searchLower) ||
           sale.customerName?.toLowerCase().includes(searchLower) ||
           sale.id.toString().includes(searchLower)
  }).slice(0, 10) // Limit to 10 results

  const loadInvoiceForEdit = (invoice) => {
    setEditingInvoice(invoice)
    setEntityType(invoice.entityType || 'Customer')
    setSelectedEntityId(invoice.entityId?.toString() || '')
    setInvoiceType(invoice.invoiceType || 'cash')
    setPaymentMethod(invoice.paymentMethod || 'cash')
    setCart(invoice.items.map(item => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })))
    setShowInvoiceSearch(false)
    setInvoiceSearchTerm('')
    showToast(`Invoice ${invoice.invoiceNumber || `#${invoice.id}`} loaded for editing`, 'info')
  }

  const addToCart = (product) => {
    if (product.stock <= 0) {
      showToast('Product out of stock!', 'error')
      return
    }
    
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        showToast('Insufficient stock!', 'error')
        return
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta
        const product = products.find(p => p.id === id)
        if (newQuantity < 1) return item
        if (newQuantity > product.stock) {
          showToast('Insufficient stock!', 'error')
          return item
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const getTax = () => {
    return getSubtotal() * 0.18 // 18% GST
  }

  const getTotal = () => {
    return getSubtotal() + getTax()
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Cart is empty!', 'warning')
      return
    }
    // For Customer type, default to walkin-customer if not selected
    let entityIdToUse = selectedEntityId
    if (entityType === 'Customer' && !selectedEntityId) {
      const walkinCustomer = entities.find(e => e.type === 'Customer' && e.name.toLowerCase() === 'walkin-customer')
      if (walkinCustomer) {
        entityIdToUse = walkinCustomer.id.toString()
        setSelectedEntityId(entityIdToUse)
      }
    }
    if (!entityIdToUse && entityType === 'Supplier') {
      showToast(`Please select a ${entityType} to continue`, 'warning')
      return
    }
    setShowPaymentModal(true)
    // Set default amount paid based on invoice type
    if (editingInvoice) {
      // Load existing invoice data
      setAmountPaid(editingInvoice.amountPaid?.toFixed(2) || getTotal().toFixed(2))
      setPaymentMethod(editingInvoice.paymentMethod || 'cash')
      setInvoiceType(editingInvoice.invoiceType || 'cash')
    } else {
      if (invoiceType === 'cash') {
        setAmountPaid(getTotal().toFixed(2))
      } else if (invoiceType === 'credit') {
        setAmountPaid('0')
      } else if (invoiceType === 'partial') {
        setAmountPaid('0')
      }
    }
  }

  const processPayment = () => {
    // For Customer type, default to walkin-customer if not selected
    let entityIdToUse = selectedEntityId
    if (entityType === 'Customer' && !selectedEntityId) {
      const walkinCustomer = entities.find(e => e.type === 'Customer' && e.name.toLowerCase() === 'walkin-customer')
      if (walkinCustomer) {
        entityIdToUse = walkinCustomer.id.toString()
        setSelectedEntityId(entityIdToUse)
      }
    }
    // Mandatory validation: Supplier must be selected
    if (!entityIdToUse && entityType === 'Supplier') {
      showToast(`Please select a ${entityType} to continue`, 'error')
      return
    }

    const total = getTotal()
    const paid = parseFloat(amountPaid) || 0
    
    // Validation based on invoice type
    if (invoiceType === 'cash') {
      if (paid < total) {
        showToast(`Insufficient payment! Total: ₹${total.toFixed(2)}, Paid: ₹${paid.toFixed(2)}`, 'error')
        return
      }
    } else if (invoiceType === 'partial') {
      if (paid <= 0) {
        showToast('Please enter the partial payment amount', 'warning')
        return
      }
      if (paid >= total) {
        showToast('Partial payment cannot be equal to or greater than total amount. Please select Cash invoice type for full payment.', 'error')
        return
      }
    } else if (invoiceType === 'credit') {
      if (paid > 0) {
        showToast('Credit invoice should have zero payment. Please select Partial invoice type if making partial payment.', 'error')
        return
      }
    }

    const change = invoiceType === 'cash' ? paid - total : 0
    const balance = invoiceType === 'credit' ? total : (invoiceType === 'partial' ? total - paid : 0)

    // Get the entity to use (use entityIdToUse which may be walkin-customer)
    const entityToUse = entities.find(e => e.id.toString() === entityIdToUse)
    const entityName = entityToUse ? entityToUse.name : (entityType === 'Customer' ? 'walkin-customer' : 'Walk-in Supplier')
    
    const saleData = {
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      subtotal: getSubtotal(),
      tax: getTax(),
      total: total,
      invoiceType: invoiceType,
      paymentMethod: paymentMethod,
      amountPaid: paid,
      change: change,
      balance: balance,
      entityType: entityType,
      entityId: entityIdToUse || null,
      customerName: entityName,
      entityDetails: entityToUse || null
    }

    let resultSale
    if (editingInvoice) {
      // Update existing invoice
      updateSale(editingInvoice.id, saleData)
      resultSale = { ...editingInvoice, ...saleData }
      showToast(`Invoice ${editingInvoice.invoiceNumber} updated successfully!`, 'success', 5000)
    } else {
      // Create new invoice
      resultSale = addSale(saleData)
      const billType = entityType === 'Customer' ? 'Bill' : 'Purchase Invoice'
      showToast(`${billType} completed successfully! Invoice: ${resultSale.invoiceNumber}`, 'success', 5000)
    }

    // Update stock for each item sold (only for new invoices)
    if (!editingInvoice) {
      cart.forEach(item => {
        const product = products.find(p => p.id === item.id)
        if (product) {
          updateProductStock(item.id, product.stock - item.quantity)
        }
      })
    }

    // Show PDF options modal for new invoices
    if (!editingInvoice) {
      setCompletedSale(resultSale)
    }

    // Reset
    setCart([])
    setShowPaymentModal(false)
    setEditingInvoice(null)
    setSelectedEntityId('')
    setPaymentMethod('cash')
    setInvoiceType('cash')
    setAmountPaid('')
  }

  return (
    <div className="pos-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Entity Selection Section */}
      <div className="bill-header-section">
        <div className="bill-header-card">
          <div className="bill-header-title">
            <FileText size={24} />
            <h2>{editingInvoice ? `Edit Invoice - ${editingInvoice.invoiceNumber}` : 'New Bill'}</h2>
            <div className="bill-header-actions">
              {editingInvoice && (
                <button 
                  className="invoice-clear-btn"
                  onClick={() => {
                    setEditingInvoice(null)
                    setCart([])
                    setSelectedEntityId('')
                    setInvoiceType('cash')
                    setPaymentMethod('cash')
                    showToast('Cleared invoice edit mode', 'info')
                  }}
                  title="Clear Edit Mode"
                >
                  <X size={16} />
                  Clear Edit
                </button>
              )}
              <button 
                className="invoice-search-btn"
                onClick={() => setShowInvoiceSearch(!showInvoiceSearch)}
                title="Search/Edit Previous Invoice"
              >
                <Search size={18} />
                {editingInvoice ? 'New Bill' : 'Search Invoice'}
              </button>
            </div>
          </div>
          {showInvoiceSearch && (
            <div className="invoice-search-panel">
              <div className="search-box">
                <Search size={20} />
                <label htmlFor="invoice-search-input" className="sr-only">Search invoices</label>
                <input
                  id="invoice-search-input"
                  name="invoice-search"
                  type="text"
                  placeholder="Search by invoice number, customer/supplier name..."
                  value={invoiceSearchTerm}
                  onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                />
                <button className="close-btn" onClick={() => {
                  setShowInvoiceSearch(false)
                  setInvoiceSearchTerm('')
                }}>
                  <X size={18} />
                </button>
              </div>
              {invoiceSearchTerm && (
                <div className="invoice-search-results">
                  {filteredInvoices.length === 0 ? (
                    <div className="no-results">No invoices found</div>
                  ) : (
                    <div className="invoice-results-list">
                      {filteredInvoices.map(invoice => (
                        <div key={invoice.id} className="invoice-result-item">
                          <div className="invoice-result-info">
                            <strong className="invoice-number">{invoice.invoiceNumber || `#${invoice.id}`}</strong>
                            <span>{invoice.customerName}</span>
                            <span className="invoice-date">{new Date(invoice.date).toLocaleDateString()}</span>
                            <span className="invoice-amount">₹{invoice.total?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="invoice-result-actions">
                            <button
                              className="icon-btn-small"
                              onClick={() => loadInvoiceForEdit(invoice)}
                              title="Edit Invoice"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="icon-btn-small"
                              onClick={() => {
                                // View invoice details
                                window.open(`/pos/sales`, '_blank')
                              }}
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="entity-selection-group">
            <div className="form-group">
              <label>Select Type *</label>
              <div className="entity-type-selector">
                <button
                  type="button"
                  className={`entity-type-btn ${entityType === 'Customer' ? 'active' : ''}`}
                  onClick={() => {
                    setEntityType('Customer')
                    setSelectedEntityId('') // Reset selection when type changes
                  }}
                >
                  <Users size={18} />
                  CUSTOMER
                </button>
                <button
                  type="button"
                  className={`entity-type-btn ${entityType === 'Supplier' ? 'active' : ''}`}
                  onClick={() => {
                    setEntityType('Supplier')
                    setSelectedEntityId('') // Reset selection when type changes
                  }}
                >
                  <Truck size={18} />
                  SUPPLIER
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="entity-select-input">{entityType} Name {entityType === 'Customer' ? '(Default: walkin-customer)' : '*'}</label>
                <select
                  id="entity-select-input"
                  name="entity-select"
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                  className="entity-select"
                  required={entityType === 'Supplier'}
                >
                  <option value="">{entityType === 'Customer' ? 'Select Customer (defaults to walkin-customer)' : `Select ${entityType} *`}</option>
                {filteredEntities.map(entity => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name} {entity.gstin ? `(${entity.gstin})` : ''}
                  </option>
                ))}
              </select>
              {selectedEntity && (
                <div className="selected-entity-info">
                  <p><strong>Address:</strong> {selectedEntity.address || 'N/A'}</p>
                  <p><strong>City:</strong> {selectedEntity.city || 'N/A'} | <strong>State:</strong> {selectedEntity.state || 'N/A'} | <strong>Pincode:</strong> {selectedEntity.pincode || 'N/A'}</p>
                  {selectedEntity.gstin && <p><strong>GSTIN:</strong> {selectedEntity.gstin}</p>}
                </div>
              )}
            </div>
          </div>
          <div className="invoice-type-section">
            <div className="form-group">
              <label>Invoice Type *</label>
              <div className="invoice-type-selector">
                <button
                  type="button"
                  className={`invoice-type-btn cash ${invoiceType === 'cash' ? 'active' : ''}`}
                  onClick={() => {
                    setInvoiceType('cash')
                    if (cart.length > 0) {
                      setAmountPaid(getTotal().toFixed(2))
                    }
                  }}
                >
                  <Wallet size={18} />
                  CASH
                </button>
                <button
                  type="button"
                  className={`invoice-type-btn credit ${invoiceType === 'credit' ? 'active' : ''}`}
                  onClick={() => {
                    setInvoiceType('credit')
                    setAmountPaid('0')
                  }}
                >
                  <CreditCard size={18} />
                  CREDIT
                </button>
                <button
                  type="button"
                  className={`invoice-type-btn partial ${invoiceType === 'partial' ? 'active' : ''}`}
                  onClick={() => {
                    setInvoiceType('partial')
                    setAmountPaid('0')
                  }}
                >
                  <Percent size={18} />
                  PARTIAL
                </button>
              </div>
              {invoiceType === 'cash' && (
                <small className="invoice-type-hint">Full payment required at checkout</small>
              )}
              {invoiceType === 'credit' && (
                <small className="invoice-type-hint">No payment required, full amount on credit</small>
              )}
              {invoiceType === 'partial' && (
                <small className="invoice-type-hint">Partial payment allowed, balance will be on credit</small>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pos-grid">
        <div className="products-section">
          <div className="section-header">
            <h2>Products</h2>
            <div className="search-box">
              <Search size={20} />
              <label htmlFor="product-search-input" className="sr-only">Search products</label>
              <input
                id="product-search-input"
                name="product-search"
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-stock">Stock: {product.stock}</p>
                  <p className="product-category">{product.category}</p>
                </div>
                <button 
                  className="add-btn"
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  <Plus size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <div className="section-header">
            <h2>
              <ShoppingCart size={24} />
              Cart ({cart.length})
            </h2>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart size={48} />
                <p>Cart is empty</p>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="cart-item-actions">
                      <button onClick={() => updateQuantity(item.id, -1)}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>
                        <Plus size={16} />
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="cart-footer">
                  <div className="cart-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax (18%):</span>
                      <span>₹{getTax().toFixed(2)}</span>
                    </div>
                    <div className="cart-total">
                      <span>Total:</span>
                      <span className="total-amount">₹{getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    className="checkout-btn" 
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    title={cart.length === 0 ? 'Cart is empty' : 'Proceed to Payment'}
                  >
                    <CreditCard size={20} />
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Payment & Invoice</h3>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>
                  <FileText size={18} />
                  Invoice Information
                </label>
                <div className="entity-info-display">
                  <p><strong>Invoice Number:</strong> <span className="invoice-number-preview">Will be generated on save</span></p>
                  <p><strong>Invoice Type:</strong> 
                    <span className={`invoice-type-badge-modal ${invoiceType}`}>
                      {invoiceType === 'cash' && <Wallet size={14} />}
                      {invoiceType === 'credit' && <CreditCard size={14} />}
                      {invoiceType === 'partial' && <Percent size={14} />}
                      {invoiceType.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
              <div className="form-group">
                <label>
                  <User size={18} />
                  {entityType} Information
                </label>
                <div className="entity-info-display">
                  <p><strong>Name:</strong> {selectedEntity ? selectedEntity.name : (entityType === 'Customer' ? 'Walk-in Customer' : 'Walk-in Supplier')}</p>
                  {selectedEntity && (
                    <>
                      {selectedEntity.address && <p><strong>Address:</strong> {selectedEntity.address}</p>}
                      {selectedEntity.gstin && <p><strong>GSTIN:</strong> {selectedEntity.gstin}</p>}
                    </>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-methods">
                  <button
                    className={`payment-method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    Cash
                  </button>
                  <button
                    className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    Card
                  </button>
                  <button
                    className={`payment-method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    UPI
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Invoice Type</label>
                <div className="invoice-type-display">
                  <span className={`invoice-type-badge-modal ${invoiceType}`}>
                    {invoiceType === 'cash' && <Wallet size={16} />}
                    {invoiceType === 'credit' && <CreditCard size={16} />}
                    {invoiceType === 'partial' && <Percent size={16} />}
                    {invoiceType.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="total-amount-input">Total Amount</label>
                <input
                  id="total-amount-input"
                  name="total-amount"
                  type="text"
                  value={`₹${getTotal().toFixed(2)}`}
                  disabled
                  className="disabled-input"
                />
              </div>
              {invoiceType !== 'credit' && (
                <div className="form-group">
                  <label htmlFor="amount-paid-input">Amount Paid {invoiceType === 'partial' ? '(Partial)' : ''}</label>
                  <input
                    id="amount-paid-input"
                    name="amount-paid"
                    type="number"
                    placeholder={invoiceType === 'cash' ? "Enter amount" : "Enter partial amount"}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    min={invoiceType === 'cash' ? getTotal() : 0}
                    max={invoiceType === 'partial' ? getTotal() - 0.01 : undefined}
                    step="0.01"
                  />
                  {invoiceType === 'cash' && (
                    <small>Full payment required (minimum ₹{getTotal().toFixed(2)})</small>
                  )}
                  {invoiceType === 'partial' && (
                    <small>Enter amount less than ₹{getTotal().toFixed(2)}</small>
                  )}
                </div>
              )}
              {invoiceType === 'credit' && (
                <div className="form-group">
                  <label htmlFor="amount-paid-credit-input">Amount Paid</label>
                  <input
                    id="amount-paid-credit-input"
                    name="amount-paid-credit"
                    type="text"
                    value="₹0.00"
                    disabled
                    className="disabled-input"
                  />
                  <small>Credit invoice - No payment required</small>
                </div>
              )}
              {invoiceType === 'cash' && parseFloat(amountPaid) >= getTotal() && (
                <div className="change-display">
                  Change: ₹{(parseFloat(amountPaid) - getTotal()).toFixed(2)}
                </div>
              )}
              {invoiceType === 'partial' && parseFloat(amountPaid) > 0 && (
                <div className="balance-display">
                  Balance: ₹{(getTotal() - parseFloat(amountPaid)).toFixed(2)}
                </div>
              )}
              {invoiceType === 'credit' && (
                <div className="balance-display">
                  Balance: ₹{getTotal().toFixed(2)} (Credit)
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={processPayment}>
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Options Modal after Sale Completion */}
      {completedSale && (
        <div className="modal-overlay" onClick={() => setCompletedSale(null)}>
          <div className="modal-content sale-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice Generated Successfully!</h3>
              <button className="close-btn" onClick={() => setCompletedSale(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <p><strong>Invoice Number:</strong> {completedSale.invoiceNumber || `#${completedSale.id}`}</p>
                <p><strong>Total Amount:</strong> ₹{completedSale.total.toFixed(2)}</p>
                <p><strong>Customer/Supplier:</strong> {completedSale.customerName}</p>
              </div>
              <div className="detail-section">
                <h4>What would you like to do?</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Choose an option to save, print, or share your invoice PDF.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <div className="pdf-actions-group">
                <button 
                  className="pdf-action-btn save-btn" 
                  onClick={() => {
                    saveInvoicePDF(completedSale)
                    setCompletedSale(null)
                  }}
                  title="Save PDF"
                >
                  <Download size={16} />
                  Save PDF
                </button>
                <button 
                  className="pdf-action-btn print-btn" 
                  onClick={() => {
                    printInvoicePDF(completedSale)
                    setCompletedSale(null)
                  }}
                  title="Print PDF"
                >
                  <Printer size={16} />
                  Print PDF
                </button>
                <button 
                  className="pdf-action-btn email-btn" 
                  onClick={() => {
                    const email = completedSale.entityDetails?.email || ''
                    shareInvoiceViaEmail(completedSale, email)
                    setCompletedSale(null)
                  }}
                  title="Share via Email"
                >
                  <Mail size={16} />
                  Email
                </button>
                <button 
                  className="pdf-action-btn whatsapp-btn" 
                  onClick={() => {
                    const phone = completedSale.entityDetails?.phone || ''
                    shareInvoiceViaWhatsApp(completedSale, phone)
                    setCompletedSale(null)
                  }}
                  title="Share via WhatsApp"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </button>
              </div>
              <button className="cancel-btn" onClick={() => setCompletedSale(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewSale

