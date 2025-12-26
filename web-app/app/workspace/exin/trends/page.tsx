"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, ArrowUp, ArrowDown } from "lucide-react";

export default function TrendsPage() {
  const monthlyTrends = [
    { month: "Jul", income: 180000, expense: 145000 },
    { month: "Aug", income: 195000, expense: 152000 },
    { month: "Sep", income: 210000, expense: 168000 },
    { month: "Oct", income: 225000, expense: 175000 },
    { month: "Nov", income: 235000, expense: 182000 },
    { month: "Dec", income: 245000, expense: 178500 },
  ];

  const insights = [
    { title: "Income Growth", value: "+28%", description: "6-month growth trend", trend: "up", color: "text-success" },
    { title: "Expense Control", value: "+23%", description: "Lower than income growth", trend: "up", color: "text-warning" },
    { title: "Profit Margin", value: "27%", description: "Average margin this period", trend: "up", color: "text-primary" },
    { title: "Savings Rate", value: "32%", description: "Of total income", trend: "up", color: "text-success" },
  ];

  const maxValue = Math.max(...monthlyTrends.flatMap(m => [m.income, m.expense]));

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Trends & Insights</h1>
            <p className="text-xs text-muted-foreground">Financial patterns</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">
          <Calendar className="w-4 h-4" /> Last 6 Months
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Key Insights */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {insights.map((insight, idx) => (
            <motion.div key={insight.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{insight.title}</span>
                {insight.trend === "up" ? 
                  <ArrowUp className={`w-4 h-4 ${insight.color}`} /> : 
                  <ArrowDown className={`w-4 h-4 ${insight.color}`} />}
              </div>
              <p className={`text-2xl font-bold ${insight.color} mb-1`}>{insight.value}</p>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6">Income vs Expenses Trend</h2>
          <div className="h-80 flex items-end justify-between gap-4">
            {monthlyTrends.map((data, idx) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex gap-2 items-end h-64">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(data.income / maxValue) * 100}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex-1 bg-success rounded-t-lg relative group">
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(data.income / 1000).toFixed(0)}k
                    </span>
                  </motion.div>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(data.expense / maxValue) * 100}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex-1 bg-destructive rounded-t-lg relative group">
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(data.expense / 1000).toFixed(0)}k
                    </span>
                  </motion.div>
                </div>
                <span className="text-sm font-medium">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success rounded"></div>
              <span className="text-sm">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded"></div>
              <span className="text-sm">Expenses</span>
            </div>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="mt-6 grid grid-cols-6 gap-4">
          {monthlyTrends.map((data, idx) => {
            const profit = data.income - data.expense;
            const margin = (profit / data.income) * 100;
            return (
              <motion.div key={data.month} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }} className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold mb-3">{data.month}</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Income</span>
                    <span className="font-medium text-success">₹{(data.income / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expense</span>
                    <span className="font-medium text-destructive">₹{(data.expense / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between">
                    <span className="text-muted-foreground">Profit</span>
                    <span className="font-bold text-primary">₹{(profit / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Margin</span>
                    <span className="font-medium">{margin.toFixed(1)}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
