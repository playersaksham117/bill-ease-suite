"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Clock, ToggleLeft, ToggleRight } from "lucide-react";

interface Recurring {
  id: string;
  name: string;
  type: "income" | "expense";
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  nextDate: string;
  category: string;
  active: boolean;
}

const mockRecurring: Recurring[] = [
  { id: "1", name: "Office Rent", type: "expense", amount: 25000, frequency: "monthly", nextDate: "2025-01-01", category: "Rent", active: true },
  { id: "2", name: "Subscription Revenue", type: "income", amount: 15000, frequency: "monthly", nextDate: "2025-01-05", category: "Sales", active: true },
  { id: "3", name: "Insurance Premium", type: "expense", amount: 5000, frequency: "monthly", nextDate: "2025-01-10", category: "Insurance", active: true },
  { id: "4", name: "SaaS Tools", type: "expense", amount: 3500, frequency: "monthly", nextDate: "2025-01-15", category: "Software", active: true },
  { id: "5", name: "Salary - John", type: "expense", amount: 45000, frequency: "monthly", nextDate: "2025-01-01", category: "Salary", active: true },
];

export default function RecurringPage() {
  const [recurring, setRecurring] = useState<Recurring[]>(mockRecurring);

  const toggleActive = (id: string) => {
    setRecurring(recurring.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const totalIncome = recurring.filter(r => r.type === "income" && r.active).reduce((s, r) => s + r.amount, 0);
  const totalExpense = recurring.filter(r => r.type === "expense" && r.active).reduce((s, r) => s + r.amount, 0);
  const activeCount = recurring.filter(r => r.active).length;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Recurring Transactions</h1>
            <p className="text-xs text-muted-foreground">Automated transactions</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600">
          <Plus className="w-4 h-4" /> Add Recurring
        </button>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Monthly Income</div>
            <div className="text-2xl font-bold text-success mt-1">₹{totalIncome.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="text-sm text-muted-foreground">Monthly Expense</div>
            <div className="text-2xl font-bold text-destructive mt-1">₹{totalExpense.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-cyan-500 mt-1">{activeCount}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {recurring.map((item, idx) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
              className={`bg-card border rounded-xl p-4 transition-all ${item.active ? "border-border hover:shadow-md" : "border-border opacity-50"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                  <Clock className={`w-6 h-6 ${item.type === "income" ? "text-success" : "text-destructive"}`} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span className="px-2 py-0.5 bg-muted rounded text-xs">{item.category}</span>
                    <span>•</span>
                    <span className="capitalize">{item.frequency}</span>
                    <span>•</span>
                    <span>Next: {item.nextDate}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xl font-bold ${item.type === "income" ? "text-success" : "text-destructive"}`}>
                    {item.type === "income" ? "+" : "-"}₹{item.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                </div>

                <button onClick={() => toggleActive(item.id)} 
                  className={`p-2 rounded-lg transition-colors ${item.active ? "hover:bg-success/10" : "hover:bg-muted"}`}>
                  {item.active ? 
                    <ToggleRight className="w-6 h-6 text-success" /> : 
                    <ToggleLeft className="w-6 h-6 text-muted-foreground" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
