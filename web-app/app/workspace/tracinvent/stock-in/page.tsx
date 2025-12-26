"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownCircle,
  Search,
  Plus,
  Package,
  CheckCircle2,
  X,
  Save,
  Calendar,
  Building2,
  FileText,
  Barcode,
  AlertCircle,
  Trash2,
  Receipt,
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  costPrice: number;
  stock: number;
  unit: string;
}

interface StockInItem {
  productId: string;
  product: Product;
  quantity: number;
  costPrice: number;
  batchNo: string;
  expiryDate: string;
}

interface StockInRecord {
  id: string;
  date: string;
  supplier: string;
  invoiceNo: string;
  items: StockInItem[];
  totalAmount: number;
  notes: string;
  status: "completed" | "pending";
}

// Mock products
const mockProducts: Product[] = [
  { id: "1", name: "Tata Salt 1kg", sku: "SALT001", barcode: "8901030595301", category: "Grocery", costPrice: 25, stock: 150, unit: "pcs" },
  { id: "2", name: "Amul Butter 500g", sku: "BUTR001", barcode: "8901262011020", category: "Dairy", costPrice: 250, stock: 12, unit: "pcs" },
  { id: "3", name: "Maggi Noodles 70g", sku: "NOOD001", barcode: "8901058851458", category: "Instant Food", costPrice: 12, stock: 200, unit: "pcs" },
  { id: "4", name: "Parle-G Biscuits 800g", sku: "BISC001", barcode: "8904004400274", category: "Snacks", costPrice: 75, stock: 80, unit: "pcs" },
  { id: "5", name: "Surf Excel 1kg", sku: "DETG001", barcode: "8901030610325", category: "Household", costPrice: 175, stock: 8, unit: "pcs" },
];

// Mock stock in history
const mockStockInHistory: StockInRecord[] = [
  {
    id: "1",
    date: "2024-12-23",
    supplier: "Tata Consumer Products",
    invoiceNo: "INV-2024-001",
    items: [{ productId: "1", product: mockProducts[0], quantity: 100, costPrice: 25, batchNo: "B001", expiryDate: "2025-12-31" }],
    totalAmount: 2500,
    notes: "Regular stock replenishment",
    status: "completed",
  },
  {
    id: "2",
    date: "2024-12-22",
    supplier: "Nestle India",
    invoiceNo: "INV-2024-002",
    items: [{ productId: "3", product: mockProducts[2], quantity: 200, costPrice: 12, batchNo: "B002", expiryDate: "2025-06-30" }],
    totalAmount: 2400,
    notes: "",
    status: "completed",
  },
];

const suppliers = ["Tata Consumer Products", "Amul India", "Nestle India", "Parle Products", "HUL", "Other"];

export default function StockInPage() {
  const [stockInHistory, setStockInHistory] = useState<StockInRecord[]>(mockStockInHistory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    supplier: "",
    invoiceNo: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [selectedItems, setSelectedItems] = useState<StockInItem[]>([]);

  // Filter history
  const filteredHistory = stockInHistory.filter(
    (record) =>
      record.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter products for dropdown
  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Stats
  const todayRecords = stockInHistory.filter(
    (r) => r.date === new Date().toISOString().split("T")[0]
  ).length;
  const totalItemsToday = stockInHistory
    .filter((r) => r.date === new Date().toISOString().split("T")[0])
    .reduce((sum, r) => sum + r.items.reduce((s, i) => s + i.quantity, 0), 0);
  const totalValueToday = stockInHistory
    .filter((r) => r.date === new Date().toISOString().split("T")[0])
    .reduce((sum, r) => sum + r.totalAmount, 0);

  // Add product to items
  const addProduct = (product: Product) => {
    const existing = selectedItems.find((i) => i.productId === product.id);
    if (existing) return;

    setSelectedItems([
      ...selectedItems,
      {
        productId: product.id,
        product,
        quantity: 1,
        costPrice: product.costPrice,
        batchNo: "",
        expiryDate: "",
      },
    ]);
    setProductSearch("");
    setShowProductDropdown(false);
  };

  // Update item
  const updateItem = (productId: string, field: keyof StockInItem, value: string | number) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.productId === productId ? { ...item, [field]: value } : item
      )
    );
  };

  // Remove item
  const removeItem = (productId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.productId !== productId));
  };

  // Calculate total
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.costPrice,
    0
  );

  // Submit
  const handleSubmit = () => {
    if (!formData.supplier || selectedItems.length === 0) return;

    const newRecord: StockInRecord = {
      id: Date.now().toString(),
      date: formData.date,
      supplier: formData.supplier,
      invoiceNo: formData.invoiceNo || `SI-${Date.now()}`,
      items: selectedItems,
      totalAmount,
      notes: formData.notes,
      status: "completed",
    };

    setStockInHistory([newRecord, ...stockInHistory]);
    setShowAddModal(false);
    resetForm();
    setShowSuccess("Stock received successfully!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      supplier: "",
      invoiceNo: "",
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
            <h1 className="text-xl font-bold text-foreground">Stock In</h1>
            <p className="text-sm text-muted-foreground">Receive and record incoming stock</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Stock In
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <ArrowDownCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayRecords}</p>
              <p className="text-xs text-muted-foreground">Today's Receipts</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalItemsToday}</p>
              <p className="text-xs text-muted-foreground">Items Received Today</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{totalValueToday.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Today's Value</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by supplier or invoice..."
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invoice No</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Supplier</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Items</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</th>
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
                  <td className="px-4 py-4 font-mono text-sm">{record.invoiceNo}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>{record.supplier}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                      {record.items.length} items
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold">₹{record.totalAmount.toLocaleString()}</td>
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
              <ArrowDownCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No stock in records found</p>
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
                <h2 className="text-lg font-bold">New Stock In</h2>
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
                    <label className="block text-sm font-medium mb-1.5">Supplier *</label>
                    <select
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Invoice No</label>
                    <input
                      type="text"
                      value={formData.invoiceNo}
                      onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., INV-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Notes</label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Optional notes"
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
                      placeholder="Search products by name or SKU..."
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
                            <span className="text-sm">₹{product.costPrice}</span>
                          </button>
                        ))}
                        {filteredProducts.length === 0 && (
                          <p className="px-4 py-3 text-sm text-muted-foreground">No products found</p>
                        )}
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
                          <th className="text-center px-4 py-2 text-xs font-semibold text-muted-foreground">Qty</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-muted-foreground">Cost</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-muted-foreground">Batch</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-muted-foreground">Expiry</th>
                          <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">Amount</th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedItems.map((item) => (
                          <tr key={item.productId}>
                            <td className="px-4 py-2">
                              <p className="font-medium text-sm">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.productId, "quantity", Number(e.target.value))}
                                className="w-20 h-8 px-2 bg-background border border-border rounded text-sm text-center"
                                min="1"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={item.costPrice}
                                onChange={(e) => updateItem(item.productId, "costPrice", Number(e.target.value))}
                                className="w-20 h-8 px-2 bg-background border border-border rounded text-sm text-center"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={item.batchNo}
                                onChange={(e) => updateItem(item.productId, "batchNo", e.target.value)}
                                className="w-24 h-8 px-2 bg-background border border-border rounded text-sm text-center"
                                placeholder="Batch"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="date"
                                value={item.expiryDate}
                                onChange={(e) => updateItem(item.productId, "expiryDate", e.target.value)}
                                className="w-32 h-8 px-2 bg-background border border-border rounded text-sm"
                              />
                            </td>
                            <td className="px-4 py-2 text-right font-semibold text-sm">
                              ₹{(item.quantity * item.costPrice).toLocaleString()}
                            </td>
                            <td className="px-2 py-2">
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
                          <td colSpan={5} className="px-4 py-3 text-right font-semibold">Total Amount:</td>
                          <td className="px-4 py-3 text-right font-bold text-lg">₹{totalAmount.toLocaleString()}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {selectedItems.length === 0 && (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Search and add products to receive</p>
                  </div>
                )}
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
                  disabled={!formData.supplier || selectedItems.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Receive Stock
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
