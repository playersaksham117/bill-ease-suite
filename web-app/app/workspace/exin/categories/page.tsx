"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Plus, Edit2, Trash2, TrendingUp, TrendingDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  transactions: number;
  total: number;
}

const mockCategories: Category[] = [
  { id: "1", name: "Sales", type: "income", icon: "💰", color: "bg-green-500", transactions: 45, total: 245000 },
  { id: "2", name: "Services", type: "income", icon: "🛠️", color: "bg-blue-500", transactions: 12, total: 85000 },
  { id: "3", name: "Salary", type: "expense", icon: "👥", color: "bg-purple-500", transactions: 4, total: 120000 },
  { id: "4", name: "Rent", type: "expense", icon: "🏢", color: "bg-orange-500", transactions: 1, total: 25000 },
  { id: "5", name: "Marketing", type: "expense", icon: "📢", color: "bg-pink-500", transactions: 8, total: 35000 },
  { id: "6", name: "Utilities", type: "expense", icon: "⚡", color: "bg-yellow-500", transactions: 3, total: 8500 },
];

export default function CategoriesPage() {
  const [categories] = useState<Category[]>(mockCategories);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const filtered = categories.filter(c => filter === "all" || c.type === filter);
  const incomeTotal = categories.filter(c => c.type === "income").reduce((s, c) => s + c.total, 0);
  const expenseTotal = categories.filter(c => c.type === "expense").reduce((s, c) => s + c.total, 0);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Categories</h1>
            <p className="text-xs text-muted-foreground">Manage transaction categories</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Income Categories</div>
            <div className="text-2xl font-bold text-success mt-1">₹{incomeTotal.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="text-sm text-muted-foreground">Expense Categories</div>
            <div className="text-2xl font-bold text-destructive mt-1">₹{expenseTotal.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="text-sm text-muted-foreground">Total Categories</div>
            <div className="text-2xl font-bold mt-1">{categories.length}</div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border flex gap-2">
        {(["all", "income", "expense"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              filter === f ? "bg-indigo-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((cat, idx) => (
            <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {cat.icon}
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded hover:bg-muted">
                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                {cat.type === "income" ? <TrendingUp className="w-4 h-4 text-success" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
                <span className="capitalize">{cat.type}</span>
              </div>
              
              <div className="border-t border-border pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transactions</span>
                  <span className="font-medium">{cat.transactions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className={`font-bold ${cat.type === "income" ? "text-success" : "text-destructive"}`}>
                    ₹{cat.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
