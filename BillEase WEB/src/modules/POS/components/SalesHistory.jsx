import React, { useState } from 'react'
import { Receipt, Search, Calendar, Download, Eye, Trash2, Users, Truck, Wallet, CreditCard, Percent, FileText, Printer, Mail, MessageCircle, Share2 } from 'lucide-react'
import { usePOS } from '../POS'
import { saveInvoicePDF, printInvoicePDF, shareInvoiceViaEmail, shareInvoiceViaWhatsApp } from '../../../utils/pdfGenerator'
import '../POS.css'

const SalesHistory = () => {
  const { sales } = usePOS()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSale, setSelectedSale] = useState(null)
  const [filterDate, setFilterDate] = useState('')
  const [filterType, setFilterType] = useState('') // 'Customer' or 'Supplier'
  const [filterInvoiceType, setFilterInvoiceType] = useState('') // 'cash', 'credit', 'partial'

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toString().includes(searchTerm)
    const matchesDate = !filterDate || sale.date.startsWith(filterDate)
    const matchesEntityType = !filterType || sale.entityType === filterType
    const matchesInvoiceType = !filterInvoiceType || sale.invoiceType === filterInvoiceType
    return matchesSearch && matchesDate && matchesEntityType && matchesInvoiceType
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

  const getTotalSales = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  }

  const getTotalCount = () => {
    return filteredSales.length
  }

  const salesCount = sales.filter(s => s.entityType === 'Customer').length
  const purchaseCount = sales.filter(s => s.entityType === 'Supplier').length

  return (
    <div className="pos-container">
      <div className="page-header">
        <h2>Sales/Purchase History</h2>
        <div className="header-actions">
          <button className="action-btn">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Sales</div>
          <div className="stat-value">₹{getTotalSales().toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{getTotalCount()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Sales Invoices</div>
          <div className="stat-value">{salesCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Purchase Invoices</div>
          <div className="stat-value">{purchaseCount}</div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by invoice number, customer/supplier name..."
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
          <option value="Customer">Sales</option>
          <option value="Supplier">Purchase</option>
        </select>
        <select
          className="filter-select"
          value={filterInvoiceType}
          onChange={(e) => setFilterInvoiceType(e.target.value)}
        >
          <option value="">All Invoice Types</option>
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
          <option value="partial">Partial</option>
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
        {filteredSales.length === 0 ? (
          <div className="empty-state">
            <Receipt size={48} />
            <p>No sales found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Customer/Supplier</th>
                <th>Invoice Type</th>
                <th>Items</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => (
                <tr key={sale.id}>
                  <td>
                    <strong className="invoice-number">{sale.invoiceNumber || `#${sale.id}`}</strong>
                  </td>
                  <td>{formatDate(sale.date)}</td>
                  <td>
                    <span className={`entity-type-badge ${sale.entityType?.toLowerCase() || 'customer'}`}>
                      {sale.entityType === 'Supplier' ? <Truck size={14} /> : <Users size={14} />}
                      {sale.entityType === 'Supplier' ? 'Purchase' : 'Sales'}
                    </span>
                  </td>
                  <td>{sale.customerName || 'N/A'}</td>
                  <td>
                    <span className={`invoice-type-badge-table ${sale.invoiceType || 'cash'}`}>
                      {sale.invoiceType === 'cash' && <Wallet size={12} />}
                      {sale.invoiceType === 'credit' && <CreditCard size={12} />}
                      {sale.invoiceType === 'partial' && <Percent size={12} />}
                      {(sale.invoiceType || 'cash').toUpperCase()}
                    </span>
                  </td>
                  <td>{sale.items.length} item(s)</td>
                  <td className="amount-cell">₹{sale.total.toFixed(2)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn"
                        onClick={() => setSelectedSale(sale)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedSale && (
        <div className="modal-overlay" onClick={() => setSelectedSale(null)}>
          <div className="modal-content sale-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice Details - {selectedSale.invoiceNumber || `#${selectedSale.id}`}</h3>
              <button className="close-btn" onClick={() => setSelectedSale(null)}>
                <Trash2 size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>{selectedSale.entityType === 'Supplier' ? 'Supplier' : 'Customer'} Information</h4>
                <p><strong>Invoice Number:</strong> {selectedSale.invoiceNumber || `#${selectedSale.id}`}</p>
                <p><strong>Invoice Type:</strong> 
                  <span className={`invoice-type-badge-modal ${selectedSale.invoiceType || 'cash'}`}>
                    {(selectedSale.invoiceType || 'cash').toUpperCase()}
                  </span>
                </p>
                <p><strong>Type:</strong> {selectedSale.entityType === 'Supplier' ? 'Purchase Invoice' : 'Sales Invoice'}</p>
                <p><strong>Name:</strong> {selectedSale.customerName}</p>
                <p><strong>Date:</strong> {formatDate(selectedSale.date)}</p>
                <p><strong>Payment Method:</strong> {selectedSale.paymentMethod?.toUpperCase() || 'N/A'}</p>
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
                    {selectedSale.items.map((item, idx) => (
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
                  <span>₹{selectedSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (18%):</span>
                  <span>₹{selectedSale.tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span>₹{selectedSale.total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Amount Paid:</span>
                  <span>₹{selectedSale.amountPaid?.toFixed(2) || '0.00'}</span>
                </div>
                {selectedSale.change > 0 && (
                  <div className="summary-row">
                    <span>Change:</span>
                    <span>₹{selectedSale.change.toFixed(2)}</span>
                  </div>
                )}
                {selectedSale.balance > 0 && (
                  <div className="summary-row">
                    <span>Balance:</span>
                    <span className="balance-amount">₹{selectedSale.balance.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <div className="pdf-actions-group">
                <button 
                  className="pdf-action-btn save-btn" 
                  onClick={() => {
                    saveInvoicePDF(selectedSale)
                  }}
                  title="Save PDF"
                >
                  <Download size={16} />
                  Save PDF
                </button>
                <button 
                  className="pdf-action-btn print-btn" 
                  onClick={() => {
                    printInvoicePDF(selectedSale)
                  }}
                  title="Print PDF"
                >
                  <Printer size={16} />
                  Print PDF
                </button>
                <button 
                  className="pdf-action-btn email-btn" 
                  onClick={() => {
                    const email = selectedSale.entityDetails?.email || ''
                    shareInvoiceViaEmail(selectedSale, email)
                  }}
                  title="Share via Email"
                >
                  <Mail size={16} />
                  Email
                </button>
                <button 
                  className="pdf-action-btn whatsapp-btn" 
                  onClick={() => {
                    const phone = selectedSale.entityDetails?.phone || ''
                    shareInvoiceViaWhatsApp(selectedSale, phone)
                  }}
                  title="Share via WhatsApp"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </button>
              </div>
              <button className="cancel-btn" onClick={() => setSelectedSale(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesHistory

