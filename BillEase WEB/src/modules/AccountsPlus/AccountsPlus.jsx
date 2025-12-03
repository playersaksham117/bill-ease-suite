import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import SalesInvoice from './components/SalesInvoice'
import Inventory from './components/Inventory'
import Accounting from './components/Accounting'
import DocumentDesigner from './components/DocumentDesigner'
import CompanyMaster from './components/CompanyMaster'
import UserManagement from './components/UserManagement'
import { 
  Building2, 
  History, 
  BookOpen, 
  Users, 
  Package, 
  DollarSign, 
  Receipt, 
  Printer,
  ShoppingBag,
  Truck,
  Repeat,
  Percent,
  Wallet,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  FileText,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  Banknote,
  QrCode,
  FileBarChart,
  Mail,
  ScanLine,
  Palette,
  Zap,
  TrendingUp,
  FileCheck,
  PackageSearch,
  Layout,
  ArrowDown,
  ArrowUp,
  Calculator,
  ChefHat,
  Boxes,
  Settings2,
  Receipt as ReceiptText,
  TrendingDown,
  PieChart,
  BarChart3,
  FileSpreadsheet,
  FileBarChart2,
  Calculator as CalcIcon,
  Building,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react'
import './AccountsPlus.css'
import { 
  generateProfitLoss, 
  generateBalanceSheet, 
  generateTrialBalance,
  generateSalesReport,
  generatePurchaseReport,
  generateAgedReceivables,
  generateAgedPayables,
  generateHSNReport,
  generateInventoryValuation,
  exportReportToCSV
} from '../../utils/reportGenerator'
import { 
  calculateSalary, 
  calculatePF, 
  calculateESI, 
  calculateTDS,
  generatePayslip 
} from '../../utils/payrollCalculator'
import ImportExport from '../../components/ImportExport'

// Billing Section Component - defined before AccountsPlus to avoid hoisting issues
const BillingSection = () => {
  const [activeBillingTab, setActiveBillingTab] = useState('sales')
  return <div>Billing Section - To be implemented</div>
}

// Payroll Employee Modal Component - defined before AccountsPlus to avoid hoisting issues
const PayrollEmployeeModal = ({ 
  showPayrollModal, 
  setShowPayrollModal, 
  selectedEmployee, 
  setSelectedEmployee, 
  employeeForm, 
  setEmployeeForm, 
  employees, 
  setEmployees 
}) => {
  if (!showPayrollModal) return null
  
  return (
    <div className="modal-overlay" onClick={() => setShowPayrollModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{selectedEmployee ? 'Edit Employee' : 'Add Employee'}</h3>
          <button className="close-btn" onClick={() => setShowPayrollModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <p>Payroll Employee form - To be implemented</p>
        </div>
      </div>
    </div>
  )
}

const AccountsPlus = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Map URL paths to tab IDs
  const pathToTabMap = {
    '/accounts-plus': 'company',
    '/accounts-plus/ledgers': 'ledgers',
    '/accounts-plus/parties': 'parties',
    '/accounts-plus/items': 'items',
    '/accounts-plus/heads': 'heads',
    '/accounts-plus/tax': 'tax',
    '/accounts-plus/billing': 'billing',
    '/accounts-plus/layout': 'layout',
    '/accounts-plus/reports': 'reports',
    '/accounts-plus/opening-balances': 'openingBalances',
    '/accounts-plus/integrations': 'integrations',
    '/accounts-plus/visual-designer': 'visualDesigner',
    '/accounts-plus/auto-posting': 'autoPosting',
    '/accounts-plus/receivables-payables': 'receivablesPayables',
    '/accounts-plus/dashboard': 'dashboard',
    '/accounts-plus/projects': 'projects',
  }
  
  // Get active tab from URL or default to 'company'
  const getActiveTabFromPath = (pathname) => {
    return pathToTabMap[pathname] || 'company'
  }
  
  const [activeTab, setActiveTab] = useState(() => getActiveTabFromPath(location.pathname))
  
  // Sync tab with URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(location.pathname))
  }, [location.pathname])
  
  // Company Setup State
  const [companyData, setCompanyData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    website: '',
    gstin: '',
    pan: '',
    businessType: '',
    openingPeriod: '',
    accountingYear: ''
  })

  // Audit Trail State
  const [auditTrail, setAuditTrail] = useState([
    { id: 1, user: 'Admin', action: 'Login', timestamp: '2024-01-20 10:30:00', ip: '192.168.1.1' },
    { id: 2, user: 'Admin', action: 'Updated Company Details', timestamp: '2024-01-20 10:35:00', ip: '192.168.1.1' },
    { id: 3, user: 'Manager', action: 'Created Ledger', timestamp: '2024-01-20 11:00:00', ip: '192.168.1.2' },
  ])

  // Chart of Accounts State
  const [ledgers, setLedgers] = useState([
    { id: 1, name: 'Cash', type: 'Asset', openingBalance: 50000, parentGroup: 'Current Assets' },
    { id: 2, name: 'Bank Account', type: 'Asset', openingBalance: 200000, parentGroup: 'Current Assets' },
    { id: 3, name: 'Sales', type: 'Income', openingBalance: 0, parentGroup: 'Revenue' },
    { id: 4, name: 'Purchase', type: 'Expense', openingBalance: 0, parentGroup: 'Expenses' },
  ])
  const [showLedgerModal, setShowLedgerModal] = useState(false)
  const [ledgerForm, setLedgerForm] = useState({
    name: '',
    type: 'Asset',
    openingBalance: 0,
    parentGroup: ''
  })

  // Customers & Suppliers State
  const [customers, setCustomers] = useState([
    { id: 1, name: 'ABC Corp', type: 'Customer', address: 'Mumbai', contact: '9876543210', gstin: '27ABCDE1234F1Z5', creditLimit: 100000, openingBalance: 50000, classification: 'Domestic' },
    { id: 2, name: 'XYZ Ltd', type: 'Customer', address: 'Delhi', contact: '9876543211', gstin: '07ABCDE1234F1Z6', creditLimit: 200000, openingBalance: 0, classification: 'Interstate' },
  ])
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Supplier One', type: 'Supplier', address: 'Bangalore', contact: '9876543212', gstin: '29ABCDE1234F1Z7', creditLimit: 150000, openingBalance: 30000, classification: 'Regular' },
  ])
  const [showPartyModal, setShowPartyModal] = useState(false)
  const [partyForm, setPartyForm] = useState({
    name: '',
    type: 'Customer',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contact: '',
    email: '',
    gstin: '',
    pan: '',
    creditLimit: 0,
    openingBalance: 0,
    classification: 'Domestic'
  })

  // Items/Inventory State
  const [items, setItems] = useState([
    { id: 1, code: 'ITM001', name: 'Product A', hsn: '8471', uom: 'PCS', rate: 1000, costPrice: 800, reorderLevel: 50, category: 'Electronics', brand: 'Brand X', group: 'Group 1', openingStock: 100, openingValue: 80000 },
    { id: 2, code: 'ITM002', name: 'Product B', hsn: '8471', uom: 'PCS', rate: 2000, costPrice: 1500, reorderLevel: 30, category: 'Electronics', brand: 'Brand Y', group: 'Group 1', openingStock: 50, openingValue: 75000 },
  ])
  const [showItemModal, setShowItemModal] = useState(false)
  const [itemForm, setItemForm] = useState({
    code: '',
    name: '',
    hsn: '',
    sac: '',
    uom: 'PCS',
    rate: 0,
    costPrice: 0,
    reorderLevel: 0,
    category: '',
    brand: '',
    group: '',
    openingStock: 0,
    openingValue: 0
  })

  // Stock Transactions State
  const [stockTransactions, setStockTransactions] = useState([])
  const [showStockModal, setShowStockModal] = useState(false)
  const [stockForm, setStockForm] = useState({ type: 'in', itemId: '', quantity: 0, rate: 0, reference: '', date: new Date().toISOString().split('T')[0] })
  
  // BOM/Recipe State
  const [boms, setBoms] = useState([])
  const [showBOMModal, setShowBOMModal] = useState(false)
  const [bomForm, setBomForm] = useState({ code: '', finishedProduct: '', components: [], quantity: 1 })
  
  // Vouchers State
  const [vouchers, setVouchers] = useState([])
  const [showVoucherModal, setShowVoucherModal] = useState(false)
  const [voucherForm, setVoucherForm] = useState({ type: 'payment', date: new Date().toISOString().split('T')[0], account: '', amount: 0, narration: '', autoPost: true })
  
  // Bank Reconciliation State
  const [bankStatements, setBankStatements] = useState([])
  const [bankLedgers, setBankLedgers] = useState([])
  const [showBankReconModal, setShowBankReconModal] = useState(false)
  const [reconciledTransactions, setReconciledTransactions] = useState([])
  
  // GSTR State
  const [gstrData, setGstrData] = useState({ period: '', gstr1: [], gstr2: [], gstr3: [] })
  const [showGSTRModal, setShowGSTRModal] = useState(false)
  
  // ITR State
  const [itrData, setItrData] = useState({ formType: 'ITR-1', assessmentYear: '', data: {} })
  const [showITRModal, setShowITRModal] = useState(false)
  
  // TDS State
  const [tdsData, setTdsData] = useState({ formType: '24Q', quarter: '', data: [] })
  const [showTDSModal, setShowTDSModal] = useState(false)
  
  // Payroll State
  const [employees, setEmployees] = useState([])
  const [payrollData, setPayrollData] = useState({ month: '', year: '', employees: [] })
  const [showPayrollModal, setShowPayrollModal] = useState(false)
  const [payrollActiveTab, setPayrollActiveTab] = useState('employees')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [salaryCalculation, setSalaryCalculation] = useState(null)
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    employeeId: '',
    department: '',
    designation: '',
    basicSalary: 0,
    hra: 0,
    transport: 0,
    medical: 0,
    special: 0,
    pfRate: 12,
    esiRate: 0.75,
    totalLeaves: 12,
    leavesTaken: 0
  })
  
  // Inventory Tab State
  const [inventoryTab, setInventoryTab] = useState('master')

  // Expense/Income Heads State
  const [expenseHeads, setExpenseHeads] = useState([
    { id: 1, name: 'Office Rent', type: 'Expense', ledger: 'Rent Expense', recurring: true },
    { id: 2, name: 'Salary', type: 'Expense', ledger: 'Salary Expense', recurring: true },
  ])
  const [incomeHeads, setIncomeHeads] = useState([
    { id: 1, name: 'Service Income', type: 'Income', ledger: 'Service Revenue', recurring: false },
  ])
  const [showHeadModal, setShowHeadModal] = useState(false)
  const [headForm, setHeadForm] = useState({
    name: '',
    type: 'Expense',
    ledger: '',
    recurring: false
  })

  // Tax & Compliance State
  const [taxSetup, setTaxSetup] = useState({
    gstIntraState: { enabled: true, slabs: [{ id: 1, name: 'GST 18%', rate: 18, applicableTo: 'All Items' }] },
    gstInterState: { enabled: true, slabs: [{ id: 1, name: 'IGST 18%', rate: 18, applicableTo: 'All Items' }] },
    vat: { enabled: false, slabs: [] },
    tds: { enabled: false, slabs: [] },
    tcs: { enabled: false, slabs: [] },
    exportImport: { withLUT: false, withoutLUT: true }
  })
  const [showTaxModal, setShowTaxModal] = useState(false)
  const [taxForm, setTaxForm] = useState({
    type: 'GST IntraState',
    name: '',
    rate: 0,
    applicableTo: 'All Items'
  })

  // Document Layout State
  const [docLayout, setDocLayout] = useState({
    paperSize: 'A4',
    printer: 'Default',
    invoiceTemplate: 'Standard',
    quoteTemplate: 'Standard',
    challanTemplate: 'Standard',
    barcodeEnabled: false,
    labelPrintEnabled: false,
    orientation: 'Portrait',
    margins: { top: 10, bottom: 10, left: 10, right: 10 },
    fontSize: 12,
    fontFamily: 'Arial',
    colorMode: 'Color',
    copies: 1,
    duplex: false,
    paperSource: 'Auto',
    printQuality: 'High'
  })

  const tabs = [
    { id: 'company', label: 'Company Setup', icon: Building2, path: '/accounts-plus' },
    { id: 'audit', label: 'Audit Trail', icon: History, path: '/accounts-plus' },
    { id: 'ledgers', label: 'Chart of Accounts', icon: BookOpen, path: '/accounts-plus/ledgers' },
    { id: 'parties', label: 'Customers & Suppliers', icon: Users, path: '/accounts-plus/parties' },
    { id: 'items', label: 'Items/Inventory', icon: Package, path: '/accounts-plus/items' },
    { id: 'heads', label: 'Expense/Income Heads', icon: DollarSign, path: '/accounts-plus/heads' },
    { id: 'openingBalances', label: 'Opening Balances', icon: DollarSign, path: '/accounts-plus/opening-balances' },
    { id: 'tax', label: 'Tax & Compliance', icon: Receipt, path: '/accounts-plus/tax' },
    { id: 'billing', label: 'Sales / Billing', icon: Receipt, path: '/accounts-plus/billing' },
    { id: 'layout', label: 'Document Layout', icon: Printer, path: '/accounts-plus/layout' },
    { id: 'visualDesigner', label: 'Visual Designer', icon: Palette, path: '/accounts-plus/visual-designer' },
    { id: 'integrations', label: 'Integrations', icon: Zap, path: '/accounts-plus/integrations' },
    { id: 'autoPosting', label: 'Auto Posting', icon: Zap, path: '/accounts-plus/auto-posting' },
    { id: 'receivablesPayables', label: 'Receivables/Payables', icon: FileCheck, path: '/accounts-plus/receivables-payables' },
    { id: 'projects', label: 'Project Accounting', icon: PackageSearch, path: '/accounts-plus/projects' },
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, path: '/accounts-plus/dashboard' },
    { id: 'vouchers', label: 'Vouchers', icon: ReceiptText, path: '/accounts-plus/vouchers' },
    { id: 'bankReconciliation', label: 'Bank Reconciliation', icon: Banknote, path: '/accounts-plus/bank-reconciliation' },
    { id: 'gstr', label: 'GSTR & E-Invoice', icon: FileCheck, path: '/accounts-plus/gstr' },
    { id: 'itr', label: 'ITR & Tax Audit', icon: FileSpreadsheet, path: '/accounts-plus/itr' },
    { id: 'tds', label: 'TDS/TCS Returns', icon: FileBarChart2, path: '/accounts-plus/tds' },
    { id: 'payroll', label: 'Payroll', icon: Users, path: '/accounts-plus/payroll' },
    { id: 'reports', label: 'Financial Reports', icon: FileBarChart, path: '/accounts-plus/reports' },
  ]
  
  const handleTabChange = (tabId, path) => {
    setActiveTab(tabId)
    navigate(path)
  }

  const handleCompanySave = (e) => {
    e.preventDefault()
    alert('Company details saved successfully!')
  }

  const handleLedgerSave = (e) => {
    e.preventDefault()
    const newLedger = {
      id: Date.now(),
      ...ledgerForm
    }
    setLedgers([...ledgers, newLedger])
    setShowLedgerModal(false)
    setLedgerForm({ name: '', type: 'Asset', openingBalance: 0, parentGroup: '' })
  }

  const handlePartySave = (e) => {
    e.preventDefault()
    const newParty = {
      id: Date.now(),
      ...partyForm
    }
    if (partyForm.type === 'Customer') {
      setCustomers([...customers, newParty])
    } else {
      setSuppliers([...suppliers, newParty])
    }
    setShowPartyModal(false)
    setPartyForm({
      name: '', type: 'Customer', address: '', city: '', state: '', pincode: '',
      contact: '', email: '', gstin: '', pan: '', creditLimit: 0, openingBalance: 0, classification: 'Domestic'
    })
  }

  const handleItemSave = (e) => {
    e.preventDefault()
    const newItem = {
      id: Date.now(),
      ...itemForm
    }
    setItems([...items, newItem])
    setShowItemModal(false)
    setItemForm({
      code: '', name: '', hsn: '', sac: '', uom: 'PCS', rate: 0, costPrice: 0,
      reorderLevel: 0, category: '', brand: '', group: '', openingStock: 0, openingValue: 0
    })
  }

  const handleHeadSave = (e) => {
    e.preventDefault()
    const newHead = {
      id: Date.now(),
      ...headForm
    }
    if (headForm.type === 'Expense') {
      setExpenseHeads([...expenseHeads, newHead])
    } else {
      setIncomeHeads([...incomeHeads, newHead])
    }
    setShowHeadModal(false)
    setHeadForm({ name: '', type: 'Expense', ledger: '', recurring: false })
  }

  const handleTaxSave = (e) => {
    e.preventDefault()
    alert('Tax configuration saved!')
    setShowTaxModal(false)
  }

  const handleDocLayoutSave = (e) => {
    e.preventDefault()
    alert('Document layout preferences saved!')
  }

  return (
    <div className="accounts-plus-wrapper">
      <Sidebar />
      <main className="accounts-plus-main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<SalesInvoice />} />
          <Route path="/purchase" element={<div className="accounts-plus-container"><h2>Purchase</h2></div>} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/gst" element={<div className="accounts-plus-container"><h2>GST</h2></div>} />
          <Route path="/reports" element={<div className="accounts-plus-container"><h2>Reports</h2></div>} />
          <Route path="/settings" element={<div className="accounts-plus-container"><h2>Settings</h2></div>} />
          <Route path="/company-master" element={<CompanyMaster />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/document-designer" element={<DocumentDesigner />} />
          <Route path="*" element={
            <div className="accounts-plus-container">
              <div className="accounts-header">
                <h2>BillEase ACCOUNTS+ - Setup / Master Data</h2>
              </div>

              <div className="tabs-container">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => handleTabChange(tab.id, tab.path)}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="tab-content">
        {/* Company Setup */}
        {activeTab === 'company' && (
          <div className="setup-section">
            <h3>Company / Firm Setup</h3>
            <form onSubmit={handleCompanySave}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Company Name *</label>
          <input
            type="text"
                    required
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
          />
        </div>
                <div className="form-group">
                  <label>Business Type *</label>
                  <select
                    required
                    value={companyData.businessType}
                    onChange={(e) => setCompanyData({ ...companyData, businessType: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="dealer">Dealer</option>
                    <option value="distributor">Distributor</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="retailer">Retailer</option>
                  </select>
      </div>
                <div className="form-group full-width">
                  <label>Address *</label>
                  <textarea
                    required
                    value={companyData.address}
                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    required
                    value={companyData.city}
                    onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    required
                    value={companyData.state}
                    onChange={(e) => setCompanyData({ ...companyData, state: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    required
                    value={companyData.pincode}
                    onChange={(e) => setCompanyData({ ...companyData, pincode: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    required
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>GSTIN</label>
                  <input
                    type="text"
                    value={companyData.gstin}
                    onChange={(e) => setCompanyData({ ...companyData, gstin: e.target.value.toUpperCase() })}
                    placeholder="29ABCDE1234F1Z5"
                  />
                </div>
                <div className="form-group">
                  <label>PAN</label>
                  <input
                    type="text"
                    value={companyData.pan}
                    onChange={(e) => setCompanyData({ ...companyData, pan: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                  />
                </div>
                <div className="form-group">
                  <label>Opening Financial Period *</label>
                  <input
                    type="month"
                    required
                    value={companyData.openingPeriod}
                    onChange={(e) => setCompanyData({ ...companyData, openingPeriod: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Accounting Year *</label>
                  <input
                    type="text"
                    required
                    value={companyData.accountingYear}
                    onChange={(e) => setCompanyData({ ...companyData, accountingYear: e.target.value })}
                    placeholder="2024-25"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  <Save size={18} />
                  Save Company Details
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Audit Trail */}
        {activeTab === 'audit' && (
          <div className="setup-section">
            <h3>Audit Trail / Login History</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Timestamp</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {auditTrail.map(entry => (
                    <tr key={entry.id}>
                      <td>{entry.user}</td>
                      <td>{entry.action}</td>
                      <td>{entry.timestamp}</td>
                      <td>{entry.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
              </div>
        )}

        {/* Chart of Accounts */}
        {activeTab === 'ledgers' && (
          <div className="setup-section">
            <div className="section-header">
              <h3>Chart of Accounts / Ledgers</h3>
              <button className="add-btn" onClick={() => setShowLedgerModal(true)}>
                <Plus size={18} />
                Add Ledger
                </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ledger Name</th>
                    <th>Type</th>
                    <th>Parent Group</th>
                    <th>Opening Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgers.map(ledger => (
                    <tr key={ledger.id}>
                      <td>{ledger.name}</td>
                      <td><span className="badge">{ledger.type}</span></td>
                      <td>{ledger.parentGroup}</td>
                      <td>₹{ledger.openingBalance.toLocaleString()}</td>
                      <td>
                        <button className="icon-btn" title="Edit">
                          <Edit size={16} />
                </button>
                        <button className="icon-btn danger" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

            {showLedgerModal && (
              <div className="modal-overlay" onClick={() => setShowLedgerModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Add New Ledger</h3>
                    <button className="close-btn" onClick={() => setShowLedgerModal(false)}>
                      <X size={20} />
                    </button>
            </div>
                  <form onSubmit={handleLedgerSave}>
                    <div className="form-group">
                      <label>Ledger Name *</label>
                      <input
                        type="text"
                        required
                        value={ledgerForm.name}
                        onChange={(e) => setLedgerForm({ ...ledgerForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Type *</label>
                      <select
                        required
                        value={ledgerForm.type}
                        onChange={(e) => setLedgerForm({ ...ledgerForm, type: e.target.value })}
                      >
                        <option value="Asset">Asset</option>
                        <option value="Liability">Liability</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                        <option value="Equity">Equity</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Parent Group</label>
                      <input
                        type="text"
                        value={ledgerForm.parentGroup}
                        onChange={(e) => setLedgerForm({ ...ledgerForm, parentGroup: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Opening Balance</label>
                      <input
                        type="number"
                        step="0.01"
                        value={ledgerForm.openingBalance}
                        onChange={(e) => setLedgerForm({ ...ledgerForm, openingBalance: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-actions">
                      <button type="button" onClick={() => setShowLedgerModal(false)}>Cancel</button>
                      <button type="submit">Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customers & Suppliers */}
        {activeTab === 'parties' && (
          <div className="setup-section">
            <div className="section-header">
              <h3>Customers & Suppliers (Debtors / Creditors)</h3>
              <button className="add-btn" onClick={() => setShowPartyModal(true)}>
                <Plus size={18} />
                Add Party
              </button>
            </div>
            <div className="tabs-inner">
              <button
                className={`tab-inner ${partyForm.type === 'Customer' ? 'active' : ''}`}
                onClick={() => setPartyForm({ ...partyForm, type: 'Customer' })}
              >
                Customers
              </button>
              <button
                className={`tab-inner ${partyForm.type === 'Supplier' ? 'active' : ''}`}
                onClick={() => setPartyForm({ ...partyForm, type: 'Supplier' })}
              >
                Suppliers
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>GSTIN</th>
                    <th>Credit Limit</th>
                    <th>Opening Balance</th>
                    <th>Classification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(partyForm.type === 'Customer' ? customers : suppliers).map(party => (
                    <tr key={party.id}>
                      <td>{party.name}</td>
                      <td>{party.address}</td>
                      <td>{party.contact}</td>
                      <td>{party.gstin}</td>
                      <td>₹{party.creditLimit.toLocaleString()}</td>
                      <td>₹{party.openingBalance.toLocaleString()}</td>
                      <td><span className="badge">{party.classification}</span></td>
                      <td>
                        <button className="icon-btn" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="icon-btn danger" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
        </div>

            {showPartyModal && (
              <div className="modal-overlay" onClick={() => setShowPartyModal(false)}>
                <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Add New {partyForm.type}</h3>
                    <button className="close-btn" onClick={() => setShowPartyModal(false)}>
                      <X size={20} />
                    </button>
      </div>
                  <form onSubmit={handlePartySave}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Name *</label>
                        <input
                          type="text"
                          required
                          value={partyForm.name}
                          onChange={(e) => setPartyForm({ ...partyForm, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Type *</label>
                        <select
                          required
                          value={partyForm.type}
                          onChange={(e) => setPartyForm({ ...partyForm, type: e.target.value })}
                        >
                          <option value="Customer">Customer</option>
                          <option value="Supplier">Supplier</option>
                        </select>
                      </div>
                      <div className="form-group full-width">
                        <label>Address *</label>
                        <textarea
                          required
                          value={partyForm.address}
                          onChange={(e) => setPartyForm({ ...partyForm, address: e.target.value })}
                          rows="2"
                        />
                      </div>
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          value={partyForm.city}
                          onChange={(e) => setPartyForm({ ...partyForm, city: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input
                          type="text"
                          value={partyForm.state}
                          onChange={(e) => setPartyForm({ ...partyForm, state: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Pincode</label>
                        <input
                          type="text"
                          value={partyForm.pincode}
                          onChange={(e) => setPartyForm({ ...partyForm, pincode: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Contact *</label>
                        <input
                          type="tel"
                          required
                          value={partyForm.contact}
                          onChange={(e) => setPartyForm({ ...partyForm, contact: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={partyForm.email}
                          onChange={(e) => setPartyForm({ ...partyForm, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>GSTIN</label>
                        <input
                          type="text"
                          value={partyForm.gstin}
                          onChange={(e) => setPartyForm({ ...partyForm, gstin: e.target.value.toUpperCase() })}
                        />
                      </div>
                      <div className="form-group">
                        <label>PAN</label>
                        <input
                          type="text"
                          value={partyForm.pan}
                          onChange={(e) => setPartyForm({ ...partyForm, pan: e.target.value.toUpperCase() })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Credit Limit</label>
                        <input
                          type="number"
                          value={partyForm.creditLimit}
                          onChange={(e) => setPartyForm({ ...partyForm, creditLimit: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Opening Balance</label>
                        <input
                          type="number"
                          step="0.01"
                          value={partyForm.openingBalance}
                          onChange={(e) => setPartyForm({ ...partyForm, openingBalance: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Classification</label>
                        <select
                          value={partyForm.classification}
                          onChange={(e) => setPartyForm({ ...partyForm, classification: e.target.value })}
                        >
                          <option value="Domestic">Domestic</option>
                          <option value="Interstate">Interstate</option>
                          <option value="Regular">Regular</option>
                          <option value="OEM">OEM</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="button" onClick={() => setShowPartyModal(false)}>Cancel</button>
                      <button type="submit">Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Items/Inventory */}
        {activeTab === 'items' && (
          <div className="setup-section">
            <div className="inventory-tabs">
              <button className={`sub-tab ${inventoryTab === 'master' ? 'active' : ''}`} onClick={() => setInventoryTab('master')}>Items Master</button>
              <button className={`sub-tab ${inventoryTab === 'stock' ? 'active' : ''}`} onClick={() => setInventoryTab('stock')}>Stock In/Out</button>
              <button className={`sub-tab ${inventoryTab === 'valuation' ? 'active' : ''}`} onClick={() => setInventoryTab('valuation')}>Stock Valuation</button>
              <button className={`sub-tab ${inventoryTab === 'barcode' ? 'active' : ''}`} onClick={() => setInventoryTab('barcode')}>Barcode Printing</button>
              <button className={`sub-tab ${inventoryTab === 'bom' ? 'active' : ''}`} onClick={() => setInventoryTab('bom')}>Production/BOM</button>
            </div>
            
            {/* Items Master Tab */}
            <div className={`tab-panel ${inventoryTab === 'master' ? 'active' : ''}`}>
            <div className="section-header">
              <h3>Items / Inventory Master</h3>
              <button className="add-btn" onClick={() => setShowItemModal(true)}>
                <Plus size={18} />
                    Add Item
                  </button>
                </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>HSN/SAC</th>
                    <th>UOM</th>
                    <th>Rate</th>
                    <th>Cost Price</th>
                    <th>Reorder Level</th>
                    <th>Category</th>
                    <th>Opening Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td>{item.code}</td>
                      <td>{item.name}</td>
                      <td>{item.hsn || item.sac}</td>
                      <td>{item.uom}</td>
                      <td>₹{item.rate.toLocaleString()}</td>
                      <td>₹{item.costPrice.toLocaleString()}</td>
                      <td>{item.reorderLevel}</td>
                      <td>{item.category}</td>
                      <td>{item.openingStock}</td>
                      <td>
                        <button className="icon-btn" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="icon-btn danger" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>

            {/* Stock In/Out Tab */}
            <div className={`tab-panel ${inventoryTab === 'stock' ? 'active' : ''}`}>
              <div className="section-header">
                <h3>Stock In / Stock Out Transactions</h3>
                <div>
                  <button className="add-btn" style={{ marginRight: '0.5rem' }} onClick={() => {
                    setStockForm({...stockForm, type: 'in'})
                    setShowStockModal(true)
                  }}>
                    <ArrowUp size={18} />
                    Stock In
                  </button>
                  <button className="add-btn" onClick={() => {
                    setStockForm({...stockForm, type: 'out'})
                    setShowStockModal(true)
                  }}>
                    <ArrowDown size={18} />
                    Stock Out
                  </button>
                </div>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Amount</th>
                      <th>Reference</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                          No stock transactions found. Click "Stock In" or "Stock Out" to create transactions.
                        </td>
                      </tr>
                    ) : (
                      stockTransactions.map(transaction => {
                        const item = items.find(i => i.id.toString() === transaction.itemId)
                        return (
                          <tr key={transaction.id}>
                            <td>{transaction.date}</td>
                            <td>
                              <span className={`transaction-type-badge ${transaction.type}`}>
                                {transaction.type === 'in' ? 'STOCK IN' : 'STOCK OUT'}
                              </span>
                            </td>
                            <td>{item?.code || 'N/A'}</td>
                            <td>{item?.name || 'N/A'}</td>
                            <td>{transaction.quantity}</td>
                            <td>₹{transaction.rate.toLocaleString()}</td>
                            <td>₹{transaction.amount.toLocaleString()}</td>
                            <td>{transaction.reference || 'N/A'}</td>
                            <td>
                              <button className="icon-btn"><Edit size={16} /></button>
                              <button className="icon-btn"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stock Valuation Tab */}
            <div className={`tab-panel ${inventoryTab === 'valuation' ? 'active' : ''}`}>
              <div className="section-header">
                <h3>Stock Valuation & Closing Stock</h3>
                <button className="add-btn">
                  <Calculator size={18} />
                  Calculate Valuation
                </button>
              </div>
              <div className="stats-grid" style={{ marginTop: '1rem' }}>
                <div className="stat-card">
                  <div className="stat-label">Total Stock Value</div>
                  <div className="stat-value">₹{items.reduce((sum, item) => sum + (item.openingStock * item.costPrice), 0).toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Items</div>
                  <div className="stat-value">{items.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Low Stock Items</div>
                  <div className="stat-value">{items.filter(item => item.openingStock <= item.reorderLevel).length}</div>
                </div>
              </div>
              <div className="table-container" style={{ marginTop: '2rem' }}>
                <h4>Stock Valuation Report</h4>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Opening Stock</th>
                      <th>Stock In</th>
                      <th>Stock Out</th>
                      <th>Closing Stock</th>
                      <th>Cost Price</th>
                      <th>Stock Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const stockIn = stockTransactions.filter(t => t.itemId === item.id.toString() && t.type === 'in').reduce((sum, t) => sum + t.quantity, 0)
                      const stockOut = stockTransactions.filter(t => t.itemId === item.id.toString() && t.type === 'out').reduce((sum, t) => sum + t.quantity, 0)
                      const closingStock = item.openingStock + stockIn - stockOut
                      return (
                        <tr key={item.id}>
                          <td>{item.code}</td>
                          <td>{item.name}</td>
                          <td>{item.openingStock}</td>
                          <td>{stockIn}</td>
                          <td>{stockOut}</td>
                          <td>{closingStock}</td>
                          <td>₹{item.costPrice.toLocaleString()}</td>
                          <td>₹{(closingStock * item.costPrice).toLocaleString()}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Barcode Printing Tab */}
            <div className={`tab-panel ${inventoryTab === 'barcode' ? 'active' : ''}`}>
              <div className="section-header">
                <h3>Barcode Printing & Configuration</h3>
                <button className="add-btn">
                  <QrCode size={18} />
                  Print Barcodes
                </button>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Barcode Type</label>
                  <select>
                    <option>EAN-13</option>
                    <option>Code 128</option>
                    <option>QR Code</option>
                    <option>Data Matrix</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Printer Type</label>
                  <select>
                    <option>Thermal Printer</option>
                    <option>Label Printer</option>
                    <option>Standard Printer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Label Size</label>
                  <select>
                    <option>50mm x 30mm</option>
                    <option>100mm x 50mm</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" />
                    Include Item Name
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" />
                    Include Price
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" />
                    Include HSN Code
                  </label>
                </div>
              </div>
              <div className="table-container" style={{ marginTop: '2rem' }}>
                <h4>Select Items for Barcode Printing</h4>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th><input type="checkbox" /></th>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Barcode</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td><input type="checkbox" /></td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.code}</td>
                        <td><input type="number" defaultValue="1" style={{ width: '80px' }} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Production/BOM Tab */}
            <div className={`tab-panel ${inventoryTab === 'bom' ? 'active' : ''}`}>
              <div className="section-header">
                <h3>Production / Recipe / BOM (Bill of Materials)</h3>
                <button className="add-btn" onClick={() => setShowBOMModal(true)}>
                  <ChefHat size={18} />
                  Add Recipe/BOM
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Recipe/BOM Code</th>
                      <th>Finished Product</th>
                      <th>Components</th>
                      <th>Quantity</th>
                      <th>Unit Cost</th>
                      <th>Total Cost</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boms.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                          No recipes/BOM found. Click "Add Recipe/BOM" to create one.
                        </td>
                      </tr>
                    ) : (
                      boms.map(bom => {
                        const product = items.find(i => i.id.toString() === bom.finishedProduct)
                        return (
                          <tr key={bom.id}>
                            <td>{bom.code}</td>
                            <td>{product?.name || 'N/A'}</td>
                            <td>{bom.components.length} component(s)</td>
                            <td>{bom.quantity}</td>
                            <td>₹0</td>
                            <td>₹0</td>
                            <td><span className="status-badge">Active</span></td>
                            <td>
                              <button className="icon-btn"><Edit size={16} /></button>
                              <button className="icon-btn"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stock Transaction Modal */}
            {showStockModal && (
              <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{stockForm.type === 'in' ? 'Stock In' : 'Stock Out'}</h3>
                    <button className="close-btn" onClick={() => setShowStockModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const newTransaction = {
                      id: Date.now(),
                      ...stockForm,
                      amount: stockForm.quantity * stockForm.rate
                    }
                    setStockTransactions([...stockTransactions, newTransaction])
                    setShowStockModal(false)
                    setStockForm({ type: 'in', itemId: '', quantity: 0, rate: 0, reference: '', date: new Date().toISOString().split('T')[0] })
                    alert('Stock transaction recorded successfully!')
                  }}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Date *</label>
                        <input type="date" required value={stockForm.date} onChange={(e) => setStockForm({...stockForm, date: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>Item *</label>
                        <select required value={stockForm.itemId} onChange={(e) => setStockForm({...stockForm, itemId: e.target.value})}>
                          <option value="">Select Item</option>
                          {items.map(item => (
                            <option key={item.id} value={item.id}>{item.name} ({item.code})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Quantity *</label>
                        <input type="number" required min="1" value={stockForm.quantity} onChange={(e) => setStockForm({...stockForm, quantity: parseFloat(e.target.value) || 0})} />
                      </div>
                      <div className="form-group">
                        <label>Rate *</label>
                        <input type="number" required step="0.01" value={stockForm.rate} onChange={(e) => setStockForm({...stockForm, rate: parseFloat(e.target.value) || 0})} />
                      </div>
                      <div className="form-group">
                        <label>Reference</label>
                        <input type="text" value={stockForm.reference} onChange={(e) => setStockForm({...stockForm, reference: e.target.value})} />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="button" onClick={() => setShowStockModal(false)}>Cancel</button>
                      <button type="submit">Save Transaction</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* BOM Modal */}
            {showBOMModal && (
              <div className="modal-overlay" onClick={() => setShowBOMModal(false)}>
                <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Add Recipe/BOM</h3>
                    <button className="close-btn" onClick={() => setShowBOMModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const newBOM = {
                      id: Date.now(),
                      ...bomForm
                    }
                    setBoms([...boms, newBOM])
                    setShowBOMModal(false)
                    setBomForm({ code: '', finishedProduct: '', components: [], quantity: 1 })
                    alert('Recipe/BOM created successfully!')
                  }}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>BOM Code *</label>
                        <input type="text" required value={bomForm.code} onChange={(e) => setBomForm({...bomForm, code: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>Finished Product *</label>
                        <select required value={bomForm.finishedProduct} onChange={(e) => setBomForm({...bomForm, finishedProduct: e.target.value})}>
                          <option value="">Select Product</option>
                          {items.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Quantity *</label>
                        <input type="number" required min="1" value={bomForm.quantity} onChange={(e) => setBomForm({...bomForm, quantity: parseInt(e.target.value) || 1})} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Components</label>
                      <div className="table-container">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Component Item</th>
                              <th>Quantity</th>
                              <th>Unit Cost</th>
                              <th>Total Cost</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                                <button type="button" className="add-btn" onClick={() => alert('Add Component functionality')}>
                                  <Plus size={16} />
                                  Add Component
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="button" onClick={() => setShowBOMModal(false)}>Cancel</button>
                      <button type="submit">Save BOM</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showItemModal && (
              <div className="modal-overlay" onClick={() => setShowItemModal(false)}>
                <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Add New Item</h3>
                    <button className="close-btn" onClick={() => setShowItemModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleItemSave}>
                    <div className="form-grid">
                <div className="form-group">
                        <label>Item Code *</label>
                  <input
                    type="text"
                    required
                          value={itemForm.code}
                          onChange={(e) => setItemForm({ ...itemForm, code: e.target.value })}
                  />
                </div>
                <div className="form-group">
                        <label>Item Name *</label>
                        <input
                          type="text"
                          required
                          value={itemForm.name}
                          onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>HSN Code</label>
                        <input
                          type="text"
                          value={itemForm.hsn}
                          onChange={(e) => setItemForm({ ...itemForm, hsn: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>SAC Code</label>
                    <input
                      type="text"
                          value={itemForm.sac}
                          onChange={(e) => setItemForm({ ...itemForm, sac: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>UOM *</label>
                        <select
                          required
                          value={itemForm.uom}
                          onChange={(e) => setItemForm({ ...itemForm, uom: e.target.value })}
                        >
                          <option value="PCS">PCS</option>
                          <option value="KG">KG</option>
                          <option value="LTR">LTR</option>
                          <option value="MTR">MTR</option>
                          <option value="BOX">BOX</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Rate *</label>
                        <input
                          type="number"
                      required
                          step="0.01"
                          value={itemForm.rate}
                          onChange={(e) => setItemForm({ ...itemForm, rate: parseFloat(e.target.value) || 0 })}
                    />
                      </div>
                      <div className="form-group">
                        <label>Cost Price *</label>
                    <input
                      type="number"
                      required
                          step="0.01"
                          value={itemForm.costPrice}
                          onChange={(e) => setItemForm({ ...itemForm, costPrice: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Reorder Level</label>
                        <input
                          type="number"
                          value={itemForm.reorderLevel}
                          onChange={(e) => setItemForm({ ...itemForm, reorderLevel: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <input
                          type="text"
                          value={itemForm.category}
                          onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Brand</label>
                        <input
                          type="text"
                          value={itemForm.brand}
                          onChange={(e) => setItemForm({ ...itemForm, brand: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Group</label>
                        <input
                          type="text"
                          value={itemForm.group}
                          onChange={(e) => setItemForm({ ...itemForm, group: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Opening Stock</label>
                        <input
                          type="number"
                          value={itemForm.openingStock}
                          onChange={(e) => setItemForm({ ...itemForm, openingStock: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Opening Value</label>
                    <input
                      type="number"
                      step="0.01"
                          value={itemForm.openingValue}
                          onChange={(e) => setItemForm({ ...itemForm, openingValue: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="button" onClick={() => setShowItemModal(false)}>Cancel</button>
                      <button type="submit">Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expense/Income Heads */}
        {activeTab === 'heads' && (
          <div className="setup-section">
            <div className="section-header">
              <h3>Expense / Income Heads</h3>
              <button className="add-btn" onClick={() => setShowHeadModal(true)}>
                <Plus size={18} />
                Add Head
              </button>
            </div>
            <div className="tabs-inner">
              <button
                className={`tab-inner ${headForm.type === 'Expense' ? 'active' : ''}`}
                onClick={() => setHeadForm({ ...headForm, type: 'Expense' })}
              >
                Expense Heads
              </button>
              <button
                className={`tab-inner ${headForm.type === 'Income' ? 'active' : ''}`}
                onClick={() => setHeadForm({ ...headForm, type: 'Income' })}
              >
                Income Heads
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Linked Ledger</th>
                    <th>Recurring</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(headForm.type === 'Expense' ? expenseHeads : incomeHeads).map(head => (
                    <tr key={head.id}>
                      <td>{head.name}</td>
                      <td><span className="badge">{head.type}</span></td>
                      <td>{head.ledger}</td>
                      <td>{head.recurring ? 'Yes' : 'No'}</td>
                      <td>
                        <button className="icon-btn" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="icon-btn danger" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showHeadModal && (
              <div className="modal-overlay" onClick={() => setShowHeadModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Add New {headForm.type} Head</h3>
                    <button className="close-btn" onClick={() => setShowHeadModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleHeadSave}>
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        required
                        value={headForm.name}
                        onChange={(e) => setHeadForm({ ...headForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Type *</label>
                      <select
                        required
                        value={headForm.type}
                        onChange={(e) => setHeadForm({ ...headForm, type: e.target.value })}
                      >
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Linked Ledger *</label>
                      <input
                        type="text"
                      required
                        value={headForm.ledger}
                        onChange={(e) => setHeadForm({ ...headForm, ledger: e.target.value })}
                        placeholder="Select or enter ledger name"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={headForm.recurring}
                          onChange={(e) => setHeadForm({ ...headForm, recurring: e.target.checked })}
                        />
                        Recurring
                      </label>
                    </div>
                    <div className="form-actions">
                      <button type="button" onClick={() => setShowHeadModal(false)}>Cancel</button>
                      <button type="submit">Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tax & Compliance */}
        {activeTab === 'tax' && (
          <div className="setup-section">
            <h3>Tax & Compliance Setup</h3>
            <form onSubmit={handleTaxSave}>
              <div className="tax-section">
                <h4>GST Configuration</h4>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={taxSetup.gstIntraState.enabled}
                      onChange={(e) => setTaxSetup({
                        ...taxSetup,
                        gstIntraState: { ...taxSetup.gstIntraState, enabled: e.target.checked }
                      })}
                    />
                    Enable GST (Intra-State)
                  </label>
                </div>
                {taxSetup.gstIntraState.enabled && (
                  <div className="tax-slabs">
                    <h5>GST Slabs</h5>
                    {taxSetup.gstIntraState.slabs.map(slab => (
                      <div key={slab.id} className="slab-item">
                        <span>{slab.name} ({slab.rate}%)</span>
                        <span>{slab.applicableTo}</span>
                        <button className="icon-btn danger" type="button">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="add-slab-btn" onClick={() => setShowTaxModal(true)}>
                      <Plus size={16} />
                      Add Slab
                    </button>
                  </div>
                )}
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={taxSetup.gstInterState.enabled}
                      onChange={(e) => setTaxSetup({
                        ...taxSetup,
                        gstInterState: { ...taxSetup.gstInterState, enabled: e.target.checked }
                      })}
                    />
                    Enable GST (Inter-State / IGST)
                  </label>
                </div>
                {taxSetup.gstInterState.enabled && (
                  <div className="tax-slabs">
                    <h5>IGST Slabs</h5>
                    {taxSetup.gstInterState.slabs.map(slab => (
                      <div key={slab.id} className="slab-item">
                        <span>{slab.name} ({slab.rate}%)</span>
                        <span>{slab.applicableTo}</span>
                        <button className="icon-btn danger" type="button">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="add-slab-btn" onClick={() => setShowTaxModal(true)}>
                      <Plus size={16} />
                      Add Slab
                    </button>
                  </div>
                )}
              </div>

              <div className="tax-section">
                <h4>Other Taxes</h4>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={taxSetup.vat.enabled}
                      onChange={(e) => setTaxSetup({
                        ...taxSetup,
                        vat: { ...taxSetup.vat, enabled: e.target.checked }
                      })}
                    />
                    Enable VAT
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={taxSetup.tds.enabled}
                      onChange={(e) => setTaxSetup({
                        ...taxSetup,
                        tds: { ...taxSetup.tds, enabled: e.target.checked }
                      })}
                    />
                    Enable TDS
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={taxSetup.tcs.enabled}
                      onChange={(e) => setTaxSetup({
                        ...taxSetup,
                        tcs: { ...taxSetup.tcs, enabled: e.target.checked }
                      })}
                    />
                    Enable TCS
                  </label>
                </div>
              </div>

              <div className="tax-section">
                <h4>Export/Import Settings</h4>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={taxSetup.exportImport.withLUT}
                      onChange={(e) => setTaxSetup({
                        ...taxSetup,
                        exportImport: { ...taxSetup.exportImport, withLUT: e.target.checked }
                      })}
                    />
                    Export/Import with LUT (Letter of Undertaking)
                  </label>
                </div>
              <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={taxSetup.exportImport.withoutLUT}
                      onChange={(e) => setTaxSetup({
                        ...taxSetup,
                        exportImport: { ...taxSetup.exportImport, withoutLUT: e.target.checked }
                      })}
                    />
                    Export/Import without LUT
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  <Save size={18} />
                  Save Tax Configuration
                </button>
              </div>
            </form>

            {showTaxModal && (
              <div className="modal-overlay" onClick={() => setShowTaxModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Add Tax Slab</h3>
                    <button className="close-btn" onClick={() => setShowTaxModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleTaxSave}>
                    <div className="form-group">
                      <label>Tax Type</label>
                      <select
                        value={taxForm.type}
                        onChange={(e) => setTaxForm({ ...taxForm, type: e.target.value })}
                      >
                        <option value="GST IntraState">GST IntraState</option>
                        <option value="GST InterState">GST InterState</option>
                        <option value="VAT">VAT</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Slab Name</label>
                      <input
                        type="text"
                        value={taxForm.name}
                        onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })}
                        placeholder="e.g., GST 18%"
                      />
                    </div>
                    <div className="form-group">
                      <label>Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={taxForm.rate}
                        onChange={(e) => setTaxForm({ ...taxForm, rate: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Applicable To</label>
                      <select
                        value={taxForm.applicableTo}
                        onChange={(e) => setTaxForm({ ...taxForm, applicableTo: e.target.value })}
                      >
                        <option value="All Items">All Items</option>
                        <option value="Specific Items">Specific Items</option>
                        <option value="Specific Categories">Specific Categories</option>
                      </select>
                    </div>
                    <div className="form-actions">
                      <button type="button" onClick={() => setShowTaxModal(false)}>Cancel</button>
                      <button type="submit">Add Slab</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Document Layout */}
        {activeTab === 'layout' && (
          <div className="setup-section">
            <h3>Document Layout / Printing Preferences</h3>
            <form onSubmit={handleDocLayoutSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Paper Size *</label>
                  <select
                    required
                    value={docLayout.paperSize}
                    onChange={(e) => setDocLayout({ ...docLayout, paperSize: e.target.value })}
                  >
                    <option value="A4">A4</option>
                    <option value="A5">A5</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Printer Selection</label>
                  <select
                    value={docLayout.printer}
                    onChange={(e) => setDocLayout({ ...docLayout, printer: e.target.value })}
                  >
                    <option value="Default">Default Printer</option>
                    <option value="Printer1">Printer 1</option>
                    <option value="Printer2">Printer 2</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Invoice Template</label>
                  <select
                    value={docLayout.invoiceTemplate}
                    onChange={(e) => setDocLayout({ ...docLayout, invoiceTemplate: e.target.value })}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Modern">Modern</option>
                    <option value="Classic">Classic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Quote Template</label>
                  <select
                    value={docLayout.quoteTemplate}
                    onChange={(e) => setDocLayout({ ...docLayout, quoteTemplate: e.target.value })}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Modern">Modern</option>
                    <option value="Classic">Classic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Challan Template</label>
                  <select
                    value={docLayout.challanTemplate}
                    onChange={(e) => setDocLayout({ ...docLayout, challanTemplate: e.target.value })}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Modern">Modern</option>
                    <option value="Classic">Classic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={docLayout.barcodeEnabled}
                      onChange={(e) => setDocLayout({ ...docLayout, barcodeEnabled: e.target.checked })}
                    />
                    Enable Barcode Printing
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={docLayout.labelPrintEnabled}
                      onChange={(e) => setDocLayout({ ...docLayout, labelPrintEnabled: e.target.checked })}
                    />
                    Enable Label Print Setup
                  </label>
                </div>
                <div className="form-group">
                  <label>Orientation</label>
                  <select
                    value={docLayout.orientation}
                    onChange={(e) => setDocLayout({ ...docLayout, orientation: e.target.value })}
                  >
                    <option value="Portrait">Portrait</option>
                    <option value="Landscape">Landscape</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Font Size</label>
                  <input
                    type="number"
                    min="8"
                    max="24"
                    value={docLayout.fontSize}
                    onChange={(e) => setDocLayout({ ...docLayout, fontSize: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Font Family</label>
                  <select
                    value={docLayout.fontFamily}
                    onChange={(e) => setDocLayout({ ...docLayout, fontFamily: e.target.value })}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Helvetica">Helvetica</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Color Mode</label>
                  <select
                    value={docLayout.colorMode}
                    onChange={(e) => setDocLayout({ ...docLayout, colorMode: e.target.value })}
                  >
                    <option value="Color">Color</option>
                    <option value="Grayscale">Grayscale</option>
                    <option value="Black & White">Black & White</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Number of Copies</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={docLayout.copies}
                    onChange={(e) => setDocLayout({ ...docLayout, copies: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={docLayout.duplex}
                      onChange={(e) => setDocLayout({ ...docLayout, duplex: e.target.checked })}
                    />
                    Enable Duplex Printing
                  </label>
                </div>
                <div className="form-group">
                  <label>Print Quality</label>
                  <select
                    value={docLayout.printQuality}
                    onChange={(e) => setDocLayout({ ...docLayout, printQuality: e.target.value })}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Best">Best</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Paper Source</label>
                  <select
                    value={docLayout.paperSource}
                    onChange={(e) => setDocLayout({ ...docLayout, paperSource: e.target.value })}
                  >
                    <option value="Auto">Auto</option>
                    <option value="Tray 1">Tray 1</option>
                    <option value="Tray 2">Tray 2</option>
                    <option value="Manual Feed">Manual Feed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Margins (mm)</label>
                  <div className="margin-inputs">
                    <input
                      type="number"
                      placeholder="Top"
                      value={docLayout.margins.top}
                      onChange={(e) => setDocLayout({ ...docLayout, margins: { ...docLayout.margins, top: parseInt(e.target.value) } })}
                    />
                    <input
                      type="number"
                      placeholder="Bottom"
                      value={docLayout.margins.bottom}
                      onChange={(e) => setDocLayout({ ...docLayout, margins: { ...docLayout.margins, bottom: parseInt(e.target.value) } })}
                    />
                    <input
                      type="number"
                      placeholder="Left"
                      value={docLayout.margins.left}
                      onChange={(e) => setDocLayout({ ...docLayout, margins: { ...docLayout.margins, left: parseInt(e.target.value) } })}
                    />
                    <input
                      type="number"
                      placeholder="Right"
                      value={docLayout.margins.right}
                      onChange={(e) => setDocLayout({ ...docLayout, margins: { ...docLayout.margins, right: parseInt(e.target.value) } })}
                    />
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  <Save size={18} />
                  Save Layout Preferences
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sales / Billing / Purchases */}
        {activeTab === 'billing' && (
          <BillingSection />
        )}

        {/* Opening Balances Management */}
        {activeTab === 'openingBalances' && (
          <div className="setup-section">
            <h3>Opening Balances Management</h3>
            <p className="section-description">Set opening balances for ledgers, customers, suppliers, and inventory items</p>
            <div className="opening-balances-tabs">
              <button className={`sub-tab ${activeTab === 'openingBalances' ? 'active' : ''}`}>Ledgers</button>
              <button className={`sub-tab ${activeTab === 'openingBalances' ? 'active' : ''}`}>Customers/Suppliers</button>
              <button className={`sub-tab ${activeTab === 'openingBalances' ? 'active' : ''}`}>Inventory</button>
        </div>
            <div className="form-grid" style={{ marginTop: '2rem' }}>
              <div className="form-group full-width">
                <label>Financial Period *</label>
                <input type="date" required />
    </div>
              <div className="form-group full-width">
                <h4>Ledger Opening Balances</h4>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ledger Name</th>
                      <th>Type</th>
                      <th>Opening Balance (Dr)</th>
                      <th>Opening Balance (Cr)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgers.map(ledger => (
                      <tr key={ledger.id}>
                        <td>{ledger.name}</td>
                        <td>{ledger.type}</td>
                        <td>
                          <input type="number" defaultValue={ledger.openingBalance > 0 ? ledger.openingBalance : 0} style={{ width: '100%' }} />
                        </td>
                        <td>
                          <input type="number" defaultValue={ledger.openingBalance < 0 ? Math.abs(ledger.openingBalance) : 0} style={{ width: '100%' }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="save-btn">
                <Save size={18} />
                Save Opening Balances
              </button>
            </div>
          </div>
        )}

        {/* Visual Designer */}
        {activeTab === 'visualDesigner' && (
          <div className="setup-section">
            <h3>Visual Document Designer</h3>
            <p className="section-description">Design custom layouts for invoices, estimates, challans, and other documents using modular design framework</p>
            <div className="designer-tabs">
              <button className="sub-tab active">Invoice</button>
              <button className="sub-tab">Estimate</button>
              <button className="sub-tab">Challan</button>
              <button className="sub-tab">Purchase Order</button>
              <button className="sub-tab">Custom Document</button>
            </div>
            
            <div className="visual-designer-container">
              <div className="designer-toolbar">
                <h4>Design Modules</h4>
                <div className="designer-modules">
                  <div className="module-card active">
                    <h5>1. DocTypes</h5>
                    <p>Define new document types (Invoice, Estimate, Challan, Custom Docs)</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Control document properties (print/mode/posting rules)</p>
                    <button className="module-btn" onClick={() => alert('DocTypes Configuration - Define document types and their properties')}>
                      <Settings2 size={14} />
                      Configure
                    </button>
                  </div>
                  <div className="module-card">
                    <h5>2. DocInputs</h5>
                    <p>Predefined input fields (standard input items)</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Add custom inputs (e.g., GR No, Order No.)</p>
                    <button className="module-btn" onClick={() => alert('DocInputs Configuration - Configure input fields and data sources')}>
                      <Settings2 size={14} />
                      Configure
                    </button>
                  </div>
                  <div className="module-card">
                    <h5>3. DocColumns</h5>
                    <p>Define line-item columns (Item Code, Description, Qty, UOM, Rate, Discount, Tax, Amount)</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Standard columns list and custom column creation</p>
                    <button className="module-btn" onClick={() => alert('DocColumns Configuration - Design table columns and layouts')}>
                      <Settings2 size={14} />
                      Configure
                    </button>
                  </div>
                  <div className="module-card">
                    <h5>4. DocTotals</h5>
                    <p>Configure totals block (sub-total, taxes, round-off, other duties/excise)</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Set up calculations and totals</p>
                    <button className="module-btn" onClick={() => alert('DocTotals Configuration - Set up calculations and totals')}>
                      <Settings2 size={14} />
                      Configure
                    </button>
                  </div>
                  <div className="module-card">
                    <h5>5. DocReports</h5>
                    <p>Design and view document-based reports</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Link reports to DocTypes</p>
                    <button className="module-btn" onClick={() => alert('DocReports Configuration - Configure report generation')}>
                      <Settings2 size={14} />
                      Configure
                    </button>
                  </div>
                  <div className="module-card">
                    <h5>6. DocRepForms</h5>
                    <p>Create printable/report forms (layout templates)</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Attach forms to documents</p>
                    <button className="module-btn" onClick={() => alert('DocRepForms Configuration - Design report forms and layouts')}>
                      <Settings2 size={14} />
                      Configure
                    </button>
                  </div>
                  <div className="module-card">
                    <h5>7. DocPosting</h5>
                    <p>Define voucher posting rules</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>How document actions generate accounting vouchers (GL posting rules)</p>
                    <button className="module-btn" onClick={() => alert('DocPosting Configuration - Set up automatic voucher posting')}>
                      <Settings2 size={14} />
                      Configure
                    </button>
                  </div>
                </div>
                <div className="designer-properties" style={{ marginTop: '2rem', padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
                  <h5>Doc Properties & Variables</h5>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    Support for custom variables (company/firms fields, excise variables, general variables) and using database fields in reports
                  </p>
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Company Variables</label>
                    <input type="text" placeholder="e.g., Company Name, Address, GSTIN" />
                  </div>
                  <div className="form-group">
                    <label>Custom Variables</label>
                    <input type="text" placeholder="e.g., Excise Variables, General Variables" />
                  </div>
                  <div className="form-group">
                    <label>Database Fields</label>
                    <select>
                      <option>Select Database Field</option>
                      <option>Customer Name</option>
                      <option>Invoice Number</option>
                      <option>Date</option>
                      <option>Amount</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="designer-canvas">
                <div className="canvas-placeholder">
                  <Palette size={64} />
                  <p>Visual Designer Canvas</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Drag and drop elements to design your document</p>
                  <div style={{ marginTop: '2rem', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                    <h5 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Available Elements:</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ padding: '0.25rem 0.5rem', background: 'white', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Header</span>
                      <span style={{ padding: '0.25rem 0.5rem', background: 'white', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Company Info</span>
                      <span style={{ padding: '0.25rem 0.5rem', background: 'white', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Item Table</span>
                      <span style={{ padding: '0.25rem 0.5rem', background: 'white', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Totals</span>
                      <span style={{ padding: '0.25rem 0.5rem', background: 'white', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Footer</span>
                      <span style={{ padding: '0.25rem 0.5rem', background: 'white', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Signature</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integrations */}
        {activeTab === 'integrations' && (
          <div className="setup-section">
            <h3>Integrations</h3>
            <div className="integrations-grid">
              <div className="integration-card">
                <Mail size={32} />
                <h4>Email Integration</h4>
                <p>Configure email settings for sending invoices, reports, and notifications</p>
                <div className="form-group" style={{ marginTop: '1rem', width: '100%' }}>
                  <label>SMTP Server</label>
                  <input type="text" placeholder="smtp.gmail.com" />
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                  <label>Port</label>
                  <input type="number" placeholder="587" />
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                  <label>Email Address</label>
                  <input type="email" placeholder="your@email.com" />
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                  <label>Password</label>
                  <input type="password" placeholder="App Password" />
                </div>
                <button className="save-btn" style={{ width: '100%', marginTop: '1rem' }}>
                  <Save size={18} />
                  Save Email Settings
                </button>
              </div>
              <div className="integration-card">
                <ScanLine size={32} />
                <h4>Barcode Integration</h4>
                <p>Configure barcode scanning and printing</p>
                <div className="form-group" style={{ marginTop: '1rem', width: '100%' }}>
                  <label>
                    <input type="checkbox" checked={docLayout.barcodeEnabled} onChange={(e) => setDocLayout({...docLayout, barcodeEnabled: e.target.checked})} />
                    Enable Barcode Scanning
                  </label>
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                  <label>Barcode Type</label>
                  <select>
                    <option>EAN-13</option>
                    <option>Code 128</option>
                    <option>QR Code</option>
                    <option>Data Matrix</option>
                  </select>
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                  <label>Scanner Device</label>
                  <select>
                    <option>USB Scanner</option>
                    <option>Bluetooth Scanner</option>
                    <option>Camera Scanner</option>
                  </select>
                </div>
                <button className="save-btn" style={{ width: '100%', marginTop: '1rem' }}>
                  <Save size={18} />
                  Save Barcode Settings
                </button>
              </div>
              <div className="integration-card">
                <FileCheck size={32} />
                <h4>E-Invoice Integration</h4>
                <p>Configure e-invoice generation and e-way bill integration</p>
                <div className="form-group" style={{ marginTop: '1rem', width: '100%' }}>
                  <label>
                    <input type="checkbox" />
                    Enable E-Invoice Generation
                  </label>
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                  <label>GSTIN Portal</label>
                  <input type="text" placeholder="GSTIN Portal API Key" />
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                  <label>
                    <input type="checkbox" />
                    Enable E-Way Bill Integration
                  </label>
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                  <label>
                    <input type="checkbox" />
                    Enable Cancel E-Invoice from Portal
                  </label>
                </div>
                <button className="save-btn" style={{ width: '100%', marginTop: '1rem' }}>
                  <Save size={18} />
                  Save E-Invoice Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auto Posting */}
        {activeTab === 'autoPosting' && (
          <div className="setup-section">
            <h3>Auto Posting of Vouchers</h3>
            <p className="section-description">Configure automatic voucher posting when documents are created (via DocPosting)</p>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>
                  <input type="checkbox" defaultChecked />
                  Enable Auto Posting
                </label>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Automatically create accounting vouchers when invoices, purchases, or other documents are created
                </p>
              </div>
              <div className="form-group">
                <label>Sales Invoice Posting</label>
                <select>
                  <option>Auto Post to Sales Account</option>
                  <option>Manual Posting Required</option>
                </select>
              </div>
              <div className="form-group">
                <label>Purchase Invoice Posting</label>
                <select>
                  <option>Auto Post to Purchase Account</option>
                  <option>Manual Posting Required</option>
                </select>
              </div>
              <div className="form-group">
                <label>Payment Receipt Posting</label>
                <select>
                  <option>Auto Post to Cash/Bank Account</option>
                  <option>Manual Posting Required</option>
                </select>
              </div>
              <div className="form-group">
                <label>Journal Entry Posting</label>
                <select>
                  <option>Auto Post</option>
                  <option>Manual Posting Required</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="save-btn">
                <Save size={18} />
                Save Auto Posting Settings
              </button>
            </div>
          </div>
        )}

        {/* Receivables/Payables */}
        {activeTab === 'receivablesPayables' && (
          <div className="setup-section">
            <h3>Accounts Receivable & Accounts Payable</h3>
            <div className="receivables-tabs">
              <button className="sub-tab active">Receivables (Customers)</button>
              <button className="sub-tab">Payables (Suppliers)</button>
            </div>
            <div className="stats-grid" style={{ marginTop: '2rem' }}>
              <div className="stat-card">
                <div className="stat-label">Total Receivables</div>
                <div className="stat-value">₹{customers.reduce((sum, c) => sum + (c.openingBalance || 0), 0).toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Payables</div>
                <div className="stat-value">₹{suppliers.reduce((sum, s) => sum + (s.openingBalance || 0), 0).toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Overdue Receivables</div>
                <div className="stat-value">₹0</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Overdue Payables</div>
                <div className="stat-value">₹0</div>
              </div>
            </div>
            <div className="table-container" style={{ marginTop: '2rem' }}>
              <h4>Customer Outstanding</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Outstanding Amount</th>
                    <th>0-30 Days</th>
                    <th>31-60 Days</th>
                    <th>61-90 Days</th>
                    <th>90+ Days</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>₹{customer.openingBalance?.toLocaleString() || '0'}</td>
                      <td>₹0</td>
                      <td>₹0</td>
                      <td>₹0</td>
                      <td>₹0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Project Accounting */}
        {activeTab === 'projects' && (
          <div className="setup-section">
            <h3>Project Accounting</h3>
            <p className="section-description">Assign costs and income to projects for better tracking and reporting</p>
            <div className="section-header">
              <h4>Projects</h4>
              <button className="add-btn">
                <Plus size={18} />
                Add Project
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Project Code</th>
                    <th>Project Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Budget</th>
                    <th>Actual Cost</th>
                    <th>Income</th>
                    <th>Profit/Loss</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>
                      No projects found. Click "Add Project" to create one.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Financial Reports */}
        {activeTab === 'reports' && (
          <div className="setup-section">
            <h3>Financial Reports</h3>
            <div className="reports-grid">
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Profit & Loss Statement</h4>
                <p>View income, expenses, and net profit/loss for a selected period</p>
                <button className="report-btn" onClick={() => {
                  const fromDate = prompt('Enter From Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
                  const toDate = prompt('Enter To Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
                  if (fromDate && toDate) {
                    const report = generateProfitLoss(ledgers, incomeHeads, expenseHeads, fromDate, toDate)
                    const reportData = [
                      { Item: 'Total Income', Amount: `₹${report.income.toLocaleString()}` },
                      { Item: 'Total Expenses', Amount: `₹${report.expenses.toLocaleString()}` },
                      { Item: 'Net Profit/Loss', Amount: `₹${report.netProfit.toLocaleString()}` }
                    ]
                    exportReportToCSV(reportData, `P&L_Report_${fromDate}_${toDate}.csv`)
                    alert(`Profit & Loss Report Generated!\nIncome: ₹${report.income.toLocaleString()}\nExpenses: ₹${report.expenses.toLocaleString()}\nNet Profit: ₹${report.netProfit.toLocaleString()}`)
                  }
                }}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Balance Sheet</h4>
                <p>View assets, liabilities, and equity at a specific date</p>
                <button className="report-btn" onClick={() => {
                  const asOnDate = prompt('Enter Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
                  if (asOnDate) {
                    const report = generateBalanceSheet(ledgers, asOnDate)
                    const reportData = [
                      { Item: 'Total Assets', Amount: `₹${report.assets.toLocaleString()}` },
                      { Item: 'Total Liabilities', Amount: `₹${report.liabilities.toLocaleString()}` },
                      { Item: 'Total Equity', Amount: `₹${report.equity.toLocaleString()}` }
                    ]
                    exportReportToCSV(reportData, `BalanceSheet_${asOnDate}.csv`)
                    alert(`Balance Sheet Generated!\nAssets: ₹${report.assets.toLocaleString()}\nLiabilities: ₹${report.liabilities.toLocaleString()}\nEquity: ₹${report.equity.toLocaleString()}`)
                  }
                }}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Trial Balance</h4>
                <p>View all ledger accounts with debit and credit balances</p>
                <button className="report-btn" onClick={() => {
                  const report = generateTrialBalance(ledgers)
                  exportReportToCSV(report, 'TrialBalance.csv')
                  alert(`Trial Balance Report Generated! ${report.length} accounts exported.`)
                }}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Ledger Statement</h4>
                <p>View detailed transactions for a specific ledger account</p>
                <button className="report-btn" onClick={() => {
                  const ledgerName = prompt('Enter Ledger Name:')
                  if (ledgerName) {
                    const ledger = ledgers.find(l => l.name === ledgerName)
                    if (ledger) {
                      const reportData = [{ Account: ledger.name, Balance: `₹${(ledger.balance || 0).toLocaleString()}` }]
                      exportReportToCSV(reportData, `LedgerStatement_${ledgerName}.csv`)
                      alert(`Ledger Statement Generated for ${ledgerName}!`)
                    } else {
                      alert('Ledger not found!')
                    }
                  }
                }}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Sales Report</h4>
                <p>View sales transactions, revenue, and sales trends</p>
                <button className="report-btn" onClick={() => {
                  const fromDate = prompt('Enter From Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
                  const toDate = prompt('Enter To Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
                  if (fromDate && toDate) {
                    // Get sales from POS context or use sample data
                    const sales = [] // This should come from POS context or state
                    const report = generateSalesReport(sales, fromDate, toDate)
                    exportReportToCSV(report.sales, `SalesReport_${fromDate}_${toDate}.csv`)
                    alert(`Sales Report Generated!\nTotal Sales: ₹${report.totalSales.toLocaleString()}\nTotal Tax: ₹${report.totalTax.toLocaleString()}\nCount: ${report.count}`)
                  }
                }}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Purchase Report</h4>
                <p>View purchase transactions, expenses, and purchase trends</p>
                <button className="report-btn" onClick={() => {
                  const fromDate = prompt('Enter From Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
                  const toDate = prompt('Enter To Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
                  if (fromDate && toDate) {
                    const purchases = [] // This should come from state
                    const report = generatePurchaseReport(purchases, fromDate, toDate)
                    exportReportToCSV(report.purchases, `PurchaseReport_${fromDate}_${toDate}.csv`)
                    alert(`Purchase Report Generated!\nTotal Purchases: ₹${report.totalPurchases.toLocaleString()}\nTotal Tax: ₹${report.totalTax.toLocaleString()}\nCount: ${report.count}`)
                  }
                }}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Cash Flow Statement</h4>
                <p>View cash inflows and outflows for operating, investing, and financing activities</p>
                <button className="report-btn" onClick={() => alert('Cash Flow Statement - Coming Soon!')}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>GST Reports</h4>
                <p>View GST returns, tax liability, and compliance reports with e-filing support</p>
                <button className="report-btn" onClick={() => alert('GST Reports - Coming Soon!')}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>HSN-wise Sale/Purchase</h4>
                <p>View HSN code wise sales and purchase reports for GST filing</p>
                <button className="report-btn" onClick={() => {
                  const sales = [] // Get from POS context
                  const purchases = [] // Get from state
                  const report = generateHSNReport(sales, purchases)
                  exportReportToCSV(report, 'HSNReport.csv')
                  alert(`HSN-wise Report Generated! ${report.length} HSN codes exported.`)
                }}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>E-Invoice Report</h4>
                <p>View e-invoice generation status and manage e-invoices</p>
                <button className="report-btn" onClick={() => alert('E-Invoice Report - Coming Soon!')}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>E-Way Bill Report</h4>
                <p>View e-way bill generation and tracking reports</p>
                <button className="report-btn" onClick={() => alert('E-Way Bill Report - Coming Soon!')}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Export Transactions</h4>
                <p>View export transactions with/without LUT (Letter of Undertaking)</p>
                <button className="report-btn" onClick={() => alert('Export Transactions Report - Coming Soon!')}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Aged Receivables</h4>
                <p>View outstanding customer balances by aging period</p>
                <button className="report-btn" onClick={() => {
                  const sales = [] // Get from POS context
                  const payments = [] // Get from POS context
                  const report = generateAgedReceivables(customers, sales, payments)
                  exportReportToCSV(report, 'AgedReceivables.csv')
                  alert(`Aged Receivables Report Generated! ${report.length} customers exported.`)
                }}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Aged Payables</h4>
                <p>View outstanding supplier balances by aging period</p>
                <button className="report-btn" onClick={() => {
                  const purchases = [] // Get from state
                  const payments = [] // Get from POS context
                  const report = generateAgedPayables(suppliers, purchases, payments)
                  exportReportToCSV(report, 'AgedPayables.csv')
                  alert(`Aged Payables Report Generated! ${report.length} suppliers exported.`)
                }}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Inventory Valuation</h4>
                <p>View current inventory value, stock levels, and valuation methods</p>
                <button className="report-btn" onClick={() => {
                  const report = generateInventoryValuation(items, stockTransactions)
                  exportReportToCSV(report, 'InventoryValuation.csv')
                  const totalValue = report.reduce((sum, item) => sum + item.stockValue, 0)
                  alert(`Inventory Valuation Report Generated!\nTotal Stock Value: ₹${totalValue.toLocaleString()}\nItems: ${report.length}`)
                }}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
              <div className="report-card">
                <FileBarChart size={32} />
                <h4>Day Book</h4>
                <p>View all transactions recorded on a specific date</p>
                <button className="report-btn" onClick={() => alert('Day Book Report - Coming Soon!')}>
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vouchers */}
        {activeTab === 'vouchers' && (
          <div className="setup-section">
            <h3>Vouchers (Payment, Receipt, Journal)</h3>
            <div className="section-header">
              <div className="voucher-tabs">
                <button className="sub-tab active">Payment</button>
                <button className="sub-tab">Receipt</button>
                <button className="sub-tab">Journal</button>
              </div>
              <button className="add-btn" onClick={() => setShowVoucherModal(true)}>
                <Plus size={18} />
                Create Voucher
              </button>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>
                <input type="checkbox" checked={voucherForm.autoPost} onChange={(e) => setVoucherForm({...voucherForm, autoPost: e.target.checked})} />
                Enable Automatic Voucher Posting from Documents
              </label>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                When enabled, vouchers will be automatically created when invoices, purchases, or other documents are created
              </p>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Voucher No.</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Account</th>
                    <th>Amount</th>
                    <th>Narration</th>
                    <th>Auto Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                        No vouchers found. Click "Create Voucher" to create one.
                      </td>
                    </tr>
                  ) : (
                    vouchers.map(voucher => (
                      <tr key={voucher.id}>
                        <td>#{voucher.id}</td>
                        <td>{voucher.date}</td>
                        <td>{voucher.type}</td>
                        <td>{voucher.account}</td>
                        <td>₹{voucher.amount.toLocaleString()}</td>
                        <td>{voucher.narration}</td>
                        <td>{voucher.autoPosted ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}</td>
                        <td>
                          <button className="icon-btn"><Edit size={16} /></button>
                          <button className="icon-btn"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bank Reconciliation */}
        {activeTab === 'bankReconciliation' && (
          <div className="setup-section">
            <h3>Bank Reconciliation</h3>
            <p className="section-description">Reconcile bank statements with bank ledgers</p>
            <div className="section-header">
              <ImportExport
                data={bankStatements}
                onImport={(importedData) => {
                  const statements = importedData.map((stmt, idx) => ({
                    id: stmt.id || Date.now() + idx,
                    date: stmt.date,
                    description: stmt.description || stmt.narration || '',
                    debit: parseFloat(stmt.debit) || 0,
                    credit: parseFloat(stmt.credit) || 0,
                    balance: parseFloat(stmt.balance) || 0,
                    reconciled: false
                  }))
                  setBankStatements(statements)
                  alert(`Imported ${statements.length} bank statement entries!`)
                }}
                onExport={() => bankStatements}
                filename="bank_statements"
                importFields={['date', 'description', 'debit', 'credit', 'balance']}
                exportFields={['date', 'description', 'debit', 'credit', 'balance']}
                title="Import Bank Statement"
              />
              <button className="add-btn" onClick={() => {
                // Auto-match transactions
                const matched = []
                bankStatements.forEach(stmt => {
                  const ledgerMatch = bankLedgers.find(ledger => 
                    Math.abs(ledger.amount - (stmt.debit || stmt.credit)) < 0.01 &&
                    Math.abs((new Date(ledger.date) - new Date(stmt.date)) / (1000 * 60 * 60 * 24)) <= 7
                  )
                  if (ledgerMatch) {
                    matched.push({ statement: stmt, ledger: ledgerMatch })
                  }
                })
                setReconciledTransactions(matched)
                alert(`Matched ${matched.length} transactions automatically!`)
              }}>
                <CheckCircle size={18} />
                Auto Match
              </button>
            </div>
            <div className="bank-recon-grid">
              <div className="bank-recon-card">
                <h4>Bank Statements</h4>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Debit</th>
                        <th>Credit</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankStatements.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                            No bank statements imported. Use Import/Export above to import.
                          </td>
                        </tr>
                      ) : (
                        bankStatements.map(stmt => (
                          <tr key={stmt.id} className={stmt.reconciled ? 'reconciled' : ''}>
                            <td>{stmt.date}</td>
                            <td>{stmt.description}</td>
                            <td>{stmt.debit > 0 ? `₹${stmt.debit.toLocaleString()}` : '-'}</td>
                            <td>{stmt.credit > 0 ? `₹${stmt.credit.toLocaleString()}` : '-'}</td>
                            <td>₹{stmt.balance.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bank-recon-card">
                <h4>Bank Ledger</h4>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Voucher No.</th>
                        <th>Description</th>
                        <th>Debit</th>
                        <th>Credit</th>
                        <th>Balance</th>
                        <th>Reconciled</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                          No bank ledger entries found.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="reconciliation-summary" style={{ marginTop: '2rem', padding: '1.5rem', background: '#f3f4f6', borderRadius: '0.75rem' }}>
              <h4>Reconciliation Summary</h4>
              <div className="summary-row">
                <span>Bank Statement Balance:</span>
                <span>₹0.00</span>
              </div>
              <div className="summary-row">
                <span>Bank Ledger Balance:</span>
                <span>₹0.00</span>
              </div>
              <div className="summary-row">
                <span>Difference:</span>
                <span>₹0.00</span>
              </div>
            </div>
          </div>
        )}

        {/* GSTR & E-Invoice */}
        {activeTab === 'gstr' && (
          <div className="setup-section">
            <h3>GSTR & E-Invoice</h3>
            <div className="gstr-tabs">
              <button className="sub-tab active">GSTR-1</button>
              <button className="sub-tab">GSTR-2</button>
              <button className="sub-tab">GSTR-3</button>
              <button className="sub-tab">E-Invoice</button>
              <button className="sub-tab">E-Way Bill</button>
              <button className="sub-tab">VAT Returns</button>
            </div>
            <div className="gstr-section">
              <div className="section-header">
                <h4>GSTR-1 Generation & E-Filing</h4>
                <div>
                  <button className="add-btn" style={{ marginRight: '0.5rem' }}>
                    <Download size={18} />
                    Generate GSTR-1
                  </button>
                  <button className="add-btn">
                    <FileCheck size={18} />
                    E-File GSTR-1
                  </button>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Period *</label>
                  <input type="month" required />
                </div>
                <div className="form-group">
                  <label>GSTIN</label>
                  <input type="text" value={companyData.gstin} readOnly />
                </div>
              </div>
              <div className="gstr-summary-tiles">
                <div className="gstr-tile">
                  <h5>B2B Invoices</h5>
                  <div className="tile-value">0</div>
                </div>
                <div className="gstr-tile">
                  <h5>B2C Invoices</h5>
                  <div className="tile-value">0</div>
                </div>
                <div className="gstr-tile">
                  <h5>Credit Notes</h5>
                  <div className="tile-value">0</div>
                </div>
                <div className="gstr-tile">
                  <h5>Total Tax</h5>
                  <div className="tile-value">₹0</div>
                </div>
              </div>
              <div className="table-container" style={{ marginTop: '2rem' }}>
                <h4>HSN-wise Sale/Purchase Report</h4>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>HSN Code</th>
                      <th>Description</th>
                      <th>UOM</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Taxable Value</th>
                      <th>IGST</th>
                      <th>CGST</th>
                      <th>SGST</th>
                      <th>Total Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>
                        No HSN-wise data available for the selected period.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="e-invoice-section" style={{ marginTop: '2rem', padding: '1.5rem', background: '#f3f4f6', borderRadius: '0.75rem' }}>
                <h4>E-Invoice Management</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <input type="checkbox" />
                      Enable E-Invoice Generation
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input type="checkbox" />
                      Enable E-Way Bill Integration
                    </label>
                  </div>
                </div>
                <div className="table-container" style={{ marginTop: '1rem' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Invoice No.</th>
                        <th>Date</th>
                        <th>IRN</th>
                        <th>E-Way Bill No.</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                          No e-invoices generated yet.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="form-actions" style={{ marginTop: '1rem' }}>
                  <button className="save-btn">
                    <FileCheck size={18} />
                    Generate E-Invoice
                  </button>
                  <button className="save-btn" style={{ marginLeft: '0.5rem' }}>
                    <XCircle size={18} />
                    Cancel E-Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ITR & Tax Audit */}
        {activeTab === 'itr' && (
          <div className="setup-section">
            <h3>ITR & Tax Audit (Catax Module)</h3>
            <div className="itr-tabs">
              <button className="sub-tab active">ITR Forms</button>
              <button className="sub-tab">Tax Audit (3CA/3CD)</button>
              <button className="sub-tab">Computation Schedules</button>
              <button className="sub-tab">AIS Import</button>
            </div>
            <div className="section-header">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>ITR Form Type *</label>
                <select>
                  <option>ITR-1 (Sahaj)</option>
                  <option>ITR-2</option>
                  <option>ITR-3</option>
                  <option>ITR-4 (Sugam)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0, marginLeft: '1rem' }}>
                <label>Assessment Year *</label>
                <select>
                  <option>2024-25</option>
                  <option>2023-24</option>
                </select>
              </div>
              <button className="add-btn" style={{ marginLeft: '1rem' }}>
                <Plus size={18} />
                New ITR
              </button>
            </div>
            <div className="itr-sections">
              <div className="itr-section-card">
                <h4>Income Details</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Salary Income</label>
                    <input type="number" />
                  </div>
                  <div className="form-group">
                    <label>Business Income</label>
                    <input type="number" />
                  </div>
                  <div className="form-group">
                    <label>Capital Gains</label>
                    <input type="number" />
                  </div>
                  <div className="form-group">
                    <label>Other Income</label>
                    <input type="number" />
                  </div>
                </div>
              </div>
              <div className="itr-section-card">
                <h4>Deductions</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Section 80C</label>
                    <input type="number" />
                  </div>
                  <div className="form-group">
                    <label>Section 80D</label>
                    <input type="number" />
                  </div>
                  <div className="form-group">
                    <label>Section 24</label>
                    <input type="number" />
                  </div>
                </div>
              </div>
              <div className="itr-section-card">
                <h4>Tax Audit Reports</h4>
                <div className="form-group">
                  <label>Form 3CA/3CD</label>
                  <button className="add-btn">
                    <FileText size={18} />
                    Generate Form 3CA/3CD
                  </button>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button className="save-btn">
                <FileCheck size={18} />
                E-File ITR
              </button>
              <button className="save-btn" style={{ marginLeft: '0.5rem' }}>
                <Download size={18} />
                Download ITR
              </button>
            </div>
          </div>
        )}

        {/* TDS/TCS Returns */}
        {activeTab === 'tds' && (
          <div className="setup-section">
            <h3>TDS/TCS Returns (Catax-TDS Module)</h3>
            <div className="tds-tabs">
              <button className="sub-tab active">24Q (Salary)</button>
              <button className="sub-tab">26Q (Non-Salary)</button>
              <button className="sub-tab">27Q (Non-Resident)</button>
              <button className="sub-tab">27EQ (TCS)</button>
              <button className="sub-tab">Form-16/16A</button>
            </div>
            <div className="section-header">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Form Type *</label>
                <select>
                  <option>24Q</option>
                  <option>26Q</option>
                  <option>27Q</option>
                  <option>27EQ</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0, marginLeft: '1rem' }}>
                <label>Quarter *</label>
                <select>
                  <option>Q1 (Apr-Jun)</option>
                  <option>Q2 (Jul-Sep)</option>
                  <option>Q3 (Oct-Dec)</option>
                  <option>Q4 (Jan-Mar)</option>
                </select>
              </div>
              <button className="add-btn" style={{ marginLeft: '1rem' }}>
                <Plus size={18} />
                Prepare Return
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PAN</th>
                    <th>Name</th>
                    <th>Amount Paid</th>
                    <th>TDS Rate</th>
                    <th>TDS Amount</th>
                    <th>Section</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      No TDS entries found. Add TDS entries to prepare return.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="form-actions">
              <button className="save-btn">
                <FileText size={18} />
                Generate Form-16/16A
              </button>
              <button className="save-btn" style={{ marginLeft: '0.5rem' }}>
                <FileCheck size={18} />
                E-File TDS Return
              </button>
              <button className="save-btn" style={{ marginLeft: '0.5rem' }}>
                <Download size={18} />
                Download Return
              </button>
            </div>
          </div>
        )}

        {/* Payroll */}
        {activeTab === 'payroll' && (
          <div className="setup-section">
            <h3>Payroll Management (VCPay)</h3>
            <div className="payroll-tabs">
              <button className={`sub-tab ${payrollActiveTab === 'employees' ? 'active' : ''}`} onClick={() => setPayrollActiveTab('employees')}>Employees</button>
              <button className={`sub-tab ${payrollActiveTab === 'salary' ? 'active' : ''}`} onClick={() => setPayrollActiveTab('salary')}>Salary Computation</button>
              <button className={`sub-tab ${payrollActiveTab === 'payslips' ? 'active' : ''}`} onClick={() => setPayrollActiveTab('payslips')}>Payslips</button>
              <button className={`sub-tab ${payrollActiveTab === 'pfesi' ? 'active' : ''}`} onClick={() => setPayrollActiveTab('pfesi')}>PF/ESI Returns</button>
              <button className={`sub-tab ${payrollActiveTab === 'leave' ? 'active' : ''}`} onClick={() => setPayrollActiveTab('leave')}>Leave Management</button>
              <button className={`sub-tab ${payrollActiveTab === 'loans' ? 'active' : ''}`} onClick={() => setPayrollActiveTab('loans')}>Loans & Advances</button>
              <button className={`sub-tab ${payrollActiveTab === 'wages' ? 'active' : ''}`} onClick={() => setPayrollActiveTab('wages')}>Wages Register</button>
            </div>
            <div className="section-header">
              <button className="add-btn" onClick={() => setShowPayrollModal(true)}>
                <Plus size={18} />
                Add Employee
              </button>
            </div>
            <div className="payroll-dashboard">
              <div className="payroll-stat-card">
                <Users size={24} />
                <div>
                  <div className="stat-label">Total Employees</div>
                  <div className="stat-value">{employees.length}</div>
                </div>
              </div>
              <div className="payroll-stat-card">
                <DollarSign size={24} />
                <div>
                  <div className="stat-label">Total Payroll</div>
                  <div className="stat-value">₹0</div>
                </div>
              </div>
              <div className="payroll-stat-card">
                <Calendar size={24} />
                <div>
                  <div className="stat-label">Current Month</div>
                  <div className="stat-value">{new Date().toLocaleString('default', { month: 'long' })}</div>
                </div>
              </div>
            </div>
            {/* Employees Tab */}
            {payrollActiveTab === 'employees' && (
              <div className="table-container" style={{ marginTop: '2rem' }}>
                <h4>Employee List</h4>
                <ImportExport
                  data={employees}
                  onImport={(importedData) => {
                    setEmployees(importedData.map((emp, idx) => ({
                      id: emp.id || Date.now() + idx,
                      ...emp,
                      basicSalary: parseFloat(emp.basicSalary) || 0
                    })))
                    alert(`Imported ${importedData.length} employees successfully!`)
                  }}
                  onExport={() => employees}
                  filename="employees"
                  importFields={['name', 'employeeId', 'department', 'designation', 'basicSalary', 'hra', 'transport', 'medical']}
                  exportFields={['id', 'name', 'employeeId', 'department', 'designation', 'basicSalary']}
                  title="Employee Import/Export"
                />
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Basic Salary</th>
                      <th>PF</th>
                      <th>ESI</th>
                      <th>Net Salary</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                          No employees found. Click "Add Employee" to add employees.
                        </td>
                      </tr>
                    ) : (
                      employees.map(emp => {
                        const salaryDetails = calculateSalary(
                          emp.basicSalary || 0,
                          { hra: emp.hra || 0, transport: emp.transport || 0, medical: emp.medical || 0 },
                          { pf: emp.pf || 0, esi: emp.esi || 0 }
                        )
                        return (
                          <tr key={emp.id}>
                            <td>{emp.employeeId || emp.id}</td>
                            <td>{emp.name}</td>
                            <td>{emp.department}</td>
                            <td>{emp.designation}</td>
                            <td>₹{salaryDetails.basicSalary.toLocaleString()}</td>
                            <td>₹{salaryDetails.deductions.pf.toLocaleString()}</td>
                            <td>₹{salaryDetails.deductions.esi.toLocaleString()}</td>
                            <td>₹{salaryDetails.netSalary.toLocaleString()}</td>
                            <td>
                              <button className="icon-btn" onClick={() => {
                                setSelectedEmployee(emp)
                                setEmployeeForm(emp)
                                setShowPayrollModal(true)
                              }}><Edit size={16} /></button>
                              <button className="icon-btn" onClick={() => {
                                const payslip = generatePayslip(emp, salaryDetails, new Date().getMonth() + 1, new Date().getFullYear())
                                exportReportToCSV([payslip], `Payslip_${emp.name}_${new Date().getMonth() + 1}_${new Date().getFullYear()}.csv`)
                                alert(`Payslip generated for ${emp.name}!`)
                              }}><FileText size={16} /></button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Salary Computation Tab */}
            {payrollActiveTab === 'salary' && selectedEmployee && (
              <div className="salary-computation-section" style={{ marginTop: '2rem' }}>
                <h4>Salary Computation for {selectedEmployee.name}</h4>
                {salaryCalculation && (
                  <div className="salary-breakdown">
                    <div className="breakdown-row">
                      <span>Basic Salary:</span>
                      <span>₹{salaryCalculation.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>HRA:</span>
                      <span>₹{salaryCalculation.allowances.hra.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>Transport:</span>
                      <span>₹{salaryCalculation.allowances.transport.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>Medical:</span>
                      <span>₹{salaryCalculation.allowances.medical.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row total">
                      <span>Gross Salary:</span>
                      <span>₹{salaryCalculation.grossSalary.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>PF:</span>
                      <span>₹{salaryCalculation.deductions.pf.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>ESI:</span>
                      <span>₹{salaryCalculation.deductions.esi.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>TDS:</span>
                      <span>₹{salaryCalculation.deductions.tds.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row total">
                      <span>Net Salary:</span>
                      <span>₹{salaryCalculation.netSalary.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                <button className="save-btn" onClick={() => {
                  const calc = calculateSalary(
                    employeeForm.basicSalary,
                    { hra: employeeForm.hra, transport: employeeForm.transport, medical: employeeForm.medical },
                    { 
                      pf: calculatePF(employeeForm.basicSalary, employeeForm.pfRate).employee,
                      esi: calculateESI(employeeForm.basicSalary + employeeForm.hra + employeeForm.transport + employeeForm.medical).employee,
                      tds: calculateTDS((employeeForm.basicSalary + employeeForm.hra + employeeForm.transport + employeeForm.medical) * 12).monthlyTax
                    }
                  )
                  setSalaryCalculation(calc)
                }}>
                  Calculate Salary
                </button>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="setup-section">
            <h3>Financial Dashboard</h3>
            <div className="dashboard-tiles-grid">
              <div className="dashboard-tile gst">
                <FileCheck size={24} />
                <div>
                  <div className="tile-label">GST Summary</div>
                  <div className="tile-value">₹0</div>
                </div>
              </div>
              <div className="dashboard-tile sales">
                <TrendingUp size={24} />
                <div>
                  <div className="tile-label">Sales Summary</div>
                  <div className="tile-value">₹0</div>
                </div>
              </div>
              <div className="dashboard-tile receivables">
                <Users size={24} />
                <div>
                  <div className="tile-label">Receivables</div>
                  <div className="tile-value">₹{customers.reduce((sum, c) => sum + (c.openingBalance || 0), 0).toLocaleString()}</div>
                </div>
              </div>
              <div className="dashboard-tile payables">
                <Truck size={24} />
                <div>
                  <div className="tile-label">Payables</div>
                  <div className="tile-value">₹{suppliers.reduce((sum, s) => sum + (s.openingBalance || 0), 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
              <div className="dashboard-card large">
                <h4>Financial Overview</h4>
                <div className="dashboard-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Revenue</span>
                    <span className="stat-value">₹0</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Expenses</span>
                    <span className="stat-value">₹0</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Net Profit</span>
                    <span className="stat-value">₹0</span>
                  </div>
                </div>
              </div>
              <div className="dashboard-card">
                <h4>Cash Flow</h4>
                <div className="stat-value">₹0</div>
              </div>
              <div className="dashboard-card">
                <h4>Receivables</h4>
                <div className="stat-value">₹{customers.reduce((sum, c) => sum + (c.openingBalance || 0), 0).toLocaleString()}</div>
              </div>
              <div className="dashboard-card">
                <h4>Payables</h4>
                <div className="stat-value">₹{suppliers.reduce((sum, s) => sum + (s.openingBalance || 0), 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
              </div>

              {/* Payroll Employee Modal */}
              <PayrollEmployeeModal
                showPayrollModal={showPayrollModal}
                setShowPayrollModal={setShowPayrollModal}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                employeeForm={employeeForm}
                setEmployeeForm={setEmployeeForm}
                employees={employees}
                setEmployees={setEmployees}
              />
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

// Old BillingSection implementation removed - using stub version at top of file
// The old implementation has been completely removed to avoid parsing conflicts

export default AccountsPlus
