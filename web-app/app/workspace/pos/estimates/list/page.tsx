"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileEdit,
  FileText,
  Calendar,
  User,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShoppingCart,
  Printer,
  Download,
  Mail,
  Trash2,
  Eye,
  Copy,
  MoreVertical,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCcw,
} from "lucide-react";

interface EstimateItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  gstRate: number;
  gstAmount: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
}

interface Estimate {
  id: string;
  estimateNumber: string;
  items: EstimateItem[];
  customer: Customer | null;
  supplier: Supplier | null;
  totals: {
    subtotal: number;
    totalGST: number;
    grandTotal: number;
    itemCount: number;
  };
  createdAt: string;
  validUntil: string;
  note: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired" | "converted";
}

// Mock estimates data
const mockEstimates: Estimate[] = [
  {
    id: "1",
    estimateNumber: "BEP/E-0001/24-25",
    items: [
      { id: "1", name: "Tata Salt 1kg", price: 28, quantity: 10, gstRate: 5, gstAmount: 14 },
      { id: "2", name: "Amul Butter 500g", price: 275, quantity: 5, gstRate: 12, gstAmount: 165 },
    ],
    customer: { id: "1", name: "Rahul Sharma", phone: "9876543210" },
    supplier: null,
    totals: { subtotal: 1655, totalGST: 179, grandTotal: 1834, itemCount: 15 },
    createdAt: "2024-12-20T10:30:00",
    validUntil: "2025-01-05T10:30:00",
    note: "Bulk order quotation",
    status: "sent",
  },
  {
    id: "2",
    estimateNumber: "BEP/E-0002/24-25",
    items: [
      { id: "3", name: "Maggi Noodles 70g", price: 14, quantity: 50, gstRate: 18, gstAmount: 126 },
    ],
    customer: { id: "2", name: "Priya Patel", phone: "9876543211" },
    supplier: null,
    totals: { subtotal: 700, totalGST: 126, grandTotal: 826, itemCount: 50 },
    createdAt: "2024-12-19T14:00:00",
    validUntil: "2025-01-03T14:00:00",
    note: "",
    status: "accepted",
  },
  {
    id: "3",
    estimateNumber: "BEP/E-0003/24-25",
    items: [
      { id: "5", name: "Surf Excel 1kg", price: 195, quantity: 20, gstRate: 28, gstAmount: 1092 },
    ],
    customer: null,
    supplier: { id: "1", companyName: "ABC Distributors", contactPerson: "Amit Kumar" },
    totals: { subtotal: 3900, totalGST: 1092, grandTotal: 4992, itemCount: 20 },
    createdAt: "2024-12-18T09:15:00",
    validUntil: "2025-01-02T09:15:00",
    note: "Wholesale pricing requested",
    status: "draft",
  },
  {
    id: "4",
    estimateNumber: "BEP/E-0004/24-25",
    items: [
      { id: "6", name: "Coca-Cola 750ml", price: 38, quantity: 100, gstRate: 28, gstAmount: 1064 },
    ],
    customer: { id: "3", name: "Vijay Store", phone: "9876543212" },
    supplier: null,
    totals: { subtotal: 3800, totalGST: 1064, grandTotal: 4864, itemCount: 100 },
    createdAt: "2024-12-15T11:45:00",
    validUntil: "2024-12-30T11:45:00",
    note: "Event order",
    status: "converted",
  },
  {
    id: "5",
    estimateNumber: "BEP/E-0005/24-25",
    items: [
      { id: "8", name: "Fortune Sunflower Oil 1L", price: 145, quantity: 30, gstRate: 5, gstAmount: 217.5 },
    ],
    customer: { id: "4", name: "Hotel Grand", phone: "9876543213" },
    supplier: null,
    totals: { subtotal: 4350, totalGST: 217.5, grandTotal: 4567.5, itemCount: 30 },
    createdAt: "2024-12-10T16:20:00",
    validUntil: "2024-12-25T16:20:00",
    note: "",
    status: "expired",
  },
];

const statusConfig = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: FileEdit },
  sent: { label: "Sent", color: "bg-blue-500/10 text-blue-500", icon: Mail },
  accepted: { label: "Accepted", color: "bg-success/10 text-success", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive", icon: XCircle },
  expired: { label: "Expired", color: "bg-warning/10 text-warning", icon: AlertCircle },
  converted: { label: "Converted", color: "bg-primary/10 text-primary", icon: ShoppingCart },
};

export default function EstimatesListPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Load estimates on mount
  useEffect(() => {
    const savedEstimates = JSON.parse(localStorage.getItem("estimates") || "[]");
    const allEstimates = [...mockEstimates, ...savedEstimates];
    setEstimates(allEstimates);
  }, []);

  // Filter and sort estimates
  const filteredEstimates = estimates
    .filter((estimate) => {
      const matchesSearch =
        estimate.estimateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        estimate.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        estimate.supplier?.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || estimate.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  // Delete estimate
  const deleteEstimate = (id: string) => {
    setEstimates((prev) => prev.filter((e) => e.id !== id));
    const savedEstimates = JSON.parse(localStorage.getItem("estimates") || "[]");
    const updatedEstimates = savedEstimates.filter((e: Estimate) => e.id !== id);
    localStorage.setItem("estimates", JSON.stringify(updatedEstimates));
    setShowDeleteConfirm(null);
  };

  // Convert to bill
  const convertToBill = (estimate: Estimate) => {
    const billData = {
      items: estimate.items,
      customer: estimate.customer,
      supplier: estimate.supplier,
      fromEstimate: estimate.estimateNumber,
    };
    sessionStorage.setItem("resumeBill", JSON.stringify(billData));
    window.location.href = "/workspace/pos";
  };

  // Duplicate estimate
  const duplicateEstimate = (estimate: Estimate) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const fyStart = month >= 4 ? year : year - 1;
    const fyEnd = (fyStart + 1) % 100;
    const counter = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
    
    const newEstimate: Estimate = {
      ...estimate,
      id: Date.now().toString(),
      estimateNumber: `BEP/E-${counter}/${fyStart % 100}-${String(fyEnd).padStart(2, "0")}`,
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: "draft",
    };
    
    setEstimates((prev) => [newEstimate, ...prev]);
  };

  return (
    <div className="h-full flex flex-col bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-warning" />
            All Estimates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track your quotations
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/workspace/pos/estimates")}
          className="h-11 px-4 rounded-lg bg-warning text-warning-foreground font-medium flex items-center gap-2 hover:bg-warning/90 transition-colors"
        >
          <FileEdit className="w-4 h-4" />
          New Estimate
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by estimate number, customer, or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-warning"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 px-4 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-warning"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
            <option value="converted">Converted</option>
          </select>
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="h-11 px-4 bg-card border border-input rounded-lg flex items-center gap-2 hover:bg-muted transition-colors"
        >
          {sortOrder === "desc" ? (
            <SortDesc className="w-4 h-4" />
          ) : (
            <SortAsc className="w-4 h-4" />
          )}
          Date
        </button>

        <button
          onClick={() => {
            const savedEstimates = JSON.parse(localStorage.getItem("estimates") || "[]");
            setEstimates([...mockEstimates, ...savedEstimates]);
          }}
          className="h-11 px-4 bg-card border border-input rounded-lg flex items-center gap-2 hover:bg-muted transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {[
          { label: "Total", count: estimates.length, color: "text-foreground" },
          { label: "Draft", count: estimates.filter((e) => e.status === "draft").length, color: "text-muted-foreground" },
          { label: "Sent", count: estimates.filter((e) => e.status === "sent").length, color: "text-blue-500" },
          { label: "Accepted", count: estimates.filter((e) => e.status === "accepted").length, color: "text-success" },
          { label: "Expired", count: estimates.filter((e) => e.status === "expired").length, color: "text-warning" },
          { label: "Converted", count: estimates.filter((e) => e.status === "converted").length, color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-card rounded-xl border border-border">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Estimates List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredEstimates.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              >
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">No estimates found</p>
                <p className="text-sm">Create a new estimate or adjust your filters</p>
              </motion.div>
            ) : (
              filteredEstimates.map((estimate) => {
                const status = statusConfig[estimate.status];
                const StatusIcon = status.icon;
                const isExpired = new Date(estimate.validUntil) < new Date() && estimate.status !== "converted" && estimate.status !== "accepted";

                return (
                  <motion.div
                    key={estimate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-card rounded-xl border border-border hover:border-warning/50 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                          <FileEdit className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono font-bold text-warning">
                              {estimate.estimateNumber}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${status.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                            {isExpired && estimate.status === "sent" && (
                              <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">
                                Overdue
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {estimate.customer && (
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {estimate.customer.name}
                              </span>
                            )}
                            {estimate.supplier && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {estimate.supplier.companyName}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(estimate.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Valid until{" "}
                              {new Date(estimate.validUntil).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{estimate.totals.itemCount} items</span>
                            <span>GST: ₹{estimate.totals.totalGST.toFixed(2)}</span>
                            {estimate.note && <span className="italic">"{estimate.note}"</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-warning">
                            ₹{estimate.totals.grandTotal.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">Grand Total</div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedEstimate(estimate)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {estimate.status !== "converted" && (
                            <button
                              onClick={() => convertToBill(estimate)}
                              className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                              title="Convert to Bill"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => duplicateEstimate(estimate)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="Print"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(estimate.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Estimate Details Modal */}
      <AnimatePresence>
        {selectedEstimate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedEstimate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileEdit className="w-5 h-5 text-warning" />
                    {selectedEstimate.estimateNumber}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created on{" "}
                    {new Date(selectedEstimate.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEstimate(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Customer/Supplier */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedEstimate.customer && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Customer</div>
                      <div className="font-medium">{selectedEstimate.customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedEstimate.customer.phone}
                      </div>
                    </div>
                  )}
                  {selectedEstimate.supplier && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Supplier</div>
                      <div className="font-medium">{selectedEstimate.supplier.companyName}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedEstimate.supplier.contactPerson}
                      </div>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-medium mb-3">Items</h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                            Item
                          </th>
                          <th className="text-center p-3 text-xs font-medium text-muted-foreground">
                            Price
                          </th>
                          <th className="text-center p-3 text-xs font-medium text-muted-foreground">
                            Qty
                          </th>
                          <th className="text-center p-3 text-xs font-medium text-muted-foreground">
                            GST
                          </th>
                          <th className="text-right p-3 text-xs font-medium text-muted-foreground">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEstimate.items.map((item, index) => (
                          <tr key={item.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/10"}>
                            <td className="p-3 text-sm">{item.name}</td>
                            <td className="p-3 text-sm text-center">₹{item.price}</td>
                            <td className="p-3 text-sm text-center">{item.quantity}</td>
                            <td className="p-3 text-sm text-center">{item.gstRate}%</td>
                            <td className="p-3 text-sm text-right font-medium">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-warning/10 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{selectedEstimate.totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST</span>
                    <span>₹{selectedEstimate.totals.totalGST.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-warning/20">
                    <span>Grand Total</span>
                    <span className="text-warning">₹{selectedEstimate.totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Note */}
                {selectedEstimate.note && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Note</div>
                    <div className="text-sm">{selectedEstimate.note}</div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setSelectedEstimate(null)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Close
                </button>
                {selectedEstimate.status !== "converted" && (
                  <button
                    onClick={() => {
                      convertToBill(selectedEstimate);
                      setSelectedEstimate(null);
                    }}
                    className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Convert to Bill
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-lg font-bold text-center mb-2">Delete Estimate?</h3>
                <p className="text-sm text-muted-foreground text-center">
                  This action cannot be undone. The estimate will be permanently deleted.
                </p>
              </div>
              <div className="p-4 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteEstimate(showDeleteConfirm)}
                  className="flex-1 h-11 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
