"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, AlertCircle, CheckCircle } from "lucide-react";

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: "monthly" | "quarterly" | "yearly";
}

const mockBudgets: Budget[] = [
  { id: "1", category: "Salary", limit: 100000, spent: 85000, period: "monthly" },
  { id: "2", category: "Rent", limit: 30000, spent: 25000, period: "monthly" },
  { id: "3", category: "Marketing", limit: 15000, spent: 18000, period: "monthly" },
  { id: "4", category: "Utilities", limit: 5000, spent: 3500, period: "monthly" },
  { id: "5", category: "Travel", limit: 10000, spent: 6000, period: "monthly" },
];

export default function BudgetsPage() {
  const [budgets] = useState<Budget[]>(mockBudgets);

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const overbudget = budgets.filter(b => b.spent > b.limit).length;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Budgets</h1>
            <p className="text-xs text-muted-foreground">Manage spending limits</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600">
          <Plus className="w-4 h-4" /> Add Budget
        </button>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="text-sm text-muted-foreground">Total Budget</div>
            <div className="text-2xl font-bold text-purple-500 mt-1">₹{totalLimit.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Total Spent</div>
            <div className="text-2xl font-bold text-primary mt-1">₹{totalSpent.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">Remaining</div>
            <div className="text-2xl font-bold text-warning mt-1">₹{(totalLimit - totalSpent).toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 text-destructive" />
              Over Budget
            </div>
            <div className="text-2xl font-bold text-destructive mt-1">{overbudget}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          {budgets.map((budget, idx) => {
            const pct = (budget.spent / budget.limit) * 100;
            const isOver = budget.spent > budget.limit;
            return (
              <motion.div key={budget.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{budget.category}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{budget.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Spent</p>
                    <p className={`text-xl font-bold ${isOver ? "text-destructive" : "text-foreground"}`}>
                      ₹{budget.spent.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Limit: ₹{budget.limit.toLocaleString()}</span>
                    <span className={isOver ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }}
                      className={`h-full ${isOver ? "bg-destructive" : "bg-success"}`} />
                  </div>
                </div>

                {isOver ? (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    Over by ₹{(budget.spent - budget.limit).toLocaleString()}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <CheckCircle className="w-4 h-4" />
                    ₹{(budget.limit - budget.spent).toLocaleString()} remaining
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
