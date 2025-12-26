"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Format currency consistently to avoid hydration mismatch
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};
import {
  ArrowLeft,
  Building2,
  FileText,
  IndianRupee,
  Calendar,
  Download,
  Printer,
  Mail,
  Filter,
  Plus,
  Banknote,
  CreditCard,
  Wallet,
  HandCoins,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Types
interface Transaction {
  id: string;
  date: Date;
  type: "purchase" | "payment" | "debit-note" | "credit-note";
  documentNo: string;
  description: string;
  paymentType?: "cash" | "credit" | "partial";
  paymentMethod?: "cash" | "card" | "upi" | "bank" | "cheque";
  debit: number;
  credit: number;
  balance: number;
  status: "paid" | "partial" | "pending" | "overdue";
  dueDate?: Date;
  partialPaid?: number;
  items?: number;
}

interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  category: string;
  creditLimit: number;
  openingBalance: number;
  paymentTerms: string;
}

// Mock supplier data
const mockSupplier: Supplier = {
  id: "1",
  companyName: "Tata Consumer Products",
  contactPerson: "Vikram Singh",
  phone: "9876543210",
  email: "orders@tata.com",
  address: "Tata Centre, Mumbai",
  gstin: "27AAAAA0000A1Z5",
  category: "Grocery",
  creditLimit: 200000,
  openingBalance: 0,
  paymentTerms: "Net 30",
};

// Mock transaction data
const mockTransactions: Transaction[] = [
  { id: "1", date: new Date(2025, 11, 22), type: "purchase", documentNo: "PO-0045/25-26", description: "Purchase Order - Salt, Tea (50 items)", paymentType: "credit", debit: 0, credit: 24500, balance: 24500, status: "pending", dueDate: new Date(2026, 0, 21), items: 50 },
  { id: "2", date: new Date(2025, 11, 20), type: "payment", documentNo: "PAY-0032", description: "Payment Made - Bank Transfer", paymentMethod: "bank", debit: 18000, credit: 0, balance: 0, status: "paid" },
  { id: "3", date: new Date(2025, 11, 18), type: "purchase", documentNo: "PO-0042/25-26", description: "Purchase Order - Tea (30 items)", paymentType: "partial", debit: 0, credit: 32000, balance: 18000, status: "partial", dueDate: new Date(2026, 0, 17), partialPaid: 14000, items: 30 },
  { id: "4", date: new Date(2025, 11, 18), type: "payment", documentNo: "PAY-0031", description: "Partial Payment - Cheque", paymentMethod: "cheque", debit: 14000, credit: 0, balance: 0, status: "paid" },
  { id: "5", date: new Date(2025, 11, 15), type: "purchase", documentNo: "PO-0038/25-26", description: "Purchase Order - Salt (100 items)", paymentType: "cash", debit: 0, credit: 15600, balance: 0, status: "paid", items: 100 },
  { id: "6", date: new Date(2025, 11, 15), type: "payment", documentNo: "PAY-0028", description: "Payment Made - Cash on Delivery", paymentMethod: "cash", debit: 15600, credit: 0, balance: 0, status: "paid" },
  { id: "7", date: new Date(2025, 11, 12), type: "purchase", documentNo: "PO-0035/25-26", description: "Purchase Order - Assorted (75 items)", paymentType: "credit", debit: 0, credit: 45000, balance: 45000, status: "overdue", dueDate: new Date(2025, 11, 27), items: 75 },
  { id: "8", date: new Date(2025, 11, 10), type: "debit-note", documentNo: "DN-0003", description: "Debit Note - Damaged goods returned", debit: 2500, credit: 0, balance: 0, status: "paid" },
  { id: "9", date: new Date(2025, 11, 8), type: "purchase", documentNo: "PO-0030/25-26", description: "Purchase Order - Premium Tea (40 items)", paymentType: "cash", debit: 0, credit: 28000, balance: 0, status: "paid", items: 40 },
  { id: "10", date: new Date(2025, 11, 8), type: "payment", documentNo: "PAY-0025", description: "Payment Made - UPI", paymentMethod: "upi", debit: 28000, credit: 0, balance: 0, status: "paid" },
  { id: "11", date: new Date(2025, 11, 5), type: "purchase", documentNo: "PO-0025/25-26", description: "Purchase Order - Salt (60 items)", paymentType: "credit", debit: 0, credit: 12000, balance: 0, status: "paid", dueDate: new Date(2025, 12, 5), items: 60 },
  { id: "12", date: new Date(2025, 11, 6), type: "payment", documentNo: "PAY-0022", description: "Payment Made - Bank Transfer", paymentMethod: "bank", debit: 12000, credit: 0, balance: 0, status: "paid" },
];

const statusConfig = {
  paid: { label: "Paid", color: "bg-success/10 text-success", icon: CheckCircle2 },
  partial: { label: "Partial", color: "bg-warning/10 text-warning", icon: HandCoins },
  pending: { label: "Pending", color: "bg-blue-500/10 text-blue-500", icon: Clock },
  overdue: { label: "Overdue", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
};

const paymentTypeConfig = {
  cash: { label: "Cash", color: "bg-success/10 text-success", icon: Banknote },
  credit: { label: "Credit", color: "bg-warning/10 text-warning", icon: Wallet },
  partial: { label: "Partial", color: "bg-primary/10 text-primary", icon: HandCoins },
};

export default function SupplierStatementPage() {
  const params = useParams();
  const router = useRouter();
  const [supplier] = useState<Supplier>(mockSupplier);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [dateFilter, setDateFilter] = useState<"all" | "month" | "quarter" | "year">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "purchase" | "payment" | "debit-note">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "partial" | "pending" | "overdue">("all");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi" | "bank" | "cheque">("bank");
  const [paymentNote, setPaymentNote] = useState("");

  // Calculate running balance (for suppliers: credit increases balance, debit decreases)
  const transactionsWithBalance = useMemo(() => {
    let runningBalance = supplier.openingBalance;
    const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return sorted.map((t) => {
      runningBalance += t.credit - t.debit; // Opposite of customer
      return { ...t, runningBalance };
    }).reverse();
  }, [transactions, supplier.openingBalance]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactionsWithBalance.filter((t) => {
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const now = new Date();
        const transDate = new Date(t.date);
        if (dateFilter === "month") {
          matchesDate = transDate.getMonth() === now.getMonth() && transDate.getFullYear() === now.getFullYear();
        } else if (dateFilter === "quarter") {
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const transQuarter = Math.floor(transDate.getMonth() / 3);
          matchesDate = transQuarter === currentQuarter && transDate.getFullYear() === now.getFullYear();
        } else if (dateFilter === "year") {
          matchesDate = transDate.getFullYear() === now.getFullYear();
        }
      }
      
      return matchesType && matchesStatus && matchesDate;
    });
  }, [transactionsWithBalance, typeFilter, statusFilter, dateFilter]);

  // Summary calculations
  const summary = useMemo(() => {
    const totalPurchases = transactions.filter((t) => t.type === "purchase").reduce((sum, t) => sum + t.credit, 0);
    const totalPayments = transactions.filter((t) => t.type === "payment").reduce((sum, t) => sum + t.debit, 0);
    const totalDebitNotes = transactions.filter((t) => t.type === "debit-note").reduce((sum, t) => sum + t.debit, 0);
    const currentBalance = totalPurchases - totalPayments - totalDebitNotes + supplier.openingBalance;
    
    const pendingPurchases = transactions.filter((t) => t.type === "purchase" && (t.status === "pending" || t.status === "partial" || t.status === "overdue"));
    const overdueAmount = pendingPurchases.filter((t) => t.status === "overdue").reduce((sum, t) => sum + (t.balance || 0), 0);
    
    const cashPurchases = transactions.filter((t) => t.type === "purchase" && t.paymentType === "cash").reduce((sum, t) => sum + t.credit, 0);
    const creditPurchases = transactions.filter((t) => t.type === "purchase" && t.paymentType === "credit").reduce((sum, t) => sum + t.credit, 0);
    const partialPurchases = transactions.filter((t) => t.type === "purchase" && t.paymentType === "partial").reduce((sum, t) => sum + t.credit, 0);
    
    return {
      totalPurchases,
      totalPayments,
      totalDebitNotes,
      currentBalance,
      overdueAmount,
      pendingCount: pendingPurchases.length,
      cashPurchases,
      creditPurchases,
      partialPurchases,
      availableCredit: supplier.creditLimit - currentBalance,
    };
  }, [transactions, supplier]);

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h1 className="text-lg font-bold">{supplier.companyName}</h1>
              <p className="text-xs text-muted-foreground">{supplier.contactPerson} • {supplier.phone} • {supplier.paymentTerms}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddPayment(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Make Payment
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Mail className="w-4 h-4" />
            Email
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="text-xs text-muted-foreground mb-1">Current Balance</div>
            <div className={`text-2xl font-bold ${summary.currentBalance > 0 ? "text-destructive" : "text-success"}`}>
              ₹{formatCurrency(Math.abs(summary.currentBalance))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {summary.currentBalance > 0 ? "To Pay" : summary.currentBalance < 0 ? "Advance" : "Settled"}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-xs text-muted-foreground mb-1">Total Purchases</div>
            <div className="text-2xl font-bold text-warning">₹{formatCurrency(summary.totalPurchases)}</div>
            <div className="text-xs text-muted-foreground mt-1">{transactions.filter((t) => t.type === "purchase").length} orders</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-xs text-muted-foreground mb-1">Total Payments</div>
            <div className="text-2xl font-bold text-success">₹{formatCurrency(summary.totalPayments)}</div>
            <div className="text-xs text-muted-foreground mt-1">{transactions.filter((t) => t.type === "payment").length} payments</div>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="text-xs text-muted-foreground mb-1">Overdue Amount</div>
            <div className="text-2xl font-bold text-destructive">₹{formatCurrency(summary.overdueAmount)}</div>
            <div className="text-xs text-muted-foreground mt-1">{summary.pendingCount} pending bills</div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-xs text-muted-foreground mb-1">Credit Limit</div>
            <div className="text-2xl font-bold text-primary">₹{formatCurrency(supplier.creditLimit)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Available: ₹{formatCurrency(Math.max(0, summary.availableCredit))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-muted border border-border">
            <div className="text-xs text-muted-foreground mb-1">Purchase Breakdown</div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-success">Cash/COD</span>
                <span className="font-medium">₹{formatCurrency(summary.cashPurchases)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-warning">Credit</span>
                <span className="font-medium">₹{formatCurrency(summary.creditPurchases)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-primary">Partial</span>
                <span className="font-medium">₹{formatCurrency(summary.partialPurchases)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
          className="h-9 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warning"
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="h-9 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warning"
        >
          <option value="all">All Types</option>
          <option value="purchase">Purchases</option>
          <option value="payment">Payments</option>
          <option value="debit-note">Debit Notes</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="h-9 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warning"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>

        <div className="flex-1" />
        
        <div className="text-sm text-muted-foreground">
          Showing {filteredTransactions.length} of {transactions.length} entries
        </div>
      </div>

      {/* Statement Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0">
            <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-3 w-28">Date</th>
              <th className="px-6 py-3">Document</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-center">Type</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-right">Debit (₹)</th>
              <th className="px-6 py-3 text-right">Credit (₹)</th>
              <th className="px-6 py-3 text-right">Balance (₹)</th>
              <th className="px-6 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Opening Balance Row */}
            <tr className="bg-muted/30">
              <td className="px-6 py-3 text-sm font-medium">-</td>
              <td className="px-6 py-3 text-sm font-medium">Opening Balance</td>
              <td className="px-6 py-3 text-sm text-muted-foreground">Balance brought forward</td>
              <td className="px-6 py-3"></td>
              <td className="px-6 py-3"></td>
              <td className="px-6 py-3 text-right font-medium">{supplier.openingBalance < 0 ? formatCurrency(Math.abs(supplier.openingBalance)) : "-"}</td>
              <td className="px-6 py-3 text-right font-medium">{supplier.openingBalance > 0 ? formatCurrency(supplier.openingBalance) : "-"}</td>
              <td className="px-6 py-3 text-right font-bold">{formatCurrency(supplier.openingBalance)}</td>
              <td className="px-6 py-3"></td>
            </tr>

            {filteredTransactions.map((transaction) => {
              const status = statusConfig[transaction.status];
              const StatusIcon = status.icon;
              const paymentType = transaction.paymentType ? paymentTypeConfig[transaction.paymentType] : null;
              const PaymentIcon = paymentType?.icon;

              return (
                <>
                  <tr
                    key={transaction.id}
                    className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                      expandedRow === transaction.id ? "bg-muted/20" : ""
                    }`}
                    onClick={() => setExpandedRow(expandedRow === transaction.id ? null : transaction.id)}
                  >
                    <td className="px-6 py-3">
                      <div className="text-sm">{formatDate(transaction.date)}</div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          transaction.type === "purchase" ? "bg-warning/10" :
                          transaction.type === "payment" ? "bg-success/10" : "bg-primary/10"
                        }`}>
                          {transaction.type === "purchase" ? (
                            <Truck className="w-4 h-4 text-warning" />
                          ) : transaction.type === "payment" ? (
                            <Banknote className="w-4 h-4 text-success" />
                          ) : (
                            <FileText className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <span className="font-mono text-sm font-medium">{transaction.documentNo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="text-sm">{transaction.description}</div>
                      {transaction.dueDate && transaction.status !== "paid" && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Due: {formatDate(transaction.dueDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {paymentType && PaymentIcon && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentType.color}`}>
                          <PaymentIcon className="w-3 h-3" />
                          {paymentType.label}
                        </span>
                      )}
                      {transaction.paymentMethod && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted">
                          {transaction.paymentMethod.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {transaction.debit > 0 ? (
                        <span className="font-medium text-success flex items-center justify-end gap-1">
                          <ArrowDownRight className="w-3 h-3" />
                          {formatCurrency(transaction.debit)}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {transaction.credit > 0 ? (
                        <span className="font-medium text-destructive flex items-center justify-end gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          {formatCurrency(transaction.credit)}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className={`font-bold ${
                        transaction.runningBalance > 0 ? "text-destructive" : 
                        transaction.runningBalance < 0 ? "text-success" : ""
                      }`}>
                        {formatCurrency(transaction.runningBalance)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {expandedRow === transaction.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedRow === transaction.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan={9} className="bg-muted/10 px-6 py-4">
                          <div className="grid grid-cols-4 gap-4">
                            {transaction.type === "purchase" && (
                              <>
                                <div>
                                  <div className="text-xs text-muted-foreground">Items</div>
                                  <div className="font-medium">{transaction.items || "-"} items</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Purchase Amount</div>
                                  <div className="font-medium">₹{formatCurrency(transaction.credit)}</div>
                                </div>
                                {transaction.partialPaid !== undefined && (
                                  <div>
                                    <div className="text-xs text-muted-foreground">Amount Paid</div>
                                    <div className="font-medium text-success">₹{formatCurrency(transaction.partialPaid)}</div>
                                  </div>
                                )}
                                {transaction.balance > 0 && (
                                  <div>
                                    <div className="text-xs text-muted-foreground">Balance Due</div>
                                    <div className="font-medium text-destructive">₹{formatCurrency(transaction.balance)}</div>
                                  </div>
                                )}
                              </>
                            )}
                            {transaction.type === "payment" && (
                              <>
                                <div>
                                  <div className="text-xs text-muted-foreground">Payment Method</div>
                                  <div className="font-medium">{transaction.paymentMethod?.toUpperCase() || "-"}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Amount Paid</div>
                                  <div className="font-medium text-success">₹{formatCurrency(transaction.debit)}</div>
                                </div>
                              </>
                            )}
                            <div className="col-span-4 flex gap-2 mt-2">
                              <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors">
                                View Details
                              </button>
                              <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors">
                                Print
                              </button>
                              {transaction.type === "purchase" && transaction.status !== "paid" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAddPayment(true);
                                    setPaymentAmount(transaction.balance.toString());
                                  }}
                                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                                >
                                  Make Payment
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </>
              );
            })}

            {/* Closing Balance Row */}
            <tr className="bg-warning/5 font-bold">
              <td className="px-6 py-4 text-sm">-</td>
              <td className="px-6 py-4 text-sm">Closing Balance</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">As of {formatDate(new Date())}</td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-right text-success">{formatCurrency(summary.totalPayments + summary.totalDebitNotes)}</td>
              <td className="px-6 py-4 text-right text-warning">{formatCurrency(summary.totalPurchases)}</td>
              <td className="px-6 py-4 text-right text-xl">
                <span className={summary.currentBalance > 0 ? "text-destructive" : "text-success"}>
                  ₹{formatCurrency(Math.abs(summary.currentBalance))}
                </span>
              </td>
              <td className="px-6 py-4"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Payment Modal */}
      <AnimatePresence>
        {showAddPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddPayment(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-destructive" />
                    Make Payment
                  </h2>
                  <button
                    onClick={() => setShowAddPayment(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Supplier: <span className="font-medium text-foreground">{supplier.companyName}</span>
                </div>
                <div className="mt-1 text-sm">
                  Outstanding: <span className="font-bold text-destructive">₹{summary.currentBalance.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full h-11 pl-9 pr-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[25, 50, 75, 100].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => setPaymentAmount(Math.round(summary.currentBalance * percent / 100).toString())}
                        className="flex-1 h-8 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 transition-colors"
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(["cash", "card", "upi", "bank", "cheque"] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === method
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : "border-border hover:border-destructive/50"
                        }`}
                      >
                        {method === "cash" && <Banknote className="w-4 h-4" />}
                        {method === "card" && <CreditCard className="w-4 h-4" />}
                        {method === "upi" && <Wallet className="w-4 h-4" />}
                        {method === "bank" && <IndianRupee className="w-4 h-4" />}
                        {method === "cheque" && <FileText className="w-4 h-4" />}
                        <span className="text-[10px] font-medium capitalize">{method}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Note (Optional)</label>
                  <textarea
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="Add payment reference, cheque no., etc..."
                    className="w-full h-20 p-3 bg-background border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-destructive"
                  />
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowAddPayment(false)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle payment
                    setShowAddPayment(false);
                    setPaymentAmount("");
                    setPaymentNote("");
                  }}
                  disabled={!paymentAmount || Number(paymentAmount) <= 0}
                  className="flex-1 h-11 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Make Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
