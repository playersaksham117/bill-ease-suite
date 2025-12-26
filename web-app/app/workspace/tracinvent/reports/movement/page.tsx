"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Search,
  Download,
  Calendar,
  Printer,
  ArrowUpCircle,
  ArrowDownCircle,
  Truck,
  Calculator,
  Package,
  Filter,
  TrendingUp,
} from "lucide-react";

// Types
interface MovementRecord {
  id: string;
  date: string;
  type: "stock-in" | "stock-out" | "transfer" | "adjustment";
  referenceNo: string;
  productName: string;
  productSku: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  reason: string;
  user: string;
}

// Mock movement data
const mockMovementData: MovementRecord[] = [
  { id: "1", date: "2024-12-23", type: "stock-in", referenceNo: "SI-001", productName: "Tata Salt 1kg", productSku: "SALT001", quantity: 100, fromLocation: "", toLocation: "Rack A1", reason: "Purchase", user: "Admin" },
  { id: "2", date: "2024-12-23", type: "stock-out", referenceNo: "SO-001", productName: "Maggi Noodles 70g", productSku: "NOOD001", quantity: 50, fromLocation: "Rack B2", toLocation: "", reason: "Internal Use", user: "Admin" },
  { id: "3", date: "2024-12-22", type: "transfer", referenceNo: "TRF-001", productName: "Amul Butter 500g", productSku: "BUTR001", quantity: 20, fromLocation: "Cold Storage", toLocation: "Retail Store", reason: "Replenishment", user: "Admin" },
  { id: "4", date: "2024-12-22", type: "adjustment", referenceNo: "ADJ-001", productName: "Parle-G Biscuits 800g", productSku: "BISC001", quantity: -5, fromLocation: "Rack C1", toLocation: "", reason: "Damage", user: "Admin" },
  { id: "5", date: "2024-12-21", type: "stock-in", referenceNo: "SI-002", productName: "Coca-Cola 750ml", productSku: "BVRG001", quantity: 100, fromLocation: "", toLocation: "Cold Storage", reason: "Purchase", user: "Admin" },
  { id: "6", date: "2024-12-21", type: "stock-out", referenceNo: "SO-002", productName: "Surf Excel 1kg", productSku: "DETG001", quantity: 15, fromLocation: "Rack D3", toLocation: "", reason: "Return to Supplier", user: "Admin" },
  { id: "7", date: "2024-12-20", type: "stock-in", referenceNo: "SI-003", productName: "Fortune Sunflower Oil 1L", productSku: "OIL001", quantity: 30, fromLocation: "", toLocation: "Rack A3", reason: "Purchase", user: "Admin" },
  { id: "8", date: "2024-12-20", type: "transfer", referenceNo: "TRF-002", productName: "Britannia Bread", productSku: "BREA001", quantity: 15, fromLocation: "Fresh Counter", toLocation: "Retail Store", reason: "Daily Transfer", user: "Admin" },
  { id: "9", date: "2024-12-19", type: "adjustment", referenceNo: "ADJ-002", productName: "Maggi Noodles 70g", productSku: "NOOD001", quantity: 10, fromLocation: "Rack B2", toLocation: "", reason: "Physical Count", user: "Admin" },
  { id: "10", date: "2024-12-19", type: "stock-out", referenceNo: "SO-003", productName: "Tata Salt 1kg", productSku: "SALT001", quantity: 25, fromLocation: "Rack A1", toLocation: "", reason: "Expired", user: "Admin" },
];

const movementTypes = [
  { value: "all", label: "All Types" },
  { value: "stock-in", label: "Stock In" },
  { value: "stock-out", label: "Stock Out" },
  { value: "transfer", label: "Transfer" },
  { value: "adjustment", label: "Adjustment" },
];

export default function MovementReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  // Filter data
  const filteredData = mockMovementData.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesDate = item.date >= dateRange.from && item.date <= dateRange.to;
    return matchesSearch && matchesType && matchesDate;
  });

  // Summary calculations
  const summary = {
    totalMovements: filteredData.length,
    stockIn: filteredData.filter((m) => m.type === "stock-in").reduce((sum, m) => sum + m.quantity, 0),
    stockOut: filteredData.filter((m) => m.type === "stock-out").reduce((sum, m) => sum + m.quantity, 0),
    transfers: filteredData.filter((m) => m.type === "transfer").reduce((sum, m) => sum + m.quantity, 0),
    adjustments: filteredData.filter((m) => m.type === "adjustment").reduce((sum, m) => sum + m.quantity, 0),
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stock-in": return ArrowDownCircle;
      case "stock-out": return ArrowUpCircle;
      case "transfer": return Truck;
      case "adjustment": return Calculator;
      default: return Package;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "stock-in": return { bg: "bg-success/10", text: "text-success" };
      case "stock-out": return { bg: "bg-destructive/10", text: "text-destructive" };
      case "transfer": return { bg: "bg-primary/10", text: "text-primary" };
      case "adjustment": return { bg: "bg-warning/10", text: "text-warning" };
      default: return { bg: "bg-muted", text: "text-muted-foreground" };
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Movement Report</h1>
            <p className="text-sm text-muted-foreground">Track all stock movements and transactions</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-bold">{summary.totalMovements}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <ArrowDownCircle className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Stock In</span>
            </div>
            <p className="text-2xl font-bold text-success">+{summary.stockIn}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ArrowUpCircle className="w-5 h-5 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">Stock Out</span>
            </div>
            <p className="text-2xl font-bold text-destructive">-{summary.stockOut}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Transfers</span>
            </div>
            <p className="text-2xl font-bold">{summary.transfers}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Adjustments</span>
            </div>
            <p className="text-2xl font-bold">
              {summary.adjustments >= 0 ? `+${summary.adjustments}` : summary.adjustments}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Period:</span>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="h-9 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="h-9 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search product or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {movementTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Movement Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reference</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quantity</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">From / To</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item, idx) => {
                const Icon = getTypeIcon(item.type);
                const style = getTypeStyle(item.type);
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${style.text}`} />
                        </div>
                        <span className={`text-sm font-medium capitalize ${style.text}`}>
                          {item.type.replace("-", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono text-sm">{item.referenceNo}</td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.productSku}</p>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`font-semibold ${
                        item.type === "stock-in" ? "text-success" :
                        item.type === "stock-out" ? "text-destructive" :
                        item.quantity > 0 ? "text-success" : "text-destructive"
                      }`}>
                        {item.type === "stock-in" ? "+" : item.type === "stock-out" ? "-" : (item.quantity > 0 ? "+" : "")}
                        {Math.abs(item.quantity)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {item.type === "transfer" ? (
                        <span>{item.fromLocation} → {item.toLocation}</span>
                      ) : item.type === "stock-in" ? (
                        <span>→ {item.toLocation}</span>
                      ) : item.type === "stock-out" || item.type === "adjustment" ? (
                        <span>{item.fromLocation} →</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.reason}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="p-12 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No movements found for the selected filters</p>
            </div>
          )}
        </div>

        {/* Movement Summary by Type */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {movementTypes.slice(1).map((type) => {
            const typeData = filteredData.filter((m) => m.type === type.value);
            const totalQty = typeData.reduce((sum, m) => sum + Math.abs(m.quantity), 0);
            const style = getTypeStyle(type.value);
            const Icon = getTypeIcon(type.value);
            
            return (
              <div key={type.value} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${style.text}`} />
                  </div>
                  <div>
                    <p className="font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{typeData.length} transactions</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${style.text}`}>{totalQty}</span>
                  <span className="text-sm text-muted-foreground">units</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
