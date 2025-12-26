import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Package, 
  BookOpen, 
  Receipt, 
  FileBarChart, 
  Settings,
  Building2
} from 'lucide-react'
import './Sidebar.css'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/accounts-plus' },
    { id: 'sales', label: 'Sales', icon: ShoppingBag, path: '/accounts-plus/sales' },
    { id: 'purchase', label: 'Purchase', icon: ShoppingCart, path: '/accounts-plus/purchase' },
    { id: 'inventory', label: 'Inventory', icon: Package, path: '/accounts-plus/inventory' },
    { id: 'accounting', label: 'Accounting', icon: BookOpen, path: '/accounts-plus/accounting' },
    { id: 'gst', label: 'GST', icon: Receipt, path: '/accounts-plus/gst' },
    { id: 'reports', label: 'Reports', icon: FileBarChart, path: '/accounts-plus/reports' },
    { id: 'company', label: 'Company Master', icon: Building2, path: '/accounts-plus/company-master' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/accounts-plus/settings' },
  ]

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <aside className="accounts-sidebar">
      <div className="sidebar-header">
        <h2>BillEase</h2>
        <span className="sidebar-subtitle">ACCOUNTS+</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar

