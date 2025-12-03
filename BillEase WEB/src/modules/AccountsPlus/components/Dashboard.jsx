import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Package, 
  Plus, 
  FileText, 
  ShoppingBag,
  Users,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()

  // Mock data - replace with actual data from your state/API
  const stats = {
    todaySales: 45230,
    monthlySales: 1250000,
    outstandingDues: 85000,
    lowStockItems: 12,
    topItems: [
      { name: 'Product A', sales: 125000, qty: 450 },
      { name: 'Product B', sales: 98000, qty: 320 },
      { name: 'Product C', sales: 75000, qty: 280 },
    ]
  }

  const quickLinks = [
    { label: 'New Invoice', icon: FileText, path: '/accounts-plus/sales', color: '#3b82f6' },
    { label: 'New Purchase', icon: ShoppingBag, path: '/accounts-plus/purchase', color: '#10b981' },
    { label: 'Add Item', icon: Package, path: '/accounts-plus/inventory', color: '#f59e0b' },
    { label: 'Add Customer', icon: Users, path: '/accounts-plus/settings', color: '#8b5cf6' },
  ]

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Today's Sales</p>
            <p className="stat-value">₹{stats.todaySales.toLocaleString()}</p>
            <div className="stat-change positive">
              <ArrowUp size={14} />
              <span>12% from yesterday</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Monthly Sales</p>
            <p className="stat-value">₹{stats.monthlySales.toLocaleString()}</p>
            <div className="stat-change positive">
              <ArrowUp size={14} />
              <span>8% from last month</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Outstanding Dues</p>
            <p className="stat-value">₹{stats.outstandingDues.toLocaleString()}</p>
            <div className="stat-change negative">
              <ArrowDown size={14} />
              <span>5 customers</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
            <Package size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Low Stock Alerts</p>
            <p className="stat-value">{stats.lowStockItems}</p>
            <div className="stat-change">
              <span>Items need attention</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="quick-links-section">
        <h2>Quick Actions</h2>
        <div className="quick-links-grid">
          {quickLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <button
                key={index}
                className="quick-link-card"
                onClick={() => navigate(link.path)}
                style={{ '--link-color': link.color }}
              >
                <div className="quick-link-icon" style={{ background: `${link.color}15`, color: link.color }}>
                  <Icon size={24} />
                </div>
                <span>{link.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Top Items */}
      <div className="top-items-section">
        <h2>Top Selling Items</h2>
        <div className="top-items-list">
          {stats.topItems.map((item, index) => (
            <div key={index} className="top-item-card">
              <div className="top-item-rank">#{index + 1}</div>
              <div className="top-item-info">
                <h3>{item.name}</h3>
                <p>₹{item.sales.toLocaleString()} • {item.qty} units</p>
              </div>
              <div className="top-item-sales">
                <TrendingUp size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

