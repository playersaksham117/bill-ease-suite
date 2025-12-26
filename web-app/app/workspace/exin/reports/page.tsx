"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown, PieChart } from "lucide-react";

export default function ReportsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">("month");

  const summary = {
    totalIncome: 245000,
    totalExpense: 178500,
    netProfit: 66500,
    avgDaily: 8166,
  };

  const categoryData = [
    { category: "Sales", amount: 180000, percentage: 73, type: "income" },
    { category: "Services", amount: 65000, percentage: 27, type: "income" },
    { category: "Salary", amount: 85000, percentage: 48, type: "expense" },
    { category: "Rent", amount: 25000, percentage: 14, type: "expense" },
    { category: "Marketing", amount: 35000, percentage: 20, type: "expense" },
    { category: "Utilities", amount: 8500, percentage: 5, type: "expense" },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Financial Reports</h1>
            <p className="text-xs text-muted-foreground">Insights & analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-lg p-1">
            {(["week", "month", "quarter", "year"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize ${
                  period === p ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              Total Income
            </div>
            <div className="text-2xl font-bold text-success">₹{summary.totalIncome.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingDown className="w-4 h-4 text-destructive" />
              Total Expense
            </div>
            <div className="text-2xl font-bold text-destructive">₹{summary.totalExpense.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground mb-1">Net Profit</div>
            <div className="text-2xl font-bold text-primary">₹{summary.netProfit.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="text-sm text-muted-foreground mb-1">Avg. Daily</div>
            <div className="text-2xl font-bold">₹{summary.avgDaily.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Income Breakdown */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <PieChart className="w-5 h-5 text-success" />
              <h2 className="text-lg font-bold">Income Breakdown</h2>
            </div>
            <div className="space-y-3">
              {categoryData.filter(c => c.type === "income").map((cat, idx) => (
                <motion.div key={cat.category} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: idx * 0.1 }} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.category}</span>
                    <span className="text-success font-bold">₹{cat.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="h-full bg-success" />
                  </div>
                  <p className="text-xs text-muted-foreground">{cat.percentage}% of total income</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <PieChart className="w-5 h-5 text-destructive" />
              <h2 className="text-lg font-bold">Expense Breakdown</h2>
            </div>
            <div className="space-y-3">
              {categoryData.filter(c => c.type === "expense").map((cat, idx) => (
                <motion.div key={cat.category} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.category}</span>
                    <span className="text-destructive font-bold">₹{cat.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="h-full bg-destructive" />
                  </div>
                  <p className="text-xs text-muted-foreground">{cat.percentage}% of total expenses</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Profit/Loss Summary */}
        <div className="mt-6 bg-gradient-to-r from-primary/10 to-success/10 border border-primary/20 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Profit & Loss Summary</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Revenue</p>
              <p className="text-3xl font-bold text-success">₹{summary.totalIncome.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Expenses</p>
              <p className="text-3xl font-bold text-destructive">₹{summary.totalExpense.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Net Profit</p>
              <p className="text-3xl font-bold text-primary">₹{summary.netProfit.toLocaleString()}</p>
              <p className="text-sm text-success mt-1">↑ {((summary.netProfit / summary.totalIncome) * 100).toFixed(1)}% margin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
