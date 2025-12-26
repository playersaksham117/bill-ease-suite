"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CreditCard,
  Banknote,
  QrCode,
} from "lucide-react";

// Mock data
const salesData = {
  today: {
    revenue: 24580,
    transactions: 42,
    avgTicket: 585,
    items: 186,
  },
  yesterday: {
    revenue: 21350,
    transactions: 38,
    avgTicket: 562,
    items: 164,
  },
  thisWeek: {
    revenue: 156780,
    transactions: 285,
    avgTicket: 550,
    items: 1245,
  },
  thisMonth: {
    revenue: 584320,
    transactions: 1024,
    avgTicket: 571,
    items: 4520,
  },
};

const topProducts = [
  { name: "Tata Salt 1kg", sold: 245, revenue: 6860 },
  { name: "Amul Butter 500g", sold: 156, revenue: 42900 },
  { name: "Maggi Noodles 70g", sold: 320, revenue: 4480 },
  { name: "Coca-Cola 750ml", sold: 180, revenue: 6840 },
  { name: "Parle-G Biscuits 800g", sold: 142, revenue: 12070 },
];

const categoryBreakdown = [
  { name: "Grocery", percentage: 28, revenue: 163610 },
  { name: "Dairy", percentage: 22, revenue: 128550 },
  { name: "Beverages", percentage: 18, revenue: 105177 },
  { name: "Snacks", percentage: 15, revenue: 87648 },
  { name: "Household", percentage: 10, revenue: 58432 },
  { name: "Others", percentage: 7, revenue: 40903 },
];

const paymentMethods = [
  { method: "Cash", percentage: 45, amount: 262944 },
  { method: "UPI", percentage: 35, amount: 204512 },
  { method: "Card", percentage: 18, amount: 105177 },
  { method: "Mixed", percentage: 2, amount: 11687 },
];

const hourlyData = [
  { hour: "9 AM", sales: 12500 },
  { hour: "10 AM", sales: 18200 },
  { hour: "11 AM", sales: 22100 },
  { hour: "12 PM", sales: 28400 },
  { hour: "1 PM", sales: 32500 },
  { hour: "2 PM", sales: 24300 },
  { hour: "3 PM", sales: 19800 },
  { hour: "4 PM", sales: 25600 },
  { hour: "5 PM", sales: 31200 },
  { hour: "6 PM", sales: 38500 },
  { hour: "7 PM", sales: 42800 },
  { hour: "8 PM", sales: 35600 },
];

const recentTransactions = [
  { id: "INV-250424", time: "7:15 PM", customer: "Rahul S.", items: 5, total: 426.72, payment: "upi" },
  { id: "INV-250423", time: "6:48 PM", customer: "Walk-in", items: 3, total: 185.00, payment: "cash" },
  { id: "INV-250422", time: "6:32 PM", customer: "Priya P.", items: 8, total: 892.50, payment: "card" },
  { id: "INV-250421", time: "6:15 PM", customer: "Walk-in", items: 2, total: 95.00, payment: "cash" },
  { id: "INV-250420", time: "5:55 PM", customer: "Amit K.", items: 6, total: 545.00, payment: "upi" },
];

export default function SalesReportPage() {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today");

  // Calculate growth
  const revenueGrowth = ((salesData.today.revenue - salesData.yesterday.revenue) / salesData.yesterday.revenue) * 100;
  const transactionGrowth = ((salesData.today.transactions - salesData.yesterday.transactions) / salesData.yesterday.transactions) * 100;

  const paymentIcons = {
    cash: Banknote,
    upi: QrCode,
    card: CreditCard,
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Sales Report</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-lg p-1">
            {(["today", "week", "month"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  dateRange === range
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Calendar className="w-4 h-4" />
            Custom Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <IndianRupee className="w-5 h-5 text-primary" />
              </div>
              {revenueGrowth >= 0 ? (
                <div className="flex items-center gap-1 text-success text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  {revenueGrowth.toFixed(1)}%
                </div>
              ) : (
                <div className="flex items-center gap-1 text-destructive text-sm font-medium">
                  <ArrowDownRight className="w-4 h-4" />
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
            <div className="text-3xl font-bold text-primary mt-1">
              ₹{salesData.today.revenue.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-success/10">
                <ShoppingCart className="w-5 h-5 text-success" />
              </div>
              {transactionGrowth >= 0 ? (
                <div className="flex items-center gap-1 text-success text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  {transactionGrowth.toFixed(1)}%
                </div>
              ) : (
                <div className="flex items-center gap-1 text-destructive text-sm font-medium">
                  <ArrowDownRight className="w-4 h-4" />
                  {Math.abs(transactionGrowth).toFixed(1)}%
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">Transactions</div>
            <div className="text-3xl font-bold mt-1">{salesData.today.transactions}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-warning/10">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Avg. Ticket Size</div>
            <div className="text-3xl font-bold mt-1">₹{salesData.today.avgTicket}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Package className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Items Sold</div>
            <div className="text-3xl font-bold mt-1">{salesData.today.items}</div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Hourly Sales */}
          <div className="col-span-2 p-5 rounded-xl bg-card border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Hourly Sales
            </h3>
            <div className="h-64 flex items-end gap-2">
              {hourlyData.map((data, idx) => {
                const maxSales = Math.max(...hourlyData.map((d) => d.sales));
                const height = (data.sales / maxSales) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex-1 flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: idx * 0.05, duration: 0.5 }}
                        className="w-full bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-colors relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ₹{data.sales.toLocaleString()}
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-xs text-muted-foreground">{data.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              Payment Methods
            </h3>
            <div className="space-y-4">
              {paymentMethods.map((pm, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{pm.method}</span>
                    <span className="text-muted-foreground">₹{pm.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pm.percentage}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className={`h-full rounded-full ${
                        idx === 0
                          ? "bg-success"
                          : idx === 1
                          ? "bg-primary"
                          : idx === 2
                          ? "bg-warning"
                          : "bg-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{pm.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-muted-foreground" />
              Top Selling Products
            </h3>
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.sold} sold</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold">₹{product.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              Category Breakdown
            </h3>
            <div className="space-y-3">
              {categoryBreakdown.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">{cat.percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ delay: idx * 0.05, duration: 0.5 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              Recent Transactions
            </h3>
            <div className="space-y-3">
              {recentTransactions.map((txn, idx) => {
                const PaymentIcon = paymentIcons[txn.payment as keyof typeof paymentIcons] || CreditCard;
                return (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary">{txn.id}</span>
                        <span className="text-xs text-muted-foreground">{txn.time}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {txn.customer} • {txn.items} items
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PaymentIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold">₹{txn.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
