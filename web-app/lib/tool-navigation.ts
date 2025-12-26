/**
 * BillEase Suite - Tool Navigation Configuration
 * Each tool has its own sidebar navigation with specific features/sections
 */

import {
  ShoppingCart,
  Receipt,
  History,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  Package,
  Tag,
  Printer,
  UserPlus,
  UserCheck,
  MessageSquare,
  Mail,
  Phone,
  Target,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpCircle,
  ArrowDownCircle,
  Calculator,
  ClipboardList,
  Boxes,
  Truck,
  AlertTriangle,
  RotateCcw,
  Warehouse,
  ScanLine,
  BookOpen,
  Landmark,
  FileSpreadsheet,
  Scale,
  IndianRupee,
  PieChart,
  Building2,
  BadgePercent,
  FileEdit,
  type LucideIcon,
} from "lucide-react";

export interface ToolNavItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
}

export interface ToolNavSection {
  id: string;
  title: string;
  items: ToolNavItem[];
}

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  basePath: string;
  sections: ToolNavSection[];
}

// POS Navigation
export const posNavigation: ToolConfig = {
  id: "pos",
  name: "POS",
  description: "Point of Sale",
  icon: ShoppingCart,
  color: "from-blue-500 to-cyan-500",
  basePath: "/workspace/pos",
  sections: [
    {
      id: "sales",
      title: "Sales",
      items: [
        { id: "billing", name: "New Bill", href: "/workspace/pos", icon: ShoppingCart, description: "Create new sale" },
        { id: "transactions", name: "Transactions", href: "/workspace/pos/transactions", icon: History, description: "View all sales" },
        { id: "returns", name: "Returns", href: "/workspace/pos/returns", icon: RotateCcw, description: "Process returns" },
        { id: "held-bills", name: "Held Bills", href: "/workspace/pos/held", icon: ClipboardList, description: "Resume held bills", badge: "3" },
      ],
    },
    {
      id: "estimates",
      title: "Estimates",
      items: [
        { id: "new-estimate", name: "New Estimate", href: "/workspace/pos/estimates", icon: FileEdit, description: "Create quotation" },
        { id: "estimate-list", name: "All Estimates", href: "/workspace/pos/estimates/list", icon: FileText, description: "View estimates" },
      ],
    },
    {
      id: "contacts",
      title: "Customers & Suppliers",
      items: [
        { id: "customers", name: "Customers", href: "/workspace/pos/customers", icon: UserCheck, description: "Customer database" },
        { id: "suppliers", name: "Suppliers", href: "/workspace/pos/suppliers", icon: Building2, description: "Supplier management" },
      ],
    },
    {
      id: "catalog",
      title: "Catalog",
      items: [
        { id: "products", name: "Products", href: "/workspace/pos/products", icon: Package, description: "Manage products" },
        { id: "categories", name: "Categories", href: "/workspace/pos/categories", icon: Tag, description: "Product categories" },
        { id: "pricing", name: "Pricing", href: "/workspace/pos/pricing", icon: BadgePercent, description: "Price management" },
      ],
    },
    {
      id: "reports",
      title: "Reports",
      items: [
        { id: "sales-report", name: "Sales Report", href: "/workspace/pos/reports/sales", icon: BarChart3, description: "Sales analytics" },
        { id: "daily-summary", name: "Daily Summary", href: "/workspace/pos/reports/daily", icon: FileText, description: "Day end report" },
      ],
    },
    {
      id: "config",
      title: "Configuration",
      items: [
        { id: "printers", name: "Printers", href: "/workspace/pos/printers", icon: Printer, description: "Receipt printers" },
        { id: "payment-modes", name: "Payment Modes", href: "/workspace/pos/payments", icon: CreditCard, description: "Payment methods" },
        { id: "pos-settings", name: "POS Settings", href: "/workspace/pos/settings", icon: Settings, description: "POS configuration" },
      ],
    },
  ],
};

// CRM Navigation
export const crmNavigation: ToolConfig = {
  id: "crm",
  name: "CRM",
  description: "Customer Relations",
  icon: Users,
  color: "from-purple-500 to-pink-500",
  basePath: "/workspace/crm",
  sections: [
    {
      id: "contacts",
      title: "Contacts",
      items: [
        { id: "all-contacts", name: "All Contacts", href: "/workspace/crm", icon: Users, description: "View all contacts" },
        { id: "customers", name: "Customers", href: "/workspace/crm/customers", icon: UserCheck, description: "Customer database" },
        { id: "leads", name: "Leads", href: "/workspace/crm/leads", icon: UserPlus, description: "Lead management", badge: "12" },
        { id: "vendors", name: "Vendors", href: "/workspace/crm/vendors", icon: Building2, description: "Supplier contacts" },
      ],
    },
    {
      id: "communication",
      title: "Communication",
      items: [
        { id: "messages", name: "Messages", href: "/workspace/crm/messages", icon: MessageSquare, description: "Chat & messages" },
        { id: "emails", name: "Emails", href: "/workspace/crm/emails", icon: Mail, description: "Email campaigns" },
        { id: "calls", name: "Call Log", href: "/workspace/crm/calls", icon: Phone, description: "Call history" },
      ],
    },
    {
      id: "pipeline",
      title: "Sales Pipeline",
      items: [
        { id: "deals", name: "Deals", href: "/workspace/crm/deals", icon: Target, description: "Deal tracking" },
        { id: "tasks", name: "Tasks", href: "/workspace/crm/tasks", icon: ClipboardList, description: "Follow-up tasks" },
        { id: "calendar", name: "Calendar", href: "/workspace/crm/calendar", icon: Calendar, description: "Appointments" },
      ],
    },
    {
      id: "analytics",
      title: "Analytics",
      items: [
        { id: "crm-reports", name: "Reports", href: "/workspace/crm/reports", icon: BarChart3, description: "CRM analytics" },
        { id: "insights", name: "Insights", href: "/workspace/crm/insights", icon: PieChart, description: "Customer insights" },
      ],
    },
  ],
};

// ExIn Navigation
export const exinNavigation: ToolConfig = {
  id: "exin",
  name: "ExIn",
  description: "Expense & Income",
  icon: TrendingUp,
  color: "from-green-500 to-emerald-500",
  basePath: "/workspace/exin",
  sections: [
    {
      id: "transactions",
      title: "Transactions",
      items: [
        { id: "overview", name: "Overview", href: "/workspace/exin", icon: Wallet, description: "Financial overview" },
        { id: "income", name: "Income", href: "/workspace/exin/income", icon: ArrowUpCircle, description: "Record income" },
        { id: "expenses", name: "Expenses", href: "/workspace/exin/expenses", icon: ArrowDownCircle, description: "Track expenses" },
        { id: "transfers", name: "Transfers", href: "/workspace/exin/transfers", icon: RotateCcw, description: "Fund transfers" },
      ],
    },
    {
      id: "accounts",
      title: "Accounts",
      items: [
        { id: "bank-accounts", name: "Bank Accounts", href: "/workspace/exin/banks", icon: Landmark, description: "Bank management" },
        { id: "cash", name: "Cash in Hand", href: "/workspace/exin/cash", icon: IndianRupee, description: "Cash tracking" },
        { id: "savings", name: "Savings", href: "/workspace/exin/savings", icon: PiggyBank, description: "Savings accounts" },
      ],
    },
    {
      id: "planning",
      title: "Planning",
      items: [
        { id: "budgets", name: "Budgets", href: "/workspace/exin/budgets", icon: Target, description: "Budget planning" },
        { id: "categories", name: "Categories", href: "/workspace/exin/categories", icon: Tag, description: "Expense categories" },
        { id: "recurring", name: "Recurring", href: "/workspace/exin/recurring", icon: Calendar, description: "Recurring transactions" },
      ],
    },
    {
      id: "reports",
      title: "Reports",
      items: [
        { id: "exin-reports", name: "Reports", href: "/workspace/exin/reports", icon: BarChart3, description: "Financial reports" },
        { id: "trends", name: "Trends", href: "/workspace/exin/trends", icon: TrendingUp, description: "Spending trends" },
      ],
    },
  ],
};

// TracInvent Navigation
export const tracinventNavigation: ToolConfig = {
  id: "tracinvent",
  name: "TracInvent",
  description: "Inventory Tracking",
  icon: Package,
  color: "from-orange-500 to-red-500",
  basePath: "/workspace/tracinvent",
  sections: [
    {
      id: "inventory",
      title: "Inventory",
      items: [
        { id: "stock", name: "Stock Overview", href: "/workspace/tracinvent", icon: Boxes, description: "Current stock" },
        { id: "products", name: "Products", href: "/workspace/tracinvent/products", icon: Package, description: "Product master" },
        { id: "categories", name: "Categories", href: "/workspace/tracinvent/categories", icon: Tag, description: "Item categories" },
        { id: "barcode", name: "Barcode Scanner", href: "/workspace/tracinvent/scanner", icon: ScanLine, description: "Scan items" },
      ],
    },
    {
      id: "movement",
      title: "Stock Movement",
      items: [
        { id: "stock-in", name: "Stock In", href: "/workspace/tracinvent/stock-in", icon: ArrowDownCircle, description: "Receive stock" },
        { id: "stock-out", name: "Stock Out", href: "/workspace/tracinvent/stock-out", icon: ArrowUpCircle, description: "Issue stock" },
        { id: "transfers", name: "Transfers", href: "/workspace/tracinvent/transfers", icon: Truck, description: "Warehouse transfers" },
        { id: "adjustments", name: "Adjustments", href: "/workspace/tracinvent/adjustments", icon: Calculator, description: "Stock adjustments" },
      ],
    },
    {
      id: "warehouse",
      title: "Warehouse",
      items: [
        { id: "locations", name: "Locations", href: "/workspace/tracinvent/locations", icon: Warehouse, description: "Storage locations" },
        { id: "low-stock", name: "Low Stock", href: "/workspace/tracinvent/low-stock", icon: AlertTriangle, description: "Reorder alerts", badge: "5" },
      ],
    },
    {
      id: "reports",
      title: "Reports",
      items: [
        { id: "inventory-report", name: "Stock Report", href: "/workspace/tracinvent/reports/stock", icon: FileText, description: "Inventory report" },
        { id: "movement-report", name: "Movement Report", href: "/workspace/tracinvent/reports/movement", icon: BarChart3, description: "Stock movement" },
      ],
    },
  ],
};

// Accounts+ Navigation
export const accountsNavigation: ToolConfig = {
  id: "accounts",
  name: "Accounts+",
  description: "Accounting & GST",
  icon: BookOpen,
  color: "from-yellow-500 to-orange-500",
  basePath: "/workspace/accounts",
  sections: [
    {
      id: "books",
      title: "Books",
      items: [
        { id: "dashboard", name: "Dashboard", href: "/workspace/accounts", icon: BarChart3, description: "Accounts overview" },
        { id: "journal", name: "Journal", href: "/workspace/accounts/journal", icon: BookOpen, description: "Journal entries" },
        { id: "ledger", name: "Ledger", href: "/workspace/accounts/ledger", icon: FileSpreadsheet, description: "Account ledgers" },
        { id: "trial-balance", name: "Trial Balance", href: "/workspace/accounts/trial-balance", icon: Scale, description: "Trial balance" },
      ],
    },
    {
      id: "transactions",
      title: "Transactions",
      items: [
        { id: "invoices", name: "Invoices", href: "/workspace/accounts/invoices", icon: Receipt, description: "Sales invoices" },
        { id: "bills", name: "Bills", href: "/workspace/accounts/bills", icon: FileText, description: "Purchase bills" },
        { id: "payments", name: "Payments", href: "/workspace/accounts/payments", icon: CreditCard, description: "Payment records" },
        { id: "receipts", name: "Receipts", href: "/workspace/accounts/receipts", icon: IndianRupee, description: "Money receipts" },
      ],
    },
    {
      id: "gst",
      title: "GST & Tax",
      items: [
        { id: "gstr1", name: "GSTR-1", href: "/workspace/accounts/gst/gstr1", icon: FileText, description: "Outward supplies" },
        { id: "gstr3b", name: "GSTR-3B", href: "/workspace/accounts/gst/gstr3b", icon: FileText, description: "Monthly return" },
        { id: "gst-reports", name: "GST Reports", href: "/workspace/accounts/gst/reports", icon: BarChart3, description: "GST analytics" },
      ],
    },
    {
      id: "reports",
      title: "Financial Reports",
      items: [
        { id: "profit-loss", name: "Profit & Loss", href: "/workspace/accounts/reports/pnl", icon: TrendingUp, description: "P&L statement" },
        { id: "balance-sheet", name: "Balance Sheet", href: "/workspace/accounts/reports/balance-sheet", icon: Scale, description: "Balance sheet" },
        { id: "cash-flow", name: "Cash Flow", href: "/workspace/accounts/reports/cash-flow", icon: Wallet, description: "Cash flow statement" },
      ],
    },
  ],
};

// Export all tool configs
export const toolConfigs: Record<string, ToolConfig> = {
  pos: posNavigation,
  crm: crmNavigation,
  exin: exinNavigation,
  tracinvent: tracinventNavigation,
  accounts: accountsNavigation,
};

export function getToolConfig(toolId: string): ToolConfig | undefined {
  return toolConfigs[toolId];
}
