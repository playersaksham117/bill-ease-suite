"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Search,
  Plus,
  Package,
  CheckCircle2,
  X,
  Save,
  Calendar,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  ClipboardList,
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  unit: string;
  costPrice: number;
}

interface AdjustmentItem {
  productId: string;
  product: Product;
  currentStock: number;
  newStock: number;
  difference: number;
}

interface AdjustmentRecord {
  id: string;
  date: string;
  reason: string;
  referenceNo: string;
  items: AdjustmentItem[];
  notes: string;
  adjustedBy: string;
  status: "completed" | "pending-approval";
}

// Mock products
const mockProducts: Product[] = [
  { id: "1", name: "Tata Salt 1kg", sku: "SALT001", stock: 150, unit: "pcs", costPrice: 25 },
  { id: "2", name: "Amul Butter 500g", sku: "BUTR001", stock: 12, unit: "pcs", costPrice: 250 },
  { id: "3", name: "Maggi Noodles 70g", sku: "NOOD001", stock: 200, unit: "pcs", costPrice: 12 },
  { id: "4", name: "Parle-G Biscuits 800g", sku: "BISC001", stock: 80, unit: "pcs", costPrice: 75 },
  { id: "5", name: "Surf Excel 1kg", sku: "DETG001", stock: 8, unit: "pcs", costPrice: 175 },
];

const reasons = [
  "Physical Count",
  "Damage",
  "Expired",
  "Theft/Loss",
  "Data Entry Error",
  "System Correction",
  "Opening Stock",
  "Other",
];

// Mock history
const mockAdjustmentHistory: AdjustmentRecord[] = [
  {
    id: "1",
    date: "2024-12-23",
    reason: "Physical Count",
    referenceNo: "ADJ-2024-001",
    items: [{ productId: "1", product: mockProducts[0], currentStock: 145, newStock: 150, difference: 5 }],
    notes: "Monthly stock audit",
    adjustedBy: "Admin",
    status: "completed",
  },
  {
    id: "2",
    date: "2024-12-22",
    reason: "Damage",
    referenceNo: "ADJ-2024-002",
    items: [{ productId: "3", product: mockProducts[2], currentStock: 210, newStock: 200, difference: -10 }],
    notes: "Water damage - 10 packs",
    adjustedBy: "Admin",
    status: "completed",
  },
];

export default function AdjustmentsPage() {
  const [adjustmentHistory, setAdjustmentHistory] = useState<AdjustmentRecord[]>(mockAdjustmentHistory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    reason: "",
    referenceNo: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [selectedItems, setSelectedItems] = useState<AdjustmentItem[]>([]);

  // Filter history
  const filteredHistory = adjustmentHistory.filter(
    (record) =>
      record.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.referenceNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter products
  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Stats
  const totalAdjustments = adjustmentHistory.length;
  const positiveAdjustments = adjustmentHistory.filter((r) =>
    r.items.some((i) => i.difference > 0)
  ).length;
  const negativeAdjustments = adjustmentHistory.filter((r) =>
    r.items.some((i) => i.difference < 0)
  ).length;

  // Add product
  const addProduct = (product: Product) => {
    const existing = selectedItems.find((i) => i.productId === product.id);
    if (existing) return;

    setSelectedItems([
      ...selectedItems,
      {
        productId: product.id,
        product,
        currentStock: product.stock,
        newStock: product.stock,
        difference: 0,
      },
    ]);
    setProductSearch("");
    setShowProductDropdown(false);
  };

  // Update item
  const updateItem = (productId: string, newStock: number) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.productId === productId
          ? { ...item, newStock, difference: newStock - item.currentStock }
          : item
      )
    );
  };

  // Remove item
  const removeItem = (productId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.productId !== productId));
  };

  // Calculate totals
  const totalDifference = selectedItems.reduce((sum, item) => sum + item.difference, 0);
  const totalValue = selectedItems.reduce(
    (sum, item) => sum + Math.abs(item.difference) * item.product.costPrice,
    0
  );

  // Submit
  const handleSubmit = () => {
    if (!formData.reason || selectedItems.length === 0) return;

    const newRecord: AdjustmentRecord = {
      id: Date.now().toString(),
      date: formData.date,
      reason: formData.reason,
      referenceNo: formData.referenceNo || `ADJ-${Date.now()}`,
      items: selectedItems,
      notes: formData.notes,
      adjustedBy: "Admin",
      status: "completed",
    };

    setAdjustmentHistory([newRecord, ...adjustmentHistory]);
    setShowAddModal(false);
    resetForm();
    setShowSuccess("Stock adjustment saved!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      reason: "",
      referenceNo: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setSelectedItems([]);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-success text-white rounded-lg shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5" />
            {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Stock Adjustments</h1>
            <p className="text-sm text-muted-foreground">Correct stock levels and record variances</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Adjustment
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalAdjustments}</p>
              <p className="text-xs text-muted-foreground">Total Adjustments</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{positiveAdjustments}</p>
              <p className="text-xs text-muted-foreground">Stock Increases</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{negativeAdjustments}</p>
              <p className="text-xs text-muted-foreground">Stock Decreases</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search adjustments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* History Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reference</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reason</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Items</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Net Change</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Adjusted By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHistory.map((record, idx) => {
                const netChange = record.items.reduce((sum, i) => sum + i.difference, 0);
                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-sm">{record.referenceNo}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        record.reason === "Damage" || record.reason === "Theft/Loss"
                          ? "bg-destructive/10 text-destructive"
                          : record.reason === "Physical Count"
                          ? "bg-primary/10 text-primary"
                          : "bg-warning/10 text-warning"
                      }`}>
                        {record.reason}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                        {record.items.length} items
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-semibold ${
                        netChange > 0 ? "text-success" : netChange < 0 ? "text-destructive" : ""
                      }`}>
                        {netChange > 0 ? "+" : ""}{netChange}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">{record.adjustedBy}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {filteredHistory.length === 0 && (
            <div className="p-12 text-center">
              <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No adjustments found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-bold">New Stock Adjustment</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Basic Info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Reason *</label>
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select reason</option>
                      {reasons.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Reference No</label>
                    <input
                      type="text"
                      value={formData.referenceNo}
                      onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Auto-generated"
                    />
                  </div>
                </div>

                {/* Product Search */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5">Add Products to Adjust</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductDropdown(true);
                      }}
                      onFocus={() => setShowProductDropdown(true)}
                      className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Search products..."
                    />
                    {showProductDropdown && productSearch && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => addProduct(product)}
                            className="w-full px-4 py-2 text-left hover:bg-muted flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.sku}</p>
                            </div>
                            <span className="text-sm text-muted-foreground">Current: {product.stock}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Items */}
                {selectedItems.length > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden mb-4">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Product</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-muted-foreground">System Stock</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-muted-foreground">Actual Stock</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-muted-foreground">Difference</th>
                          <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">Value</th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedItems.map((item) => (
                          <tr key={item.productId}>
                            <td className="px-4 py-3">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                            </td>
                            <td className="px-4 py-3 text-center font-mono">
                              {item.currentStock}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                value={item.newStock}
                                onChange={(e) => updateItem(item.productId, Number(e.target.value))}
                                className="w-20 h-8 px-2 bg-background border border-border rounded text-sm text-center"
                                min="0"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`font-semibold ${
                                item.difference > 0 ? "text-success" : item.difference < 0 ? "text-destructive" : ""
                              }`}>
                                {item.difference > 0 ? "+" : ""}{item.difference}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-sm">
                              ₹{Math.abs(item.difference * item.product.costPrice)}
                            </td>
                            <td className="px-2 py-3">
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="p-1 hover:bg-destructive/10 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/30">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-right font-semibold">Net Change:</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`font-bold ${
                              totalDifference > 0 ? "text-success" : totalDifference < 0 ? "text-destructive" : ""
                            }`}>
                              {totalDifference > 0 ? "+" : ""}{totalDifference}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-bold">₹{totalValue}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {selectedItems.length === 0 && (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Add products to adjust their stock levels</p>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full h-20 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Reason for adjustment..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.reason || selectedItems.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Save Adjustment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
