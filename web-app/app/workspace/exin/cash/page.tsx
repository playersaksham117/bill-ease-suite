"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndianRupee, Plus, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, Calendar } from "lucide-react";

interface CashTransaction {
  id: string;
  date: string;
  type: "in" | "out";
  amount: number;
  description: string;
  category: string;
}

const mockTransactions: CashTransaction[] = [
  { id: "1", date: "2024-12-23", type: "in", amount: 25000, description: "Cash sales", category: "Sales" },
  { id: "2", date: "2024-12-23", type: "out", amount: 2500, description: "Petty expenses", category: "Office" },
  { id: "3", date: "2024-12-22", type: "in", amount: 15000, description: "Payment received", category: "Sales" },
  { id: "4", date: "2024-12-22", type: "out", amount: 5000, description: "Staff advance", category: "Salary" },
  { id: "5", date: "2024-12-21", type: "in", amount: 8000, description: "Refund received", category: "Other" },
];

export default function CashPage() {
  const [transactions, setTransactions] = useState<CashTransaction[]>(mockTransactions);
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");

  const cashIn = transactions.filter(t => t.type === "in").reduce((sum, t) => sum + t.amount, 0);
  const cashOut = transactions.filter(t => t.type === "out").reduce((sum, t) => sum + t.amount, 0);
  const balance = cashIn - cashOut;

  const filtered = transactions.filter(t => filter === "all" || t.type === filter);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Cash in Hand</h1>
            <p className="text-xs text-muted-foreground">Track cash transactions</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <div className="text-sm text-muted-foreground">Cash Balance</div>
            <div className="text-2xl font-bold text-green-500 mt-1">₹{balance.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Cash In</div>
            <div className="text-2xl font-bold text-success mt-1">₹{cashIn.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="text-sm text-muted-foreground">Cash Out</div>
            <div className="text-2xl font-bold text-destructive mt-1">₹{cashOut.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border flex gap-2">
        {(["all", "in", "out"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {f === "all" ? "All" : f === "in" ? "Cash In" : "Cash Out"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {filtered.map((txn, idx) => (
            <motion.div key={txn.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                txn.type === "in" ? "bg-success/10" : "bg-destructive/10"}`}>
                {txn.type === "in" ? 
                  <ArrowUpCircle className="w-6 h-6 text-success" /> : 
                  <ArrowDownCircle className="w-6 h-6 text-destructive" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{txn.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span className="px-2 py-0.5 bg-muted rounded text-xs">{txn.category}</span>
                  <span>•</span>
                  <span>{txn.date}</span>
                </div>
              </div>
              <div className={`text-xl font-bold ${txn.type === "in" ? "text-success" : "text-destructive"}`}>
                {txn.type === "in" ? "+" : "-"}₹{txn.amount.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
