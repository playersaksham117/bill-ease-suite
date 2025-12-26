"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  IndianRupee,
  ShoppingCart,
  Users,
  CreditCard,
  Banknote,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Package,
  RotateCcw,
  Clock,
  Printer,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

// Types
interface DailySummary {
  date: Date;
  openingCash: number;
  closingCash: number;
  totalSales: number;
  totalTransactions: number;
  averageTicket: number;
  itemsSold: number;
  returns: number;
  returnsValue: number;
  netSales: number;
  customers: number;
  newCustomers: number;
  paymentBreakdown: {
    cash: number;
    card: number;
    upi: number;
    other: number;
  };
  categoryBreakdown: {
    name: string;
    sales: number;
    quantity: number;
  }[];
  hourlyBreakdown: {
    hour: number;
    sales: number;
    transactions: number;
  }[];
  topProducts: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
  cashierPerformance: {
    name: string;
    transactions: number;
    sales: number;
  }[];
  discountsGiven: number;
  gstCollected: number;
}

// Mock data for today
const mockSummary: DailySummary = {
  date: new Date(),
  openingCash: 10000,
  closingCash: 45680,
  totalSales: 125680,
  totalTransactions: 156,
  averageTicket: 806,
  itemsSold: 483,
  returns: 5,
  returnsValue: 2850,
  netSales: 122830,
  customers: 142,
  newCustomers: 18,
  paymentBreakdown: {
    cash: 35680,
    card: 42500,
    upi: 45200,
    other: 2300,
  },
  categoryBreakdown: [
    { name: "Grocery", sales: 38500, quantity: 156 },
    { name: "Dairy", sales: 28400, quantity: 89 },
    { name: "Instant Food", sales: 24600, quantity: 72 },
    { name: "Snacks", sales: 18200, quantity: 98 },
    { name: "Beverages", sales: 12580, quantity: 45 },
    { name: "Household", sales: 3400, quantity: 23 },
  ],
  hourlyBreakdown: [
    { hour: 9, sales: 8500, transactions: 12 },
    { hour: 10, sales: 12400, transactions: 18 },
    { hour: 11, sales: 15600, transactions: 22 },
    { hour: 12, sales: 18200, transactions: 26 },
    { hour: 13, sales: 9800, transactions: 14 },
    { hour: 14, sales: 7200, transactions: 10 },
    { hour: 15, sales: 11500, transactions: 16 },
    { hour: 16, sales: 14800, transactions: 20 },
    { hour: 17, sales: 16400, transactions: 24 },
    { hour: 18, sales: 11280, transactions: 14 },
  ],
  topProducts: [
    { name: "Tata Salt 1kg", quantity: 42, revenue: 1260 },
    { name: "Amul Butter 500g", quantity: 38, revenue: 8550 },
    { name: "Maggi 2-Minute Noodles", quantity: 56, revenue: 784 },
    { name: "Parle-G Biscuits", quantity: 68, revenue: 680 },
    { name: "Coca-Cola 2L", quantity: 32, revenue: 2880 },
  ],
  cashierPerformance: [
    { name: "Rahul Verma", transactions: 62, sales: 48500 },
    { name: "Priya Sharma", transactions: 54, sales: 42800 },
    { name: "Amit Kumar", transactions: 40, sales: 34380 },
  ],
  discountsGiven: 3850,
  gstCollected: 11580,
};

export default function DailyReportPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [summary] = useState<DailySummary>(mockSummary);
  const [showPrintConfirm, setShowPrintConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Date navigation
  const goToPreviousDay = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const goToNextDay = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (selectedDate < tomorrow) {
      setSelectedDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
      });
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Check if today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Max bar height calculation
  const maxHourlySales = Math.max(...summary.hourlyBreakdown.map((h) => h.sales));

  // Print report
  const handlePrint = () => {
    setShowPrintConfirm(false);
    setShowSuccess("Report sent to printer!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Daily Summary Report</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={() => setShowPrintConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Date Navigator */}
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center justify-center gap-4">
        <button
          onClick={goToPreviousDay}
          className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="text-lg font-bold">{formatDate(selectedDate)}</span>
          {isToday(selectedDate) && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
              Today
            </span>
          )}
        </div>
        <button
          onClick={goToNextDay}
          disabled={isToday(selectedDate)}
          className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-6 gap-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <IndianRupee className="w-4 h-4" />
                <span>Net Sales</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                ₹{summary.netSales.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-success">
                <TrendingUp className="w-3 h-3" />
                <span>+12.5% vs yesterday</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Transactions</span>
              </div>
              <div className="text-2xl font-bold text-success">
                {summary.totalTransactions}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-success">
                <TrendingUp className="w-3 h-3" />
                <span>+8 vs yesterday</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </div>
              <div className="text-2xl font-bold text-warning">
                {summary.customers}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {summary.newCustomers} new
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Package className="w-4 h-4" />
                <span>Items Sold</span>
              </div>
              <div className="text-2xl font-bold">{summary.itemsSold}</div>
              <div className="text-xs text-muted-foreground mt-1">
                ₹{summary.averageTicket} avg ticket
              </div>
            </div>

            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <RotateCcw className="w-4 h-4" />
                <span>Returns</span>
              </div>
              <div className="text-2xl font-bold text-destructive">
                {summary.returns}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ₹{summary.returnsValue.toLocaleString()} value
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <IndianRupee className="w-4 h-4" />
                <span>GST Collected</span>
              </div>
              <div className="text-2xl font-bold">₹{summary.gstCollected.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">
                ₹{summary.discountsGiven.toLocaleString()} discounts
              </div>
            </div>
          </div>

          {/* Cash Summary & Payment Methods */}
          <div className="grid grid-cols-2 gap-6">
            {/* Cash Summary */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-bold mb-4">Cash Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Opening Cash</span>
                  <span className="font-bold">₹{summary.openingCash.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Cash Sales</span>
                  <span className="font-medium text-success">
                    +₹{summary.paymentBreakdown.cash.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Cash Returns</span>
                  <span className="font-medium text-destructive">-₹1,200</span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="font-bold">Closing Cash</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{summary.closingCash.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-bold mb-4">Payment Methods</h3>
              <div className="space-y-4">
                {/* Cash */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-success" />
                      <span>Cash</span>
                    </div>
                    <span className="font-bold">
                      ₹{summary.paymentBreakdown.cash.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full"
                      style={{
                        width: `${(summary.paymentBreakdown.cash / summary.totalSales) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Card */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span>Card</span>
                    </div>
                    <span className="font-bold">
                      ₹{summary.paymentBreakdown.card.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(summary.paymentBreakdown.card / summary.totalSales) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* UPI */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-warning" />
                      <span>UPI</span>
                    </div>
                    <span className="font-bold">
                      ₹{summary.paymentBreakdown.upi.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-warning rounded-full"
                      style={{
                        width: `${(summary.paymentBreakdown.upi / summary.totalSales) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Other */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-muted-foreground" />
                      <span>Other</span>
                    </div>
                    <span className="font-bold">
                      ₹{summary.paymentBreakdown.other.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground rounded-full"
                      style={{
                        width: `${(summary.paymentBreakdown.other / summary.totalSales) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Sales Chart */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">Hourly Sales</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Sales (₹)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-muted-foreground">Transactions</span>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between gap-2 h-48">
              {summary.hourlyBreakdown.map((hour) => (
                <div
                  key={hour.hour}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="relative w-full flex flex-col items-center">
                    <span className="text-xs font-bold mb-1">
                      ₹{(hour.sales / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full max-w-[40px] bg-primary rounded-t transition-all"
                      style={{
                        height: `${(hour.sales / maxHourlySales) * 120}px`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {hour.hour > 12 ? `${hour.hour - 12}PM` : `${hour.hour}AM`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Top Products */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-bold mb-4">Top Products</h3>
              <div className="space-y-3">
                {summary.topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <div className="text-sm font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.quantity} sold
                        </div>
                      </div>
                    </div>
                    <span className="font-bold">₹{product.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-bold mb-4">Category Breakdown</h3>
              <div className="space-y-3">
                {summary.categoryBreakdown.map((cat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <div className="text-sm font-medium">{cat.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {cat.quantity} items
                      </div>
                    </div>
                    <span className="font-bold">₹{cat.sales.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cashier Performance */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-bold mb-4">Cashier Performance</h3>
              <div className="space-y-4">
                {summary.cashierPerformance.map((cashier, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{cashier.name}</span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {cashier.transactions} transactions
                      </span>
                    </div>
                    <div className="text-xl font-bold">
                      ₹{cashier.sales.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg ₹{Math.round(cashier.sales / cashier.transactions).toLocaleString()} per transaction
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Confirmation Modal */}
      <AnimatePresence>
        {showPrintConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowPrintConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Printer className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Print Report</h2>
                    <p className="text-sm text-muted-foreground">
                      Send daily summary to printer?
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30">
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Daily Summary Report</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(selectedDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowPrintConfirm(false)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-success rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 text-white" />
            <span className="text-white font-medium">{showSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
