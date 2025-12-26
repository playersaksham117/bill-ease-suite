"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Filter,
  Calendar,
  Search,
  MoreVertical,
  IndianRupee,
  CreditCard,
  Landmark,
  PiggyBank,
} from "lucide-react";

// Mock transaction data
const mockTransactions = [
  { id: "1", type: "income", category: "Sales", description: "Product sale - Invoice #1234", amount: 45000, date: "2024-12-20", account: "HDFC Bank" },
  { id: "2", type: "expense", category: "Rent", description: "Office rent - December", amount: 25000, date: "2024-12-19", account: "ICICI Bank" },
  { id: "3", type: "income", category: "Services", description: "Consulting fee", amount: 15000, date: "2024-12-18", account: "Cash" },
  { id: "4", type: "expense", category: "Utilities", description: "Electricity bill", amount: 3500, date: "2024-12-17", account: "HDFC Bank" },
  { id: "5", type: "expense", category: "Salary", description: "Staff salary - December", amount: 85000, date: "2024-12-15", account: "ICICI Bank" },
  { id: "6", type: "income", category: "Sales", description: "Product sale - Invoice #1235", amount: 32000, date: "2024-12-14", account: "HDFC Bank" },
  { id: "7", type: "expense", category: "Marketing", description: "Google Ads", amount: 8000, date: "2024-12-13", account: "Credit Card" },
  { id: "8", type: "income", category: "Interest", description: "FD Interest", amount: 5500, date: "2024-12-12", account: "SBI Bank" },
];

const accounts = [
  { name: "HDFC Bank", balance: 245000, type: "bank", icon: Landmark },
  { name: "ICICI Bank", balance: 128000, type: "bank", icon: Landmark },
  { name: "Cash in Hand", balance: 35000, type: "cash", icon: IndianRupee },
  { name: "Credit Card", balance: -15000, type: "credit", icon: CreditCard },
];

export default function ExInPage() {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const totalIncome = mockTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = mockTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesFilter = filter === "all" || t.type === filter;
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Financial Overview</h1>
            <p className="text-sm text-muted-foreground">Track your income and expenses</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90 transition-colors">
              <ArrowUpCircle className="w-4 h-4" />
              Add Income
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-destructive text-white rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors">
              <ArrowDownCircle className="w-4 h-4" />
              Add Expense
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
              <span className="text-sm text-muted-foreground">Total Income</span>
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-success">₹{totalIncome.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Expenses</span>
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
            </div>
            <p className="text-2xl font-bold text-destructive">₹{totalExpense.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">-5% from last month</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Net Balance</span>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className={`text-2xl font-bold ${netBalance >= 0 ? "text-success" : "text-destructive"}`}>
              ₹{netBalance.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Savings Rate</span>
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-warning">{((netBalance / totalIncome) * 100).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Of total income</p>
          </div>
        </div>

        {/* Accounts Overview */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {accounts.map((account) => {
            const Icon = account.icon;
            return (
              <div key={account.name} className="bg-muted/30 border border-border rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{account.name}</p>
                  <p className={`text-sm font-bold ${account.balance >= 0 ? "text-foreground" : "text-destructive"}`}>
                    ₹{account.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters Row */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex bg-muted rounded-lg p-1">
            {(["all", "income", "expense"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            This Month
          </button>
        </div>

        {/* Transactions List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {filteredTransactions.map((transaction, idx) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "income" ? "bg-success/10" : "bg-destructive/10"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpCircle className="w-5 h-5 text-success" />
                  ) : (
                    <ArrowDownCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 bg-muted rounded text-xs">{transaction.category}</span>
                    <span>•</span>
                    <span>{transaction.account}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.type === "income" ? "text-success" : "text-destructive"}`}>
                    {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
