"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Search,
  Package,
  TrendingDown,
  ShoppingCart,
  Mail,
  Phone,
  Building2,
  ArrowDownCircle,
  Filter,
  Download,
  Bell,
} from "lucide-react";

// Types
interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPrice: number;
  supplier: string;
  supplierPhone: string;
  supplierEmail: string;
  lastRestocked: string;
  reorderQuantity: number;
}

// Mock low stock products
const mockLowStockProducts: LowStockProduct[] = [
  { id: "1", name: "Amul Butter 500g", sku: "BUTR001", category: "Dairy", currentStock: 12, minStock: 20, maxStock: 100, unit: "pcs", costPrice: 250, supplier: "Amul India", supplierPhone: "+91 98765 43210", supplierEmail: "orders@amul.coop", lastRestocked: "2024-12-15", reorderQuantity: 50 },
  { id: "2", name: "Surf Excel 1kg", sku: "DETG001", category: "Household", currentStock: 8, minStock: 25, maxStock: 150, unit: "pcs", costPrice: 175, supplier: "HUL", supplierPhone: "+91 98765 43211", supplierEmail: "orders@hul.com", lastRestocked: "2024-12-10", reorderQuantity: 75 },
  { id: "3", name: "Britannia Bread", sku: "BREA001", category: "Bakery", currentStock: 5, minStock: 15, maxStock: 50, unit: "pcs", costPrice: 40, supplier: "Britannia", supplierPhone: "+91 98765 43212", supplierEmail: "orders@britannia.com", lastRestocked: "2024-12-22", reorderQuantity: 30 },
  { id: "4", name: "Dettol Soap 125g", sku: "SOAP001", category: "Personal Care", currentStock: 15, minStock: 20, maxStock: 100, unit: "pcs", costPrice: 48, supplier: "Reckitt", supplierPhone: "+91 98765 43213", supplierEmail: "orders@reckitt.com", lastRestocked: "2024-12-18", reorderQuantity: 40 },
  { id: "5", name: "Red Label Tea 500g", sku: "TEA001", category: "Beverages", currentStock: 8, minStock: 10, maxStock: 60, unit: "pcs", costPrice: 260, supplier: "HUL", supplierPhone: "+91 98765 43211", supplierEmail: "orders@hul.com", lastRestocked: "2024-12-12", reorderQuantity: 25 },
];

// Mock out of stock products
const mockOutOfStockProducts: LowStockProduct[] = [
  { id: "6", name: "Haldiram Aloo Bhujia 400g", sku: "SNCK001", category: "Snacks", currentStock: 0, minStock: 30, maxStock: 200, unit: "pcs", costPrice: 85, supplier: "Haldiram", supplierPhone: "+91 98765 43214", supplierEmail: "orders@haldiram.com", lastRestocked: "2024-12-01", reorderQuantity: 100 },
];

export default function LowStockPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const allProducts = [...mockOutOfStockProducts, ...mockLowStockProducts];

  const categories = ["All", ...Array.from(new Set(allProducts.map((p) => p.category)))];

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const outOfStockCount = allProducts.filter((p) => p.currentStock === 0).length;
  const lowStockCount = allProducts.filter((p) => p.currentStock > 0).length;
  const totalReorderValue = allProducts.reduce(
    (sum, p) => sum + p.reorderQuantity * p.costPrice,
    0
  );

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  // Get urgency level
  const getUrgencyLevel = (product: LowStockProduct) => {
    if (product.currentStock === 0) return { level: "critical", color: "text-destructive", bg: "bg-destructive/10" };
    const ratio = product.currentStock / product.minStock;
    if (ratio <= 0.5) return { level: "high", color: "text-destructive", bg: "bg-destructive/10" };
    if (ratio <= 0.75) return { level: "medium", color: "text-warning", bg: "bg-warning/10" };
    return { level: "low", color: "text-primary", bg: "bg-primary/10" };
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Low Stock Alerts</h1>
            <p className="text-sm text-muted-foreground">Products that need to be reordered</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
              <Download className="w-4 h-4" />
              Export List
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <ShoppingCart className="w-4 h-4" />
              Create Purchase Order
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{outOfStockCount}</p>
              <p className="text-xs text-muted-foreground">Out of Stock</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lowStockCount}</p>
              <p className="text-xs text-muted-foreground">Low Stock</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{allProducts.length}</p>
              <p className="text-xs text-muted-foreground">Total Alerts</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{(totalReorderValue / 1000).toFixed(1)}K</p>
              <p className="text-xs text-muted-foreground">Reorder Value</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {selectedProducts.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedProducts.length} selected
            </span>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stock</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Urgency</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Supplier</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reorder Qty</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cost</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product, idx) => {
                const urgency = getUrgencyLevel(product);
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`hover:bg-muted/30 transition-colors ${
                      product.currentStock === 0 ? "bg-destructive/5" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelection(product.id)}
                        className="w-4 h-4 rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${urgency.bg}`}>
                          {product.currentStock === 0 ? (
                            <Package className={`w-5 h-5 ${urgency.color}`} />
                          ) : (
                            <AlertTriangle className={`w-5 h-5 ${urgency.color}`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sku} • {product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div>
                        <span className={`text-lg font-bold ${product.currentStock === 0 ? "text-destructive" : ""}`}>
                          {product.currentStock}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">{product.unit}</span>
                        <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${urgency.bg} ${urgency.color}`}>
                        {product.currentStock === 0 ? "Out of Stock" : urgency.level}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-sm">{product.supplier}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <Phone className="w-3 h-3" />
                            Call
                          </button>
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <Mail className="w-3 h-3" />
                            Email
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-semibold">{product.reorderQuantity}</span>
                      <span className="text-xs text-muted-foreground ml-1">{product.unit}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-semibold">₹{(product.reorderQuantity * product.costPrice).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">@₹{product.costPrice}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                          title="Quick Stock In"
                        >
                          <ArrowDownCircle className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          title="Create Order"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="text-foreground font-medium">All stocked up!</p>
              <p className="text-muted-foreground text-sm">No low stock alerts at the moment</p>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Reorder Recommendations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Products marked as "Critical" should be reordered immediately</li>
                <li>• Consider bulk ordering from the same supplier to save on delivery</li>
                <li>• Review reorder quantities based on historical sales data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
