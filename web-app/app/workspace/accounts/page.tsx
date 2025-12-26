"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  FileText,
  Receipt,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  PieChart,
  BarChart3,
} from "lucide-react";

// Mock data
const recentTransactions = [
  { id: "1", type: "invoice", number: "INV-2024-001", party: "Rajesh Enterprises", amount: 45000, gst: 8100, date: "2024-12-20", status: "paid" },
  { id: "2", type: "bill", number: "BILL-2024-045", party: "ABC Suppliers", amount: 32000, gst: 5760, date: "2024-12-19", status: "pending" },
  { id: "3", type: "payment", number: "PAY-2024-089", party: "Sharma & Co.", amount: 25000, gst: 0, date: "2024-12-18", status: "completed" },
  { id: "4", type: "receipt", number: "RCP-2024-056", party: "XYZ Trading", amount: 18500, gst: 0, date: "2024-12-17", status: "completed" },
  { id: "5", type: "invoice", number: "INV-2024-002", party: "Patel Industries", amount: 67000, gst: 12060, date: "2024-12-16", status: "overdue" },
  { id: "6", type: "bill", number: "BILL-2024-046", party: "Metro Wholesale", amount: 28000, gst: 5040, date: "2024-12-15", status: "paid" },
];

const accountBalances = [
  { name: "Cash in Hand", balance: 85000, type: "asset" },
  { name: "HDFC Bank", balance: 245000, type: "asset" },
  { name: "Accounts Receivable", balance: 178000, type: "asset" },
  { name: "Accounts Payable", balance: 95000, type: "liability" },
  { name: "GST Payable", balance: 32000, type: "liability" },
];

const gstSummary = {
  outputGST: 45000,
  inputGST: 28000,
  netPayable: 17000,
};

export default function AccountsPage() {
  const [period, setPeriod] = useState("month");

  const stats = {
    totalSales: 425000,
    totalPurchases: 285000,
    receivables: 178000,
    payables: 95000,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "invoice": return Receipt;
      case "bill": return FileText;
      case "payment": return CreditCard;
      case "receipt": return IndianRupee;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed": return "bg-success/10 text-success";
      case "pending": return "bg-warning/10 text-warning";
      case "overdue": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Accounts Dashboard</h1>
            <p className="text-sm text-muted-foreground">Financial overview and accounting</p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              {["week", "month", "quarter", "year"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                    period === p ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Sales</span>
              <div className="flex items-center gap-1 text-success text-xs font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +12%
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{stats.totalSales.toLocaleString()}</p>
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-success rounded-full" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Purchases</span>
              <div className="flex items-center gap-1 text-destructive text-xs font-medium">
                <ArrowDownRight className="w-3.5 h-3.5" />
                -5%
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{stats.totalPurchases.toLocaleString()}</p>
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-primary rounded-full" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Receivables</span>
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-warning">₹{stats.receivables.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">5 invoices pending</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Payables</span>
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
            </div>
            <p className="text-2xl font-bold text-destructive">₹{stats.payables.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">3 bills due</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="col-span-2 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Recent Transactions</h2>
              <button className="text-sm text-primary hover:underline">View All</button>
            </div>
            <div className="flex-1 max-h-[400px] overflow-auto">
              <div className="divide-y divide-border">
                {recentTransactions.map((txn, idx) => {
                  const Icon = getTypeIcon(txn.type);
                  return (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        txn.type === "invoice" || txn.type === "receipt" ? "bg-success/10" : "bg-primary/10"
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          txn.type === "invoice" || txn.type === "receipt" ? "text-success" : "text-primary"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{txn.party}</p>
                          <span className="text-xs text-muted-foreground">{txn.number}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">{txn.type}</span>
                          <span>•</span>
                          <span>{txn.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          txn.type === "invoice" || txn.type === "receipt" ? "text-success" : "text-foreground"
                        }`}>
                          {txn.type === "invoice" || txn.type === "receipt" ? "+" : "-"}₹{txn.amount.toLocaleString()}
                        </p>
                        {txn.gst > 0 && (
                          <p className="text-xs text-muted-foreground">GST: ₹{txn.gst.toLocaleString()}</p>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(txn.status)}`}>
                        {txn.status}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* GST Summary */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary" />
                GST Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Output GST (Sales)</span>
                  <span className="font-medium text-success">₹{gstSummary.outputGST.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Input GST (Purchase)</span>
                  <span className="font-medium text-primary">₹{gstSummary.inputGST.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-medium">Net GST Payable</span>
                  <span className="font-bold text-destructive">₹{gstSummary.netPayable.toLocaleString()}</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
                View GST Reports
              </button>
            </div>

            {/* Account Balances */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Account Balances
              </h3>
              <div className="space-y-3">
                {accountBalances.map((account) => (
                  <div key={account.name} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{account.name}</span>
                    <span className={`font-medium ${account.type === "liability" ? "text-destructive" : "text-foreground"}`}>
                      {account.type === "liability" ? "-" : ""}₹{account.balance.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
                View Ledger
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex flex-col items-center gap-1">
                  <Receipt className="w-5 h-5 text-success" />
                  New Invoice
                </button>
                <button className="p-3 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex flex-col items-center gap-1">
                  <FileText className="w-5 h-5 text-primary" />
                  New Bill
                </button>
                <button className="p-3 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex flex-col items-center gap-1">
                  <CreditCard className="w-5 h-5 text-warning" />
                  Payment
                </button>
                <button className="p-3 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex flex-col items-center gap-1">
                  <IndianRupee className="w-5 h-5 text-success" />
                  Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
