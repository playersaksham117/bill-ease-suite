"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, TrendingUp, Users, Target, DollarSign, ArrowUp } from "lucide-react";

export default function InsightsPage() {
  const insights = [
    { title: "Top Performer", value: "Rahul Sharma", metric: "₹1.2M revenue", icon: Users, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { title: "Best Lead Source", value: "Website", metric: "45 leads (36%)", icon: Target, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { title: "Highest Win Rate", value: "Enterprise", metric: "85% success", icon: TrendingUp, color: "text-success", bgColor: "bg-success/10" },
    { title: "Avg Response Time", value: "2.5 hours", metric: "30% faster", icon: ArrowUp, color: "text-warning", bgColor: "bg-warning/10" },
  ];

  const customerSegments = [
    { segment: "Enterprise", count: 35, revenue: 1800000, avgDeal: 514000 },
    { segment: "Mid-Market", count: 52, revenue: 1200000, avgDeal: 231000 },
    { segment: "Small Business", count: 38, revenue: 400000, avgDeal: 105000 },
  ];

  const activityTrends = [
    { activity: "Emails Sent", count: 245, change: "+12%" },
    { activity: "Calls Made", count: 128, change: "+8%" },
    { activity: "Meetings", count: 45, change: "+15%" },
    { activity: "Demos", count: 32, change: "+22%" },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Customer Insights</h1>
            <p className="text-xs text-muted-foreground">AI-powered insights</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Key Insights */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <motion.div key={insight.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }} className={`${insight.bgColor} border border-border rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{insight.title}</span>
                  <Icon className={`w-5 h-5 ${insight.color}`} />
                </div>
                <p className={`text-xl font-bold ${insight.color} mb-1`}>{insight.value}</p>
                <p className="text-xs text-muted-foreground">{insight.metric}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Customer Segments */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <h2 className="text-lg font-bold mb-4">Customer Segments</h2>
          <div className="space-y-3">
            {customerSegments.map((seg, idx) => (
              <motion.div key={seg.segment} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }} className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">{seg.segment}</h3>
                  <span className="text-sm text-muted-foreground">{seg.count} customers</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Total Revenue</p>
                    <p className="font-bold text-success">₹{(seg.revenue / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Avg Deal Size</p>
                    <p className="font-bold text-primary">₹{(seg.avgDeal / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Revenue Share</p>
                    <p className="font-bold text-warning">{((seg.revenue / 3400000) * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Trends */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg font-bold mb-4">Activity Trends</h2>
            <div className="space-y-3">
              {activityTrends.map((activity, idx) => (
                <motion.div key={activity.activity} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.activity}</p>
                    <p className="text-sm text-muted-foreground">This period</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{activity.count}</p>
                    <p className="text-sm text-success">{activity.change}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <span className="text-sm font-medium">Customer Retention</span>
                <span className="text-2xl font-bold text-success">94%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <span className="text-2xl font-bold text-primary">4.8/5</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <span className="text-sm font-medium">Referral Rate</span>
                <span className="text-2xl font-bold text-warning">26%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <span className="text-sm font-medium">Churn Rate</span>
                <span className="text-2xl font-bold text-destructive">6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
