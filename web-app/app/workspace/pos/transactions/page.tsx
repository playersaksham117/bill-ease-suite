"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Receipt,
  CreditCard,
  Banknote,
  QrCode,
  ArrowUpDown,
  X,
  User,
  Clock,
  Package,
  MoreVertical,
  RotateCcw,
} from "lucide-react";

// Types
interface Transaction {
  id: string;
  invoiceNumber: string;
  date: Date;
  customer: { name: string; phone: string } | null;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  paymentMethod: "cash" | "card" | "upi" | "mixed";
  status: "completed" | "refunded" | "partial-refund";
  cashier: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    invoiceNumber: "INV-250424",
    date: new Date(2025, 11, 22, 14, 30),
    customer: { name: "Rahul Sharma", phone: "9876543210" },
    items: [
      { name: "Tata Salt 1kg", quantity: 2, price: 56 },
      { name: "Amul Butter 500g", quantity: 1, price: 275 },
      { name: "Maggi Noodles 70g", quantity: 5, price: 70 },
    ],
    subtotal: 401,
    discount: 20,
    gst: 45.72,
    total: 426.72,
    paymentMethod: "upi",
    status: "completed",
    cashier: "Admin",
  },
  {
    id: "2",
    invoiceNumber: "INV-250423",
    date: new Date(2025, 11, 22, 13, 15),
    customer: null,
    items: [
      { name: "Coca-Cola 750ml", quantity: 3, price: 114 },
      { name: "Parle-G Biscuits 800g", quantity: 2, price: 170 },
    ],
    subtotal: 284,
    discount: 0,
    gst: 79.52,
    total: 363.52,
    paymentMethod: "cash",
    status: "completed",
    cashier: "Admin",
  },
  {
    id: "3",
    invoiceNumber: "INV-250422",
    date: new Date(2025, 11, 22, 11, 45),
    customer: { name: "Priya Patel", phone: "9123456780" },
    items: [
      { name: "Fortune Sunflower Oil 1L", quantity: 2, price: 290 },
      { name: "Red Label Tea 500g", quantity: 1, price: 285 },
      { name: "Surf Excel 1kg", quantity: 1, price: 195 },
    ],
    subtotal: 770,
    discount: 50,
    gst: 86.4,
    total: 806.4,
    paymentMethod: "card",
    status: "completed",
    cashier: "Admin",
  },
  {
    id: "4",
    invoiceNumber: "INV-250421",
    date: new Date(2025, 11, 22, 10, 20),
    customer: null,
    items: [{ name: "Britannia Bread", quantity: 2, price: 90 }],
    subtotal: 90,
    discount: 0,
    gst: 0,
    total: 90,
    paymentMethod: "cash",
    status: "refunded",
    cashier: "Admin",
  },
  {
    id: "5",
    invoiceNumber: "INV-250420",
    date: new Date(2025, 11, 21, 18, 30),
    customer: { name: "Amit Kumar", phone: "9988776655" },
    items: [
      { name: "Dettol Soap 125g", quantity: 4, price: 220 },
      { name: "Tata Salt 1kg", quantity: 1, price: 28 },
    ],
    subtotal: 248,
    discount: 10,
    gst: 42.84,
    total: 280.84,
    paymentMethod: "upi",
    status: "partial-refund",
    cashier: "Admin",
  },
];

const paymentMethodIcons = {
  cash: Banknote,
  card: CreditCard,
  upi: QrCode,
  mixed: Receipt,
};

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "custom">("today");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "refunded" | "partial-refund">("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesSearch =
      txn.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer?.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const todaySales = mockTransactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = mockTransactions.length;
  const refundedAmount = mockTransactions
    .filter((t) => t.status === "refunded" || t.status === "partial-refund")
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Receipt className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Transaction History</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Today's Sales</div>
            <div className="text-2xl font-bold text-primary mt-1">₹{todaySales.toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Transactions</div>
            <div className="text-2xl font-bold text-success mt-1">{totalTransactions}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">Avg. Ticket Size</div>
            <div className="text-2xl font-bold text-warning mt-1">
              ₹{(todaySales / totalTransactions || 0).toFixed(2)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="text-sm text-muted-foreground">Returns/Refunds</div>
            <div className="text-2xl font-bold text-destructive mt-1">₹{refundedAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by invoice, customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2">
          {(["today", "week", "month"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setDateFilter(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateFilter === period
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="h-10 px-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="refunded">Refunded</option>
          <option value="partial-refund">Partial Refund</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0">
              <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Date & Time</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((txn) => {
                const PaymentIcon = paymentMethodIcons[txn.paymentMethod];
                return (
                  <tr key={txn.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-primary">{txn.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {txn.date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {txn.date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {txn.customer ? (
                        <div>
                          <div className="text-sm font-medium">{txn.customer.name}</div>
                          <div className="text-xs text-muted-foreground">{txn.customer.phone}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Walk-in</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{txn.items.length} items</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold">₹{txn.total.toFixed(2)}</div>
                      {txn.discount > 0 && (
                        <div className="text-xs text-success">-₹{txn.discount} off</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <PaymentIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm capitalize">{txn.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          txn.status === "completed"
                            ? "bg-success/10 text-success"
                            : txn.status === "refunded"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {txn.status === "completed"
                          ? "Completed"
                          : txn.status === "refunded"
                          ? "Refunded"
                          : "Partial Refund"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedTransaction(txn)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Print">
                          <Printer className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {txn.status === "completed" && (
                          <button className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors" title="Return">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-border flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredTransactions.length} of {mockTransactions.length} transactions
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 text-sm font-medium">Page 1 of 1</span>
          <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Transaction Details</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1">
                    {selectedTransaction.invoiceNumber}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" />
                      Date & Time
                    </div>
                    <div className="font-medium">
                      {selectedTransaction.date.toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {selectedTransaction.date.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <User className="w-4 h-4" />
                      Customer
                    </div>
                    <div className="font-medium">
                      {selectedTransaction.customer?.name || "Walk-in Customer"}
                    </div>
                    {selectedTransaction.customer && (
                      <div className="text-sm text-muted-foreground">
                        {selectedTransaction.customer.phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-medium mb-3">Items</h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr className="text-left text-xs font-medium text-muted-foreground uppercase">
                          <th className="px-4 py-2">Item</th>
                          <th className="px-4 py-2 text-center">Qty</th>
                          <th className="px-4 py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedTransaction.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 text-sm">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium">
                              ₹{item.price.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{selectedTransaction.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedTransaction.discount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount</span>
                      <span>-₹{selectedTransaction.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST</span>
                    <span>₹{selectedTransaction.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">₹{selectedTransaction.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button className="flex-1 h-11 rounded-lg border border-border font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors">
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>
                {selectedTransaction.status === "completed" && (
                  <button className="flex-1 h-11 rounded-lg bg-destructive/10 text-destructive font-medium flex items-center justify-center gap-2 hover:bg-destructive/20 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    Process Return
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
