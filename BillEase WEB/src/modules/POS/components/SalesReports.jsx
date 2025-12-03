import React, { useState } from 'react'
import { BarChart3, Calendar, Download, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react'
import { usePOS } from '../POS'
import '../POS.css'

const SalesReports = () => {
  const { sales, payments, returns } = usePOS()
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  const filteredSales = sales.filter(sale => {
    if (!dateRange.start && !dateRange.end) return true
    const saleDate = sale.date.split('T')[0]
    if (dateRange.start && saleDate < dateRange.start) return false
    if (dateRange.end && saleDate > dateRange.end) return false
    return true
  })

  const getTotalRevenue = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  }

  const getTotalTransactions = () => {
    return filteredSales.length
  }

  const getTotalReturns = () => {
    return returns.filter(ret => {
      if (!dateRange.start && !dateRange.end) return true
      const retDate = ret.date.split('T')[0]
      if (dateRange.start && retDate < dateRange.start) return false
      if (dateRange.end && retDate > dateRange.end) return false
      return true
    }).reduce((sum, ret) => sum + ret.refundAmount, 0)
  }

  const getNetRevenue = () => {
    return getTotalRevenue() - getTotalReturns()
  }

  const getSalesByPaymentMethod = () => {
    const methods = {}
    filteredSales.forEach(sale => {
      methods[sale.paymentMethod] = (methods[sale.paymentMethod] || 0) + sale.total
    })
    return methods
  }

  const getSalesByDay = () => {
    const days = {}
    filteredSales.forEach(sale => {
      const date = sale.date.split('T')[0]
      days[date] = (days[date] || 0) + sale.total
    })
    return days
  }

  const getTopProducts = () => {
    const products = {}
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        products[item.name] = (products[item.name] || 0) + item.quantity
      })
    })
    return Object.entries(products)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)
  }

  const paymentMethods = getSalesByPaymentMethod()
  const salesByDay = getSalesByDay()
  const topProducts = getTopProducts()
  const maxDaySales = Math.max(...Object.values(salesByDay), 1)

  return (
    <div className="pos-container">
      <div className="page-header">
        <h2>Sales Reports</h2>
        <div className="header-actions">
          <button className="action-btn">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="date-range-filter">
          <Calendar size={20} />
          <input
            type="date"
            placeholder="Start Date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          />
          <span>to</span>
          <input
            type="date"
            placeholder="End Date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">₹{getTotalRevenue().toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{getTotalTransactions()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-label">Net Revenue</div>
          <div className="stat-value">₹{getNetRevenue().toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-label">Average Sale</div>
          <div className="stat-value">
            ₹{getTotalTransactions() > 0 ? (getTotalRevenue() / getTotalTransactions()).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Sales by Payment Method</h3>
          <div className="chart-container">
            {Object.keys(paymentMethods).length === 0 ? (
              <p className="no-data">No data available</p>
            ) : (
              <div className="bar-chart">
                {Object.entries(paymentMethods).map(([method, amount]) => {
                  const maxAmount = Math.max(...Object.values(paymentMethods))
                  const percentage = (amount / maxAmount) * 100
                  return (
                    <div key={method} className="bar-item">
                      <div className="bar-label">{method.toUpperCase()}</div>
                      <div className="bar-wrapper">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${percentage}%` }}
                        >
                          <span>₹{amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="report-card">
          <h3>Daily Sales Trend</h3>
          <div className="chart-container">
            {Object.keys(salesByDay).length === 0 ? (
              <p className="no-data">No data available</p>
            ) : (
              <div className="bar-chart">
                {Object.entries(salesByDay).slice(-7).map(([date, amount]) => {
                  const percentage = (amount / maxDaySales) * 100
                  return (
                    <div key={date} className="bar-item">
                      <div className="bar-label">{new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
                      <div className="bar-wrapper">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${percentage}%` }}
                        >
                          <span>₹{amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="report-card">
          <h3>Top Selling Products</h3>
          <div className="chart-container">
            {topProducts.length === 0 ? (
              <p className="no-data">No data available</p>
            ) : (
              <div className="top-products-list">
                {topProducts.map((product, idx) => (
                  <div key={idx} className="product-rank-item">
                    <div className="rank-number">{idx + 1}</div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-qty">{product.qty} units sold</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="report-card">
          <h3>Summary</h3>
          <div className="summary-list">
            <div className="summary-item">
              <span>Total Sales:</span>
              <span>₹{getTotalRevenue().toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Total Returns:</span>
              <span>₹{getTotalReturns().toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Net Revenue:</span>
              <span>₹{getNetRevenue().toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Total Transactions:</span>
              <span>{getTotalTransactions()}</span>
            </div>
            <div className="summary-item">
              <span>Average Transaction:</span>
              <span>₹{getTotalTransactions() > 0 ? (getTotalRevenue() / getTotalTransactions()).toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesReports

