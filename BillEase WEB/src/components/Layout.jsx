import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Package, 
  FileText, 
  Menu,
  X,
  ChevronLeft,
  Home,
  Building2,
  LogOut,
  User,
  Settings,
  ChevronDown
} from 'lucide-react'
import { getModuleFeatures, getModuleTitle } from '../config/moduleFeatures'
import { useApp } from '../context/AppContext'
import CompanySwitcher from './CompanySwitcher'
import './Layout.css'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showFirmSwitcher, setShowFirmSwitcher] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { 
    firms, 
    activeFirm, 
    switchFirm, 
    addFirm, 
    currentUser, 
    logout,
    users,
    addUser,
    updateUser,
    deleteUser
  } = useApp()

  // Authentication disabled for prototyping
  // useEffect(() => {
  //   if (!currentUser && location.pathname !== '/login') {
  //     navigate('/login')
  //   }
  // }, [currentUser, location.pathname, navigate])

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/pos', icon: ShoppingCart, label: 'BillEase POS' },
    { path: '/crm', icon: Users, label: 'CRM' },
    { path: '/income-expense', icon: DollarSign, label: 'Income & Expense' },
    { path: '/invento', icon: Package, label: 'Invento' },
    { path: '/accounts-plus', icon: FileText, label: 'BillEase ACCOUNTS+' },
  ]

  const isActive = (path, exact = false) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const moduleFeatures = getModuleFeatures(location.pathname)
  const moduleTitle = getModuleTitle(location.pathname)
  const isDashboard = location.pathname === '/'

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo-link">
            <h1 className="logo">BillEase Suite</h1>
          </Link>
          <button 
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        {isDashboard ? (
          <nav className="sidebar-nav">
            <div className="nav-section">
              <div className="nav-section-label">Main Menu</div>
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </nav>
        ) : (
          <nav className="sidebar-nav">
            <div className="nav-section">
              <button 
                className="back-to-dashboard"
                onClick={() => navigate('/')}
              >
                <ChevronLeft size={18} />
                {sidebarOpen && <span>Back to Dashboard</span>}
              </button>
              <div className="module-title">
                {sidebarOpen && <span>{moduleTitle}</span>}
              </div>
            </div>
            
            {moduleFeatures && (
              <div className="nav-section">
                <div className="nav-section-label">Features</div>
                {moduleFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <Link
                      key={feature.path}
                      to={feature.path}
                      className={`nav-item feature-item ${isActive(feature.path, feature.exact) ? 'active' : ''}`}
                    >
                      <Icon size={18} />
                      {sidebarOpen && <span>{feature.label}</span>}
                    </Link>
                  )
                })}
              </div>
            )}
          </nav>
        )}
      </aside>
      
      <main className="main-content">
        <header className="top-header">
          <div className="header-content">
            <div>
              <h2 className="page-title">
                {moduleTitle}
              </h2>
              {!isDashboard && (
                <p className="page-subtitle">
                  {moduleFeatures?.find(f => isActive(f.path, f.exact))?.label || 'Overview'}
                </p>
              )}
            </div>
            <div className="header-actions">
              {/* Company Switcher */}
              <CompanySwitcher />
              
              <Link to="/dashboard" className="home-btn">
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
              
              {/* User Menu */}
              {currentUser && (
                <div className="user-menu">
                  <button 
                    className="user-menu-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <User size={18} />
                    <span>{currentUser.name || currentUser.username}</span>
                    <ChevronDown size={16} />
                  </button>
                  {showUserMenu && (
                    <div className="user-menu-dropdown">
                      <div className="user-info">
                        <div className="user-name">{currentUser.name || currentUser.username}</div>
                        <div className="user-role">{currentUser.role}</div>
                      </div>
                      <div className="user-menu-items">
                        <button className="menu-item">
                          <Settings size={16} />
                          Settings
                        </button>
                        <button 
                          className="menu-item"
                          onClick={() => {
                            logout()
                            navigate('/login')
                            setShowUserMenu(false)
                          }}
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
