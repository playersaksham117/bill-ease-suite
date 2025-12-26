"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  TrendingUp,
  Boxes,
  Warehouse,
  ArrowUpCircle,
  ArrowDownCircle,
  MoreVertical,
  Edit,
  Eye,
  ScanLine,
} from "lucide-react";

// Mock inventory data
const mockInventory = [
  { id: "1", name: "Tata Salt 1kg", sku: "SALT001", category: "Grocery", stock: 150, minStock: 50, maxStock: 300, unit: "pcs", costPrice: 25, sellPrice: 28, location: "Rack A1" },
  { id: "2", name: "Amul Butter 500g", sku: "BUTR001", category: "Dairy", stock: 12, minStock: 20, maxStock: 100, unit: "pcs", costPrice: 250, sellPrice: 275, location: "Cold Storage" },
  { id: "3", name: "Maggi Noodles 70g", sku: "NOOD001", category: "Instant Food", stock: 200, minStock: 100, maxStock: 500, unit: "pcs", costPrice: 12, sellPrice: 14, location: "Rack B2" },
  { id: "4", name: "Parle-G Biscuits 800g", sku: "BISC001", category: "Snacks", stock: 80, minStock: 30, maxStock: 200, unit: "pcs", costPrice: 75, sellPrice: 85, location: "Rack C1" },
  { id: "5", name: "Surf Excel 1kg", sku: "DETG001", category: "Household", stock: 8, minStock: 25, maxStock: 150, unit: "pcs", costPrice: 175, sellPrice: 195, location: "Rack D3" },
  { id: "6", name: "Coca-Cola 750ml", sku: "BVRG001", category: "Beverages", stock: 120, minStock: 50, maxStock: 300, unit: "pcs", costPrice: 32, sellPrice: 38, location: "Cold Storage" },
  { id: "7", name: "Britannia Bread", sku: "BREA001", category: "Bakery", stock: 5, minStock: 15, maxStock: 50, unit: "pcs", costPrice: 40, sellPrice: 45, location: "Fresh Counter" },
  { id: "8", name: "Fortune Oil 1L", sku: "OIL001", category: "Grocery", stock: 40, minStock: 20, maxStock: 100, unit: "pcs", costPrice: 130, sellPrice: 145, location: "Rack A3" },
];

const categories = ["All", "Grocery", "Dairy", "Instant Food", "Snacks", "Household", "Beverages", "Bakery"];

export default function TracInventPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");

  const stats = {
    totalItems: mockInventory.length,
    totalStock: mockInventory.reduce((sum, item) => sum + item.stock, 0),
    lowStock: mockInventory.filter((item) => item.stock <= item.minStock && item.stock > 0).length,
    outOfStock: mockInventory.filter((item) => item.stock === 0).length,
    totalValue: mockInventory.reduce((sum, item) => sum + item.stock * item.costPrice, 0),
  };

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && item.stock <= item.minStock && item.stock > 0) ||
      (stockFilter === "out" && item.stock === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockStatus = (item: typeof mockInventory[0]) => {
    if (item.stock === 0) return { label: "Out of Stock", color: "bg-destructive/10 text-destructive" };
    if (item.stock <= item.minStock) return { label: "Low Stock", color: "bg-warning/10 text-warning" };
    if (item.stock >= item.maxStock * 0.8) return { label: "Overstocked", color: "bg-primary/10 text-primary" };
    return { label: "In Stock", color: "bg-success/10 text-success" };
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Stock Overview</h1>
            <p className="text-sm text-muted-foreground">Monitor and manage your inventory</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
              <ScanLine className="w-4 h-4" />
              Scan Barcode
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
              <p className="text-xs text-muted-foreground">Total Products</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Boxes className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalStock}</p>
              <p className="text-xs text-muted-foreground">Total Units</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
              <p className="text-xs text-muted-foreground">Low Stock</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.outOfStock}</p>
              <p className="text-xs text-muted-foreground">Out of Stock</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{(stats.totalValue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Stock Value</p>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="flex bg-muted rounded-lg p-1">
            {(["all", "low", "out"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStockFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  stockFilter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "All" : f === "low" ? "Low Stock" : "Out of Stock"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stock</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Min/Max</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cost</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInventory.map((item, idx) => {
                const status = getStockStatus(item);
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku} • {item.location}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-muted rounded-full text-xs font-medium">{item.category}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-lg font-bold">{item.stock}</span>
                      <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-muted-foreground">
                      {item.minStock} / {item.maxStock}
                    </td>
                    <td className="px-4 py-4 text-right text-sm">₹{item.costPrice}</td>
                    <td className="px-4 py-4 text-right text-sm font-medium">₹{item.sellPrice}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-success/10 transition-colors" title="Stock In">
                          <ArrowDownCircle className="w-4 h-4 text-success" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="Stock Out">
                          <ArrowUpCircle className="w-4 h-4 text-destructive" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
