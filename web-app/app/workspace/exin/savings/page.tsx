"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PiggyBank, Plus, TrendingUp, Target, Calendar } from "lucide-react";

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
}

const mockGoals: SavingsGoal[] = [
  { id: "1", name: "Emergency Fund", target: 500000, current: 285000, deadline: "2025-06-30", category: "Emergency" },
  { id: "2", name: "New Equipment", target: 200000, current: 120000, deadline: "2025-03-31", category: "Business" },
  { id: "3", name: "Tax Reserve", target: 150000, current: 95000, deadline: "2025-07-31", category: "Tax" },
  { id: "4", name: "Expansion Fund", target: 1000000, current: 450000, deadline: "2025-12-31", category: "Business" },
];

export default function SavingsPage() {
  const [goals] = useState<SavingsGoal[]>(mockGoals);

  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const progress = (totalSaved / totalTarget) * 100;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Savings & Goals</h1>
            <p className="text-xs text-muted-foreground">Track savings goals</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <div className="text-sm text-muted-foreground">Total Saved</div>
            <div className="text-2xl font-bold text-yellow-500 mt-1">₹{totalSaved.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Total Target</div>
            <div className="text-2xl font-bold text-primary mt-1">₹{totalTarget.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Overall Progress</div>
            <div className="text-2xl font-bold text-success mt-1">{progress.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          {goals.map((goal, idx) => {
            const pct = (goal.current / goal.target) * 100;
            return (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">{goal.category}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-lg text-sm font-medium">
                    {pct.toFixed(0)}%
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {goal.deadline}</span>
                  </div>
                  <span className="font-medium">₹{(goal.target - goal.current).toLocaleString()} remaining</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
