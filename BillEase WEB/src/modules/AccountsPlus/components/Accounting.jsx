import React, { useState } from 'react'
import { ChevronRight, ChevronDown, Plus, Search, FileText, Calculator, TrendingUp, TrendingDown, Download, Filter } from 'lucide-react'
import './Accounting.css'

const Accounting = () => {
  const [activeTab, setActiveTab] = useState('ledger')
  const [expandedGroups, setExpandedGroups] = useState({})
  const [expandedReports, setExpandedReports] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  // Sample ledger structure (tree-view)
  const ledgerStructure = [
    {
      id: 'assets',
      name: 'Assets',
      type: 'group',
      children: [
        {
          id: 'current-assets',
          name: 'Current Assets',
          type: 'group',
          children: [
            { id: 'cash', name: 'Cash', type: 'account', balance: 500000 },
            { id: 'bank', name: 'Bank Account', type: 'account', balance: 2500000 },
            { id: 'receivables', name: 'Accounts Receivable', type: 'account', balance: 1200000 }
          ]
        },
        {
          id: 'fixed-assets',
          name: 'Fixed Assets',
          type: 'group',
          children: [
            { id: 'machinery', name: 'Machinery', type: 'account', balance: 5000000 },
            { id: 'furniture', name: 'Furniture & Fixtures', type: 'account', balance: 800000 }
          ]
        }
      ]
    },
    {
      id: 'liabilities',
      name: 'Liabilities',
      type: 'group',
      children: [
        {
          id: 'current-liabilities',
          name: 'Current Liabilities',
          type: 'group',
          children: [
            { id: 'payables', name: 'Accounts Payable', type: 'account', balance: 800000 },
            { id: 'loans', name: 'Short-term Loans', type: 'account', balance: 1500000 }
          ]
        },
        {
          id: 'long-term-liabilities',
          name: 'Long-term Liabilities',
          type: 'group',
          children: [
            { id: 'long-loans', name: 'Long-term Loans', type: 'account', balance: 3000000 }
          ]
        }
      ]
    },
    {
      id: 'income',
      name: 'Income',
      type: 'group',
      children: [
        { id: 'sales', name: 'Sales Revenue', type: 'account', balance: 10000000 },
        { id: 'other-income', name: 'Other Income', type: 'account', balance: 200000 }
      ]
    },
    {
      id: 'expenses',
      name: 'Expenses',
      type: 'group',
      children: [
        { id: 'cost-of-goods', name: 'Cost of Goods Sold', type: 'account', balance: 6000000 },
        { id: 'operating-expenses', name: 'Operating Expenses', type: 'account', balance: 2000000 },
        { id: 'administrative', name: 'Administrative Expenses', type: 'account', balance: 800000 }
      ]
    }
  ]

  const voucherTypes = [
    { id: 'payment', label: 'Payment', icon: TrendingDown },
    { id: 'receipt', label: 'Receipt', icon: TrendingUp },
    { id: 'journal', label: 'Journal', icon: FileText },
    { id: 'contra', label: 'Contra', icon: Calculator }
  ]

  const financialReports = [
    {
      id: 'profit-loss',
      title: 'Profit & Loss Statement',
      sections: [
        { id: 'income', title: 'Income', items: ['Sales Revenue', 'Other Income'] },
        { id: 'expenses', title: 'Expenses', items: ['Cost of Goods Sold', 'Operating Expenses', 'Administrative Expenses'] }
      ]
    },
    {
      id: 'balance-sheet',
      title: 'Balance Sheet',
      sections: [
        { id: 'assets', title: 'Assets', items: ['Current Assets', 'Fixed Assets'] },
        { id: 'liabilities', title: 'Liabilities', items: ['Current Liabilities', 'Long-term Liabilities'] },
        { id: 'equity', title: 'Equity', items: ['Capital', 'Retained Earnings'] }
      ]
    },
    {
      id: 'cash-flow',
      title: 'Cash Flow Statement',
      sections: [
        { id: 'operating', title: 'Operating Activities', items: ['Cash from Operations'] },
        { id: 'investing', title: 'Investing Activities', items: ['Capital Expenditure'] },
        { id: 'financing', title: 'Financing Activities', items: ['Loan Repayment', 'Dividends'] }
      ]
    }
  ]

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  const toggleReportSection = (reportId, sectionId) => {
    setExpandedReports(prev => ({
      ...prev,
      [`${reportId}-${sectionId}`]: !prev[`${reportId}-${sectionId}`]
    }))
  }

  const renderLedgerTree = (items, level = 0) => {
    return items.map(item => {
      const isExpanded = expandedGroups[item.id]
      const hasChildren = item.children && item.children.length > 0

      return (
        <div key={item.id} className="ledger-tree-item" style={{ paddingLeft: `${level * 1.5}rem` }}>
          <div
            className={`ledger-item-header ${item.type === 'account' ? 'account-item' : 'group-item'}`}
            onClick={() => hasChildren && toggleGroup(item.id)}
          >
            {hasChildren && (
              <span className="expand-icon">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
            {!hasChildren && <span className="expand-icon-placeholder" />}
            <span className="item-name">{item.name}</span>
            {item.type === 'account' && (
              <span className="item-balance">
                ₹{item.balance?.toLocaleString() || '0'}
              </span>
            )}
          </div>
          {hasChildren && isExpanded && (
            <div className="ledger-children">
              {renderLedgerTree(item.children, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="accounting-page">
      <div className="accounting-header">
        <h2>Accounting</h2>
        <div className="header-tabs">
          <button
            className={`tab-btn ${activeTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveTab('ledger')}
          >
            Ledger Explorer
          </button>
          <button
            className={`tab-btn ${activeTab === 'voucher' ? 'active' : ''}`}
            onClick={() => setActiveTab('voucher')}
          >
            Voucher Entry
          </button>
          <button
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Financial Reports
          </button>
        </div>
      </div>

      <div className="accounting-content">
        {/* Ledger Explorer */}
        {activeTab === 'ledger' && (
          <div className="ledger-explorer">
            <div className="explorer-header">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-primary">
                <Plus size={18} />
                New Account
              </button>
            </div>
            <div className="ledger-tree">
              {renderLedgerTree(ledgerStructure)}
            </div>
          </div>
        )}

        {/* Voucher Entry */}
        {activeTab === 'voucher' && (
          <div className="voucher-entry">
            <div className="voucher-type-selector">
              {voucherTypes.map(type => (
                <button
                  key={type.id}
                  className="voucher-type-btn"
                >
                  <type.icon size={20} />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
            <div className="voucher-form">
              <div className="form-section">
                <label>Date</label>
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-section">
                <label>Voucher Number</label>
                <input type="text" placeholder="Auto-generated" readOnly />
              </div>
              <div className="form-section">
                <label>Narration</label>
                <textarea rows="3" placeholder="Enter narration..." />
              </div>
              <div className="voucher-entries">
                <div className="entries-header">
                  <span>Account</span>
                  <span>Debit</span>
                  <span>Credit</span>
                  <span>Actions</span>
                </div>
                <div className="entry-row">
                  <select>
                    <option>Select Account</option>
                  </select>
                  <input type="number" placeholder="0.00" />
                  <input type="number" placeholder="0.00" />
                  <button className="icon-btn">×</button>
                </div>
                <button className="add-entry-btn">
                  <Plus size={16} />
                  Add Entry
                </button>
              </div>
              <div className="voucher-totals">
                <div className="total-row">
                  <span>Total Debit:</span>
                  <span>₹0.00</span>
                </div>
                <div className="total-row">
                  <span>Total Credit:</span>
                  <span>₹0.00</span>
                </div>
                <div className="total-row difference">
                  <span>Difference:</span>
                  <span>₹0.00</span>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Voucher</button>
              </div>
            </div>
          </div>
        )}

        {/* Financial Reports */}
        {activeTab === 'reports' && (
          <div className="financial-reports">
            <div className="reports-header">
              <div className="report-filters">
                <select>
                  <option>All Reports</option>
                </select>
                <input type="date" />
                <input type="date" />
                <button className="btn-secondary">
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>
            <div className="reports-list">
              {financialReports.map(report => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <h3>{report.title}</h3>
                    <button className="icon-btn">
                      <Download size={16} />
                    </button>
                  </div>
                  <div className="report-sections">
                    {report.sections.map(section => {
                      const sectionKey = `${report.id}-${section.id}`
                      const isExpanded = expandedReports[sectionKey]
                      return (
                        <div key={section.id} className="report-section">
                          <div
                            className="section-header"
                            onClick={() => toggleReportSection(report.id, section.id)}
                          >
                            <span className="expand-icon">
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </span>
                            <span>{section.title}</span>
                            <span className="section-amount">₹0.00</span>
                          </div>
                          {isExpanded && (
                            <div className="section-items">
                              {section.items.map((item, idx) => (
                                <div key={idx} className="section-item">
                                  <span>{item}</span>
                                  <span>₹0.00</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Accounting

