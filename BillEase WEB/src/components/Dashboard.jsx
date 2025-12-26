import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Package, 
  FileText, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  CheckCircle,
  Receipt,
  CreditCard,
  History,
  BarChart,
  Settings,
  UserPlus,
  UserCheck,
  Calendar,
  MessageSquare,
  ArrowUpCircle,
  ArrowDownCircle,
  PieChart,
  Warehouse,
  AlertCircle,
  Building2,
  BookOpen,
  FileCheck,
  Printer,
  FileBarChart,
  PackageSearch,
  Rocket,
  ClipboardList
} from 'lucide-react'
import { useCompany } from '../context/CompanyContext'
import './Dashboard.css'

const Dashboard = () => {
  const { isRegistrationComplete, companies, activeCompany } = useCompany()
  const navigate = useNavigate()
  const hasCompletedRegistration = isRegistrationComplete || 
                                 (companies && companies.length > 0) || 
                                 activeCompany !== null
  const modules = [
    {
      path: '/pos',
      icon: ShoppingCart,
      title: 'BillEase POS',
      description: 'Complete Point of Sale solution for retail businesses with real-time inventory tracking, payment processing, and comprehensive sales management.',
      color: '#2563eb',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      detailedFeatures: [
        { icon: ShoppingCart, text: 'Quick Bill Generation - Create invoices in seconds' },
        { icon: PackageSearch, text: 'Products & Inventory Management - Real-time stock tracking' },
        { icon: Building2, text: 'Entity Management - Manage customers and suppliers' },
        { icon: FileText, text: 'Quotation System - Create and manage quotes' },
        { icon: Receipt, text: 'Sales History - Complete transaction records' },
        { icon: CreditCard, text: 'Payment Processing - Multiple payment methods' },
        { icon: History, text: 'Returns & Refunds - Handle returns efficiently' },
        { icon: BarChart, text: 'Sales Reports & Analytics - Detailed insights' },
        { icon: Settings, text: 'POS Settings - Customize your POS experience' }
      ],
      stats: '1,234 Sales'
    },
    {
      path: '/crm',
      icon: Users,
      title: 'CRM',
      description: 'Customer Relationship Management system to build stronger relationships, track interactions, and grow your customer base effectively.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      detailedFeatures: [
        { icon: Users, text: 'Customer Database - Centralized customer information' },
        { icon: UserPlus, text: 'Add & Manage Customers - Easy customer onboarding' },
        { icon: UserCheck, text: 'Lead Tracking - Convert leads to customers' },
        { icon: Calendar, text: 'Activity Management - Track customer interactions' },
        { icon: MessageSquare, text: 'Communication Logs - Record all communications' },
        { icon: TrendingUp, text: 'Analytics & Insights - Customer behavior analysis' }
      ],
      stats: '456 Customers'
    },
    {
      path: '/income-expense',
      icon: DollarSign,
      title: 'Income & Expense',
      description: 'Track and manage all financial transactions with detailed categorization, reporting, and insights for better financial control.',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      detailedFeatures: [
        { icon: DollarSign, text: 'Financial Overview - Complete financial dashboard' },
        { icon: ArrowUpCircle, text: 'Income Tracking - Record all income sources' },
        { icon: ArrowDownCircle, text: 'Expense Management - Track every expense' },
        { icon: PieChart, text: 'Category Management - Organize by categories' },
        { icon: FileText, text: 'Financial Reports - Comprehensive reports and analytics' }
      ],
      stats: '₹98,500 Revenue'
    },
    {
      path: '/invento',
      icon: Package,
      title: 'Invento',
      description: 'Advanced inventory management system for tracking stock levels, managing warehouses, and ensuring optimal inventory control.',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      detailedFeatures: [
        { icon: Package, text: 'Stock Management - Real-time inventory tracking' },
        { icon: Warehouse, text: 'Warehouses & Branches - Multi-location support' },
        { icon: ClipboardList, text: 'Stock Reports - Detailed inventory reports' },
        { icon: AlertCircle, text: 'Low Stock Alerts - Never run out of stock' }
      ],
      stats: '2,345 Items'
    },
    {
      path: '/accounts-plus',
      icon: FileText,
      title: 'BillEase ACCOUNTS+',
      description: 'Comprehensive accounting solution with complete master data setup, tax compliance, financial reporting, and advanced accounting features.',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      detailedFeatures: [
        { icon: Building2, text: 'Company Setup - Complete company configuration' },
        { icon: BookOpen, text: 'Chart of Accounts - Manage all accounts' },
        { icon: Users, text: 'Customers & Suppliers - Party management' },
        { icon: Package, text: 'Items Master - Product and service management' },
        { icon: DollarSign, text: 'Expense/Income Heads - Financial categorization' },
        { icon: DollarSign, text: 'Opening Balances - Set initial balances' },
        { icon: FileCheck, text: 'Tax & Compliance - GST and tax management' },
        { icon: Receipt, text: 'Sales/Billing/Purchases - Complete billing system' },
        { icon: Printer, text: 'Document Layout - Customize invoice layouts' },
        { icon: FileText, text: 'Visual Designer - Design custom documents' },
        { icon: FileBarChart, text: 'Financial Reports - Comprehensive reporting' },
        { icon: FileCheck, text: 'Receivables/Payables - Track outstanding amounts' },
        { icon: Package, text: 'Project Accounting - Project-wise tracking' },
        { icon: FileBarChart, text: 'Dashboard - Financial overview' }
      ],
      stats: 'All Systems Active'
    },
  ]


  const stats = [
    { label: 'Total Sales', value: '₹1,25,000', change: '+12%', icon: TrendingUp, color: '#2563eb' },
    { label: 'Customers', value: '1,234', change: '+8%', icon: Users, color: '#10b981' },
    { label: 'Products', value: '456', change: '+5%', icon: Package, color: '#8b5cf6' },
    { label: 'Revenue', value: '₹98,500', change: '+15%', icon: DollarSign, color: '#f59e0b' },
  ]

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>
              <Sparkles size={32} className="sparkle-icon" />
              Welcome to BillEase Suite
            </h1>
            <p>Your comprehensive business management solution - Everything you need to run your business efficiently</p>
          </div>
          <div className="header-badges">
            <div className="badge-item">
              <Zap size={16} />
              <span>Fast & Reliable</span>
            </div>
            <div className="badge-item">
              <Shield size={16} />
              <span>Secure</span>
            </div>
            <div className="badge-item">
              <BarChart3 size={16} />
              <span>Analytics Ready</span>
            </div>
          </div>
        </div>
      </div>


      {/* Stats Section */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ background: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-change positive">
                  <TrendingUp size={14} />
                  {stat.change}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Get Started CTA Section - Show only if not registered */}
      {!hasCompletedRegistration && (
        <div className="get-started-section">
          <div className="get-started-card">
            <div className="get-started-icon">
              <Rocket size={64} />
            </div>
            <h2 className="get-started-title">Ready to Get Started?</h2>
            <p className="get-started-description">
              Set up your company details to unlock all the powerful features of BillEase Suite
            </p>
            <button 
              className="get-started-btn"
              onClick={() => navigate('/register')}
            >
              <Building2 size={20} />
              <span>Set Up Your Company</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Modules Section with Detailed Features */}
      <div className="modules-section">
        <h2 className="section-title">Business Modules & Features</h2>
        <p className="section-subtitle">Explore the powerful tools designed to streamline your business operations</p>
        <div className="modules-grid">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <div key={module.path} className="module-card-detailed">
                <div className="module-header">
                  <div className="module-icon-wrapper" style={{ background: module.gradient }}>
                    <Icon size={32} />
                  </div>
                  <div className="module-badge">{module.stats}</div>
                </div>
                <div className="module-content">
                  <h3>{module.title}</h3>
                  <p className="module-description">{module.description}</p>
                  <div className="module-features-detailed">
                    <h4 className="features-title">Key Features:</h4>
                    <ul className="features-list">
                      {module.detailedFeatures.map((feature, idx) => {
                        const FeatureIcon = feature.icon
                        return (
                          <li key={idx}>
                            <FeatureIcon size={18} />
                            <span>{feature.text}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
                <div className="module-footer">
                  {hasCompletedRegistration ? (
                    <Link to={module.path} className="module-link">
                      Open {module.title}
                      <ArrowRight size={18} />
                    </Link>
                  ) : (
                    <button 
                      className="module-link"
                      onClick={() => navigate('/register')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      Set Up Company to Access
                      <ArrowRight size={18} />
                    </button>
                  )}
                </div>
                <div className="module-hover-effect" style={{ background: module.gradient }}></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
