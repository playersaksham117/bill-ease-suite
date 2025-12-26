"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Format currency consistently to avoid hydration mismatch
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};
import {
  ArrowLeft,
  User,
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
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Types
interface Transaction {
  id: string;
  date: Date;
  type: "invoice" | "payment" | "credit-note" | "debit-note";
  documentNo: string;
  description: string;
  paymentType?: "cash" | "credit" | "partial";
  paymentMethod?: "cash" | "card" | "upi" | "bank";
  debit: number;
  credit: number;
  balance: number;
  status: "paid" | "partial" | "pending" | "overdue";
  dueDate?: Date;
  partialPaid?: number;
  items?: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  type: "regular" | "wholesale" | "retail";
  creditLimit: number;
  openingBalance: number;
}

// Mock customer data
const mockCustomer: Customer = {
  id: "1",
  name: "Rahul Sharma",
  phone: "9876543210",
  email: "rahul@email.com",
  address: "123, MG Road, Delhi",
  gstin: "07AAAAA0000A1Z5",
  type: "wholesale",
  creditLimit: 50000,
  openingBalance: 0,
};

// Mock transaction data
const mockTransactions: Transaction[] = [
  { id: "1", date: new Date(2025, 11, 22), type: "invoice", documentNo: "BEP-0045/25-26", description: "Sales Invoice - 12 items", paymentType: "credit", debit: 4580, credit: 0, balance: 4580, status: "pending", dueDate: new Date(2026, 0, 6), items: 12 },
  { id: "2", date: new Date(2025, 11, 20), type: "payment", documentNo: "REC-0032", description: "Payment Received - UPI", paymentMethod: "upi", debit: 0, credit: 3500, balance: 0, status: "paid" },
  { id: "3", date: new Date(2025, 11, 18), type: "invoice", documentNo: "BEP-0042/25-26", description: "Sales Invoice - 8 items", paymentType: "partial", debit: 6200, credit: 0, balance: 3500, status: "partial", dueDate: new Date(2026, 0, 2), partialPaid: 2700, items: 8 },
  { id: "4", date: new Date(2025, 11, 18), type: "payment", documentNo: "REC-0031", description: "Partial Payment - Cash", paymentMethod: "cash", debit: 0, credit: 2700, balance: 0, status: "paid" },
  { id: "5", date: new Date(2025, 11, 15), type: "invoice", documentNo: "BEP-0038/25-26", description: "Sales Invoice - 5 items", paymentType: "cash", debit: 2340, credit: 0, balance: 0, status: "paid", items: 5 },
  { id: "6", date: new Date(2025, 11, 15), type: "payment", documentNo: "REC-0028", description: "Payment Received - Cash", paymentMethod: "cash", debit: 0, credit: 2340, balance: 0, status: "paid" },
  { id: "7", date: new Date(2025, 11, 12), type: "invoice", documentNo: "BEP-0035/25-26", description: "Sales Invoice - 15 items", paymentType: "credit", debit: 8900, credit: 0, balance: 8900, status: "overdue", dueDate: new Date(2025, 11, 27), items: 15 },
  { id: "8", date: new Date(2025, 11, 10), type: "credit-note", documentNo: "CN-0005", description: "Credit Note - Returned goods", debit: 0, credit: 1200, balance: 0, status: "paid" },
  { id: "9", date: new Date(2025, 11, 8), type: "invoice", documentNo: "BEP-0030/25-26", description: "Sales Invoice - 20 items", paymentType: "cash", debit: 12500, credit: 0, balance: 0, status: "paid", items: 20 },
  { id: "10", date: new Date(2025, 11, 8), type: "payment", documentNo: "REC-0025", description: "Payment Received - Card", paymentMethod: "card", debit: 0, credit: 12500, balance: 0, status: "paid" },
  { id: "11", date: new Date(2025, 11, 5), type: "invoice", documentNo: "BEP-0025/25-26", description: "Sales Invoice - 6 items", paymentType: "credit", debit: 3200, credit: 0, balance: 0, status: "paid", dueDate: new Date(2025, 11, 20), items: 6 },
  { id: "12", date: new Date(2025, 11, 5), type: "payment", documentNo: "REC-0022", description: "Payment Received - Bank Transfer", paymentMethod: "bank", debit: 0, credit: 3200, balance: 0, status: "paid" },
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

export default function CustomerStatementPage() {
  const params = useParams();
  const router = useRouter();
  const [customer] = useState<Customer>(mockCustomer);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [dateFilter, setDateFilter] = useState<"all" | "month" | "quarter" | "year">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "invoice" | "payment" | "credit-note">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "partial" | "pending" | "overdue">("all");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi" | "bank">("cash");
  const [paymentNote, setPaymentNote] = useState("");

  // Calculate running balance
  const transactionsWithBalance = useMemo(() => {
    let runningBalance = customer.openingBalance;
    const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return sorted.map((t) => {
      runningBalance += t.debit - t.credit;
      return { ...t, runningBalance };
    }).reverse();
  }, [transactions, customer.openingBalance]);

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
    const totalInvoices = transactions.filter((t) => t.type === "invoice").reduce((sum, t) => sum + t.debit, 0);
    const totalPayments = transactions.filter((t) => t.type === "payment").reduce((sum, t) => sum + t.credit, 0);
    const totalCreditNotes = transactions.filter((t) => t.type === "credit-note").reduce((sum, t) => sum + t.credit, 0);
    const currentBalance = totalInvoices - totalPayments - totalCreditNotes + customer.openingBalance;
    
    const pendingInvoices = transactions.filter((t) => t.type === "invoice" && (t.status === "pending" || t.status === "partial" || t.status === "overdue"));
    const overdueAmount = pendingInvoices.filter((t) => t.status === "overdue").reduce((sum, t) => sum + (t.balance || 0), 0);
    
    const cashSales = transactions.filter((t) => t.type === "invoice" && t.paymentType === "cash").reduce((sum, t) => sum + t.debit, 0);
    const creditSales = transactions.filter((t) => t.type === "invoice" && t.paymentType === "credit").reduce((sum, t) => sum + t.debit, 0);
    const partialSales = transactions.filter((t) => t.type === "invoice" && t.paymentType === "partial").reduce((sum, t) => sum + t.debit, 0);
    
    return {
      totalInvoices,
      totalPayments,
      totalCreditNotes,
      currentBalance,
      overdueAmount,
      pendingCount: pendingInvoices.length,
      cashSales,
      creditSales,
      partialSales,
      availableCredit: customer.creditLimit - currentBalance,
    };
  }, [transactions, customer]);

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
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">{customer.name}</h1>
              <p className="text-xs text-muted-foreground">{customer.phone} • {customer.type.toUpperCase()}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddPayment(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Record Payment
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
              {summary.currentBalance > 0 ? "To Receive" : summary.currentBalance < 0 ? "To Pay" : "Settled"}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-xs text-muted-foreground mb-1">Total Invoices</div>
            <div className="text-2xl font-bold text-primary">₹{formatCurrency(summary.totalInvoices)}</div>
            <div className="text-xs text-muted-foreground mt-1">{transactions.filter((t) => t.type === "invoice").length} invoices</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-xs text-muted-foreground mb-1">Total Payments</div>
            <div className="text-2xl font-bold text-success">₹{formatCurrency(summary.totalPayments)}</div>
            <div className="text-xs text-muted-foreground mt-1">{transactions.filter((t) => t.type === "payment").length} payments</div>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="text-xs text-muted-foreground mb-1">Overdue Amount</div>
            <div className="text-2xl font-bold text-destructive">₹{formatCurrency(summary.overdueAmount)}</div>
            <div className="text-xs text-muted-foreground mt-1">{summary.pendingCount} pending invoices</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-xs text-muted-foreground mb-1">Credit Limit</div>
            <div className="text-2xl font-bold text-warning">₹{formatCurrency(customer.creditLimit)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Available: ₹{formatCurrency(Math.max(0, summary.availableCredit))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-muted border border-border">
            <div className="text-xs text-muted-foreground mb-1">Sales Breakdown</div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-success">Cash</span>
                <span className="font-medium">₹{formatCurrency(summary.cashSales)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-warning">Credit</span>
                <span className="font-medium">₹{formatCurrency(summary.creditSales)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-primary">Partial</span>
                <span className="font-medium">₹{formatCurrency(summary.partialSales)}</span>
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
          className="h-9 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="h-9 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Types</option>
          <option value="invoice">Invoices</option>
          <option value="payment">Payments</option>
          <option value="credit-note">Credit Notes</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="h-9 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
              <td className="px-6 py-3 text-right font-medium">{customer.openingBalance > 0 ? formatCurrency(customer.openingBalance) : "-"}</td>
              <td className="px-6 py-3 text-right font-medium">{customer.openingBalance < 0 ? formatCurrency(Math.abs(customer.openingBalance)) : "-"}</td>
              <td className="px-6 py-3 text-right font-bold">{formatCurrency(customer.openingBalance)}</td>
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
                          transaction.type === "invoice" ? "bg-primary/10" :
                          transaction.type === "payment" ? "bg-success/10" : "bg-warning/10"
                        }`}>
                          {transaction.type === "invoice" ? (
                            <Receipt className="w-4 h-4 text-primary" />
                          ) : transaction.type === "payment" ? (
                            <Banknote className="w-4 h-4 text-success" />
                          ) : (
                            <FileText className="w-4 h-4 text-warning" />
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
                        <span className="font-medium text-destructive flex items-center justify-end gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          {formatCurrency(transaction.debit)}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {transaction.credit > 0 ? (
                        <span className="font-medium text-success flex items-center justify-end gap-1">
                          <ArrowDownRight className="w-3 h-3" />
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
                            {transaction.type === "invoice" && (
                              <>
                                <div>
                                  <div className="text-xs text-muted-foreground">Items</div>
                                  <div className="font-medium">{transaction.items || "-"} items</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Invoice Amount</div>
                                  <div className="font-medium">₹{formatCurrency(transaction.debit)}</div>
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
                                  <div className="text-xs text-muted-foreground">Amount Received</div>
                                  <div className="font-medium text-success">₹{formatCurrency(transaction.credit)}</div>
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
                              {transaction.type === "invoice" && transaction.status !== "paid" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAddPayment(true);
                                    setPaymentAmount(transaction.balance.toString());
                                  }}
                                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-success text-success-foreground hover:bg-success/90 transition-colors"
                                >
                                  Record Payment
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
            <tr className="bg-primary/5 font-bold">
              <td className="px-6 py-4 text-sm">-</td>
              <td className="px-6 py-4 text-sm">Closing Balance</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">As of {formatDate(new Date())}</td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-right text-primary">{formatCurrency(summary.totalInvoices)}</td>
              <td className="px-6 py-4 text-right text-success">{formatCurrency(summary.totalPayments + summary.totalCreditNotes)}</td>
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
                    <Banknote className="w-5 h-5 text-success" />
                    Record Payment
                  </h2>
                  <button
                    onClick={() => setShowAddPayment(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Customer: <span className="font-medium text-foreground">{customer.name}</span>
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
                      className="w-full h-11 pl-9 pr-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
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
                  <div className="grid grid-cols-4 gap-2">
                    {(["cash", "card", "upi", "bank"] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === method
                            ? "border-success bg-success/10 text-success"
                            : "border-border hover:border-success/50"
                        }`}
                      >
                        {method === "cash" && <Banknote className="w-5 h-5" />}
                        {method === "card" && <CreditCard className="w-5 h-5" />}
                        {method === "upi" && <Wallet className="w-5 h-5" />}
                        {method === "bank" && <IndianRupee className="w-5 h-5" />}
                        <span className="text-xs font-medium capitalize">{method}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Note (Optional)</label>
                  <textarea
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="Add payment reference or note..."
                    className="w-full h-20 p-3 bg-background border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-success"
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
                    // Handle payment recording
                    setShowAddPayment(false);
                    setPaymentAmount("");
                    setPaymentNote("");
                  }}
                  disabled={!paymentAmount || Number(paymentAmount) <= 0}
                  className="flex-1 h-11 rounded-lg bg-success text-success-foreground font-medium hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Record Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
