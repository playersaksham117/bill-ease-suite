"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpCircle,
  Search,
  Plus,
  Package,
  CheckCircle2,
  X,
  Save,
  Calendar,
  User,
  FileText,
  Trash2,
  AlertCircle,
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
}

interface StockOutItem {
  productId: string;
  product: Product;
  quantity: number;
}

interface StockOutRecord {
  id: string;
  date: string;
  reason: string;
  destination: string;
  referenceNo: string;
  items: StockOutItem[];
  notes: string;
  status: "completed" | "pending";
}

// Mock products
const mockProducts: Product[] = [
  { id: "1", name: "Tata Salt 1kg", sku: "SALT001", category: "Grocery", price: 28, stock: 150, unit: "pcs" },
  { id: "2", name: "Amul Butter 500g", sku: "BUTR001", category: "Dairy", price: 275, stock: 12, unit: "pcs" },
  { id: "3", name: "Maggi Noodles 70g", sku: "NOOD001", category: "Instant Food", price: 14, stock: 200, unit: "pcs" },
  { id: "4", name: "Parle-G Biscuits 800g", sku: "BISC001", category: "Snacks", price: 85, stock: 80, unit: "pcs" },
  { id: "5", name: "Surf Excel 1kg", sku: "DETG001", category: "Household", price: 195, stock: 8, unit: "pcs" },
];

// Mock history
const mockStockOutHistory: StockOutRecord[] = [
  {
    id: "1",
    date: "2024-12-23",
    reason: "Internal Use",
    destination: "Office Kitchen",
    referenceNo: "OUT-2024-001",
    items: [{ productId: "1", product: mockProducts[0], quantity: 5 }],
    notes: "Monthly office supplies",
    status: "completed",
  },
  {
    id: "2",
    date: "2024-12-22",
    reason: "Damage",
    destination: "Write-off",
    referenceNo: "OUT-2024-002",
    items: [{ productId: "3", product: mockProducts[2], quantity: 10 }],
    notes: "Packaging damaged",
    status: "completed",
  },
];

const reasons = ["Internal Use", "Damage", "Expired", "Sample/Demo", "Return to Supplier", "Other"];

export default function StockOutPage() {
  const [stockOutHistory, setStockOutHistory] = useState<StockOutRecord[]>(mockStockOutHistory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    reason: "",
    destination: "",
    referenceNo: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [selectedItems, setSelectedItems] = useState<StockOutItem[]>([]);

  // Filter history
  const filteredHistory = stockOutHistory.filter(
    (record) =>
      record.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter products
  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Stats
  const todayRecords = stockOutHistory.filter(
    (r) => r.date === new Date().toISOString().split("T")[0]
  ).length;
  const totalItemsToday = stockOutHistory
    .filter((r) => r.date === new Date().toISOString().split("T")[0])
    .reduce((sum, r) => sum + r.items.reduce((s, i) => s + i.quantity, 0), 0);

  // Add product
  const addProduct = (product: Product) => {
    const existing = selectedItems.find((i) => i.productId === product.id);
    if (existing) return;

    setSelectedItems([
      ...selectedItems,
      {
        productId: product.id,
        product,
        quantity: 1,
      },
    ]);
    setProductSearch("");
    setShowProductDropdown(false);
  };

  // Update item
  const updateItem = (productId: string, quantity: number) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(quantity, item.product.stock) } : item
      )
    );
  };

  // Remove item
  const removeItem = (productId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.productId !== productId));
  };

  // Submit
  const handleSubmit = () => {
    if (!formData.reason || selectedItems.length === 0) return;

    const newRecord: StockOutRecord = {
      id: Date.now().toString(),
      date: formData.date,
      reason: formData.reason,
      destination: formData.destination,
      referenceNo: formData.referenceNo || `SO-${Date.now()}`,
      items: selectedItems,
      notes: formData.notes,
      status: "completed",
    };

    setStockOutHistory([newRecord, ...stockOutHistory]);
    setShowAddModal(false);
    resetForm();
    setShowSuccess("Stock issued successfully!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      reason: "",
      destination: "",
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
            <h1 className="text-xl font-bold text-foreground">Stock Out</h1>
            <p className="text-sm text-muted-foreground">Issue and record outgoing stock</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Stock Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <ArrowUpCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayRecords}</p>
              <p className="text-xs text-muted-foreground">Today's Issues</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalItemsToday}</p>
              <p className="text-xs text-muted-foreground">Items Issued Today</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stockOutHistory.length}</p>
              <p className="text-xs text-muted-foreground">Total Records</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by reason, reference, or destination..."
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Destination</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Items</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHistory.map((record, idx) => (
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
                      record.reason === "Damage" || record.reason === "Expired"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
                    }`}>
                      {record.reason}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">{record.destination}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                      {record.items.reduce((sum, i) => sum + i.quantity, 0)} units
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2.5 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                      {record.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredHistory.length === 0 && (
            <div className="p-12 text-center">
              <ArrowUpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No stock out records found</p>
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
                <h2 className="text-lg font-bold">New Stock Out</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Basic Info */}
                <div className="grid grid-cols-4 gap-4 mb-6">
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
                    <label className="block text-sm font-medium mb-1.5">Destination</label>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Warehouse B"
                    />
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
                  <label className="block text-sm font-medium mb-1.5">Add Products</label>
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
                            <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Items */}
                {selectedItems.length > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Product</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-muted-foreground">Available</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-muted-foreground">Issue Qty</th>
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
                            <td className="px-4 py-3 text-center">
                              <span className={`font-medium ${item.product.stock < 20 ? "text-warning" : ""}`}>
                                {item.product.stock} {item.product.unit}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateItem(item.productId, Number(e.target.value))}
                                  className="w-20 h-8 px-2 bg-background border border-border rounded text-sm text-center"
                                  min="1"
                                  max={item.product.stock}
                                />
                                {item.quantity > item.product.stock && (
                                  <AlertCircle className="w-4 h-4 text-destructive" />
                                )}
                              </div>
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
                    </table>
                  </div>
                )}

                {selectedItems.length === 0 && (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Search and add products to issue</p>
                  </div>
                )}

                {/* Notes */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1.5">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full h-20 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Additional notes..."
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
                  className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Issue Stock
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
