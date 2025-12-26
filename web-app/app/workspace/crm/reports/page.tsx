"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, DollarSign, TrendingUp, Download, Calendar } from "lucide-react";

export default function ReportsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">("month");

  const metrics = {
    totalContacts: 125,
    activeDeals: 12,
    dealsWon: 8,
    dealsLost: 3,
    winRate: 72,
    avgDealValue: 425000,
    totalRevenue: 3400000,
    conversionRate: 28,
  };

  const leadSources = [
    { source: "Website", count: 45, percentage: 36 },
    { source: "Referral", count: 32, percentage: 26 },
    { source: "LinkedIn", count: 28, percentage: 22 },
    { source: "Cold Call", count: 20, percentage: 16 },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">CRM Reports</h1>
            <p className="text-xs text-muted-foreground">Analytics & insights</p>
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
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="w-4 h-4 text-purple-500" />
              Total Contacts
            </div>
            <div className="text-2xl font-bold text-purple-500">{metrics.totalContacts}</div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              Active Deals
            </div>
            <div className="text-2xl font-bold text-primary">{metrics.activeDeals}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-success">{metrics.winRate}%</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4 text-warning" />
              Total Revenue
            </div>
            <div className="text-2xl font-bold text-warning">₹{(metrics.totalRevenue / 1000000).toFixed(1)}M</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Deal Performance */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg font-bold mb-4">Deal Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Deals Won</span>
                <span className="text-2xl font-bold text-success">{metrics.dealsWon}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Deals Lost</span>
                <span className="text-2xl font-bold text-destructive">{metrics.dealsLost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Deal Value</span>
                <span className="text-2xl font-bold text-primary">₹{(metrics.avgDealValue / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <span className="text-2xl font-bold text-warning">{metrics.conversionRate}%</span>
              </div>
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg font-bold mb-4">Lead Sources</h2>
            <div className="space-y-4">
              {leadSources.map((source, idx) => (
                <motion.div key={source.source} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-muted-foreground">{source.count} leads</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${source.percentage}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="h-full bg-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">{source.percentage}% of total leads</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="mt-6 bg-gradient-to-r from-primary/10 to-success/10 border border-primary/20 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Revenue Summary</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-success">₹{(metrics.totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-success mt-1">↑ +18% from last period</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Avg Deal Value</p>
              <p className="text-3xl font-bold text-primary">₹{(metrics.avgDealValue / 1000).toFixed(0)}k</p>
              <p className="text-sm text-success mt-1">↑ +12% from last period</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Win Rate</p>
              <p className="text-3xl font-bold text-warning">{metrics.winRate}%</p>
              <p className="text-sm text-success mt-1">↑ +5% from last period</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
