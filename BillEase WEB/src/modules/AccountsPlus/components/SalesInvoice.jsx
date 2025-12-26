import React, { useState } from 'react'
import { Plus, Trash2, Save, Printer, Share2, X } from 'lucide-react'
import './SalesInvoice.css'

const SalesInvoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    customer: {
      name: '',
      address: '',
      gstin: '',
      phone: '',
      email: ''
    },
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    paymentMethod: 'cash',
    notes: ''
  })

  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    rate: 0,
    tax: 18
  })

  const addItem = () => {
    if (!newItem.name || newItem.rate <= 0) return
    
    const item = {
      id: Date.now(),
      ...newItem,
      amount: newItem.quantity * newItem.rate,
      taxAmount: (newItem.quantity * newItem.rate * newItem.tax) / 100
    }
    
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, item],
      subtotal: prev.subtotal + item.amount,
      tax: prev.tax + item.taxAmount,
      total: prev.subtotal + prev.tax + item.amount + item.taxAmount
    }))
    
    setNewItem({ name: '', quantity: 1, rate: 0, tax: 18 })
  }

  const removeItem = (id) => {
    const item = invoiceData.items.find(i => i.id === id)
    if (item) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter(i => i.id !== id),
        subtotal: prev.subtotal - item.amount,
        tax: prev.tax - item.taxAmount,
        total: prev.subtotal - prev.tax - item.amount - item.taxAmount
      }))
    }
  }

  const updateCustomer = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: value }
    }))
  }

  return (
    <div className="sales-invoice-container">
      <div className="invoice-header">
        <h1>New Invoice</h1>
        <div className="invoice-actions">
          <button className="action-btn secondary">
            <Share2 size={18} />
            Share
          </button>
          <button className="action-btn secondary">
            <Printer size={18} />
            Print
          </button>
          <button className="action-btn primary">
            <Save size={18} />
            Save Invoice
          </button>
        </div>
      </div>

      <div className="invoice-layout">
        {/* Left: Customer & Invoice Info */}
        <div className="invoice-left-panel">
          <div className="invoice-section">
            <h3>Customer Information</h3>
            <div className="form-group">
              <label htmlFor="customer-name">Customer Name *</label>
              <input
                id="customer-name"
                name="customer-name"
                type="text"
                value={invoiceData.customer.name}
                onChange={(e) => updateCustomer('name', e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="customer-address">Address</label>
              <textarea
                id="customer-address"
                name="customer-address"
                value={invoiceData.customer.address}
                onChange={(e) => updateCustomer('address', e.target.value)}
                rows="3"
                placeholder="Enter address"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customer-phone">Phone</label>
                <input
                  id="customer-phone"
                  name="customer-phone"
                  type="tel"
                  value={invoiceData.customer.phone}
                  onChange={(e) => updateCustomer('phone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="customer-gstin">GSTIN</label>
                <input
                  id="customer-gstin"
                  name="customer-gstin"
                  type="text"
                  value={invoiceData.customer.gstin}
                  onChange={(e) => updateCustomer('gstin', e.target.value)}
                  placeholder="GSTIN"
                />
              </div>
            </div>
          </div>

          <div className="invoice-section">
            <h3>Invoice Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="invoice-number">Invoice Number</label>
                <input
                  id="invoice-number"
                  name="invoice-number"
                  type="text"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="invoice-date">Date</label>
                <input
                  id="invoice-date"
                  name="invoice-date"
                  type="date"
                  value={invoiceData.date}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Items Table */}
        <div className="invoice-center-panel">
          <div className="invoice-section">
            <div className="section-header">
              <h3>Items</h3>
            </div>
            
            {/* Add Item Form */}
            <div className="add-item-form">
              <div className="form-row">
                <div className="form-group flex-2">
                  <label htmlFor="item-name" className="sr-only">Item Name</label>
                  <input
                    id="item-name"
                    name="item-name"
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Item name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="item-quantity" className="sr-only">Quantity</label>
                  <input
                    id="item-quantity"
                    name="item-quantity"
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    placeholder="Qty"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="item-rate" className="sr-only">Rate</label>
                  <input
                    id="item-rate"
                    name="item-rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItem.rate}
                    onChange={(e) => setNewItem(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                    placeholder="Rate"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="item-tax" className="sr-only">Tax %</label>
                  <input
                    id="item-tax"
                    name="item-tax"
                    type="number"
                    min="0"
                    max="100"
                    value={newItem.tax}
                    onChange={(e) => setNewItem(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                    placeholder="Tax %"
                  />
                </div>
                <button type="button" className="add-item-btn" onClick={addItem}>
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Items Table */}
            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Tax %</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-table">
                        No items added. Add items to create invoice.
                      </td>
                    </tr>
                  ) : (
                    invoiceData.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.rate.toFixed(2)}</td>
                        <td>{item.tax}%</td>
                        <td>₹{(item.amount + item.taxAmount).toFixed(2)}</td>
                        <td>
                          <button 
                            className="remove-item-btn"
                            onClick={() => removeItem(item.id)}
                            type="button"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Totals & Payment */}
        <div className="invoice-right-panel">
          <div className="invoice-section">
            <h3>Totals</h3>
            <div className="totals-box">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{invoiceData.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (GST)</span>
                <span>₹{invoiceData.tax.toFixed(2)}</span>
              </div>
              <div className="total-row total-final">
                <span>Total</span>
                <span>₹{invoiceData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="invoice-section">
            <h3>Payment</h3>
            <div className="form-group">
              <label htmlFor="payment-method">Payment Method</label>
              <select
                id="payment-method"
                name="payment-method"
                value={invoiceData.paymentMethod}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank Transfer</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="invoice-notes">Notes</label>
              <textarea
                id="invoice-notes"
                name="invoice-notes"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                rows="4"
                placeholder="Additional notes..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="invoice-footer">
        <button className="footer-btn cancel">
          <X size={18} />
          Cancel
        </button>
        <button className="footer-btn print">
          <Printer size={18} />
          Print
        </button>
        <button className="footer-btn save">
          <Save size={18} />
          Save & Print
        </button>
      </div>
    </div>
  )
}

export default SalesInvoice

