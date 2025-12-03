// Feature configurations for each module
import {
  ShoppingCart,
  Receipt,
  CreditCard,
  History,
  BarChart3,
  Settings,
  Users,
  UserPlus,
  UserCheck,
  Calendar,
  MessageSquare,
  TrendingUp,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  PieChart,
  FileText,
  Package,
  PackageCheck,
  PackageX,
  Warehouse,
  ClipboardList,
  AlertCircle,
  Building2,
  BookOpen,
  FileCheck,
  Printer,
  FileBarChart,
  ShoppingBag,
  Truck,
  Repeat,
  Percent,
  Wallet,
  PackageSearch,
  Upload,
  QrCode,
  ScanLine
} from 'lucide-react'

export const moduleFeatures = {
  '/pos': [
    { path: '/pos', icon: ShoppingCart, label: 'New Bill', exact: true },
    { path: '/pos/products', icon: PackageSearch, label: 'Products & Inventory' },
    { path: '/pos/entities', icon: Building2, label: 'Entity' },
    { path: '/pos/quotation', icon: FileText, label: 'Quotation' },
    { path: '/pos/sales', icon: Receipt, label: 'History' },
    { path: '/pos/payments', icon: CreditCard, label: 'Payments' },
    { path: '/pos/returns', icon: History, label: 'Returns & Refunds' },
    { path: '/pos/reports', icon: BarChart3, label: 'Reports' },
    { path: '/pos/sales-reports', icon: BarChart3, label: 'Sales Reports' },
    { path: '/pos/settings', icon: Settings, label: 'POS Settings' },
  ],
  '/crm': [
    { path: '/crm', icon: Users, label: 'All Customers', exact: true },
    { path: '/crm/add', icon: UserPlus, label: 'Add Customer' },
    { path: '/crm/leads', icon: UserCheck, label: 'Leads' },
    { path: '/crm/activities', icon: Calendar, label: 'Activities' },
    { path: '/crm/communications', icon: MessageSquare, label: 'Communications' },
    { path: '/crm/analytics', icon: TrendingUp, label: 'Analytics' },
  ],
  '/income-expense': [
    { path: '/income-expense', icon: DollarSign, label: 'Overview', exact: true },
    { path: '/income-expense/income', icon: ArrowUpCircle, label: 'Income' },
    { path: '/income-expense/expense', icon: ArrowDownCircle, label: 'Expenses' },
    { path: '/income-expense/categories', icon: PieChart, label: 'Categories' },
    { path: '/income-expense/reports', icon: FileText, label: 'Reports' },
  ],
  '/invento': [
    { path: '/invento', icon: Package, label: 'Inventory', exact: true },
    { path: '/invento/warehouses', icon: Warehouse, label: 'Warehouses & Branches' },
    { path: '/invento/reports', icon: ClipboardList, label: 'Stock Reports' },
    { path: '/invento/alerts', icon: AlertCircle, label: 'Low Stock Alerts' },
  ],
  '/accounts-plus': [
    { path: '/accounts-plus', icon: Building2, label: 'Company Setup', exact: true },
    { path: '/accounts-plus/ledgers', icon: BookOpen, label: 'Chart of Accounts' },
    { path: '/accounts-plus/parties', icon: Users, label: 'Customers & Suppliers' },
    { path: '/accounts-plus/items', icon: Package, label: 'Items Master' },
    { path: '/accounts-plus/heads', icon: DollarSign, label: 'Expense/Income Heads' },
    { path: '/accounts-plus/opening-balances', icon: DollarSign, label: 'Opening Balances' },
    { path: '/accounts-plus/tax', icon: FileCheck, label: 'Tax & Compliance' },
    { path: '/accounts-plus/billing', icon: Receipt, label: 'Sales / Billing / Purchases' },
    { path: '/accounts-plus/layout', icon: Printer, label: 'Document Layout' },
    { path: '/accounts-plus/visual-designer', icon: FileText, label: 'Visual Designer' },
    { path: '/accounts-plus/integrations', icon: FileText, label: 'Integrations' },
    { path: '/accounts-plus/auto-posting', icon: FileText, label: 'Auto Posting' },
    { path: '/accounts-plus/receivables-payables', icon: FileCheck, label: 'Receivables/Payables' },
    { path: '/accounts-plus/projects', icon: Package, label: 'Project Accounting' },
    { path: '/accounts-plus/dashboard', icon: FileBarChart, label: 'Dashboard' },
    { path: '/accounts-plus/reports', icon: FileBarChart, label: 'Financial Reports' },
  ],
}

export const getModuleFeatures = (pathname) => {
  // Find the module path that matches
  for (const [modulePath] of Object.entries(moduleFeatures)) {
    if (pathname.startsWith(modulePath)) {
      return moduleFeatures[modulePath]
    }
  }
  return null
}

export const getModuleTitle = (pathname) => {
  const titles = {
    '/pos': 'BillEase POS',
    '/crm': 'CRM',
    '/income-expense': 'Income & Expense',
    '/invento': 'Invento',
    '/accounts-plus': 'BillEase ACCOUNTS+',
  }
  
  for (const [modulePath, title] of Object.entries(titles)) {
    if (pathname.startsWith(modulePath)) {
      return title
    }
  }
  return 'Dashboard'
}

