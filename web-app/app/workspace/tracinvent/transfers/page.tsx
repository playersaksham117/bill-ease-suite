"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Search,
  Plus,
  Package,
  CheckCircle2,
  X,
  Save,
  Calendar,
  Warehouse,
  ArrowRight,
  Trash2,
  Clock,
  MapPin,
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  unit: string;
}

interface TransferItem {
  productId: string;
  product: Product;
  quantity: number;
}

interface TransferRecord {
  id: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  referenceNo: string;
  items: TransferItem[];
  notes: string;
  status: "pending" | "in-transit" | "completed";
}

// Mock products
const mockProducts: Product[] = [
  { id: "1", name: "Tata Salt 1kg", sku: "SALT001", stock: 150, unit: "pcs" },
  { id: "2", name: "Amul Butter 500g", sku: "BUTR001", stock: 12, unit: "pcs" },
  { id: "3", name: "Maggi Noodles 70g", sku: "NOOD001", stock: 200, unit: "pcs" },
  { id: "4", name: "Parle-G Biscuits 800g", sku: "BISC001", stock: 80, unit: "pcs" },
  { id: "5", name: "Surf Excel 1kg", sku: "DETG001", stock: 8, unit: "pcs" },
];

// Mock locations
const locations = [
  "Main Warehouse",
  "Cold Storage",
  "Rack A1",
  "Rack A2",
  "Rack B1",
  "Rack B2",
  "Rack C1",
  "Retail Store",
  "Branch Office",
];

// Mock history
const mockTransferHistory: TransferRecord[] = [
  {
    id: "1",
    date: "2024-12-23",
    fromLocation: "Main Warehouse",
    toLocation: "Retail Store",
    referenceNo: "TRF-2024-001",
    items: [{ productId: "1", product: mockProducts[0], quantity: 50 }],
    notes: "Weekly retail stock",
    status: "completed",
  },
  {
    id: "2",
    date: "2024-12-22",
    fromLocation: "Cold Storage",
    toLocation: "Rack A1",
    referenceNo: "TRF-2024-002",
    items: [{ productId: "2", product: mockProducts[1], quantity: 20 }],
    notes: "",
    status: "in-transit",
  },
  {
    id: "3",
    date: "2024-12-21",
    fromLocation: "Main Warehouse",
    toLocation: "Branch Office",
    referenceNo: "TRF-2024-003",
    items: [
      { productId: "3", product: mockProducts[2], quantity: 100 },
      { productId: "4", product: mockProducts[3], quantity: 30 },
    ],
    notes: "Branch replenishment",
    status: "pending",
  },
];

export default function TransfersPage() {
  const [transferHistory, setTransferHistory] = useState<TransferRecord[]>(mockTransferHistory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "in-transit" | "completed">("all");

  // Form state
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    referenceNo: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [selectedItems, setSelectedItems] = useState<TransferItem[]>([]);

  // Filter history
  const filteredHistory = transferHistory.filter((record) => {
    const matchesSearch =
      record.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.toLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.referenceNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter products
  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Stats
  const pendingTransfers = transferHistory.filter((r) => r.status === "pending").length;
  const inTransitTransfers = transferHistory.filter((r) => r.status === "in-transit").length;
  const completedToday = transferHistory.filter(
    (r) => r.status === "completed" && r.date === new Date().toISOString().split("T")[0]
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
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  };

  // Remove item
  const removeItem = (productId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.productId !== productId));
  };

  // Submit
  const handleSubmit = () => {
    if (!formData.fromLocation || !formData.toLocation || selectedItems.length === 0) return;

    const newRecord: TransferRecord = {
      id: Date.now().toString(),
      date: formData.date,
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      referenceNo: formData.referenceNo || `TRF-${Date.now()}`,
      items: selectedItems,
      notes: formData.notes,
      status: "pending",
    };

    setTransferHistory([newRecord, ...transferHistory]);
    setShowAddModal(false);
    resetForm();
    setShowSuccess("Transfer created successfully!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      fromLocation: "",
      toLocation: "",
      referenceNo: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setSelectedItems([]);
  };

  // Update transfer status
  const updateStatus = (id: string, status: TransferRecord["status"]) => {
    setTransferHistory(
      transferHistory.map((t) => (t.id === id ? { ...t, status } : t))
    );
    setShowSuccess(`Transfer ${status === "completed" ? "completed" : "updated"}!`);
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const getStatusStyle = (status: TransferRecord["status"]) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning";
      case "in-transit":
        return "bg-primary/10 text-primary";
      case "completed":
        return "bg-success/10 text-success";
    }
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
            <h1 className="text-xl font-bold text-foreground">Transfers</h1>
            <p className="text-sm text-muted-foreground">Manage inter-warehouse stock transfers</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Transfer
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingTransfers}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inTransitTransfers}</p>
              <p className="text-xs text-muted-foreground">In Transit</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedToday}</p>
              <p className="text-xs text-muted-foreground">Completed Today</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transfers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex bg-muted rounded-lg p-1">
            {(["all", "pending", "in-transit", "completed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "in-transit" ? "In Transit" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Transfer Cards */}
        <div className="space-y-4">
          {filteredHistory.map((record, idx) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{record.fromLocation}</span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <span className="font-medium">{record.toLocation}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(record.status)}`}>
                    {record.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(record.date).toLocaleDateString()}
                </div>
                <div className="font-mono">{record.referenceNo}</div>
                {record.notes && <div>{record.notes}</div>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {record.items.length} products • {record.items.reduce((sum, i) => sum + i.quantity, 0)} units
                  </span>
                </div>

                {record.status !== "completed" && (
                  <div className="flex gap-2">
                    {record.status === "pending" && (
                      <button
                        onClick={() => updateStatus(record.id, "in-transit")}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                      >
                        Mark In Transit
                      </button>
                    )}
                    {record.status === "in-transit" && (
                      <button
                        onClick={() => updateStatus(record.id, "completed")}
                        className="px-3 py-1.5 bg-success/10 text-success rounded-lg text-sm font-medium hover:bg-success/20 transition-colors"
                      >
                        Complete Transfer
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No transfers found</p>
          </div>
        )}
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
              className="bg-card border border-border rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-bold">New Transfer</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Location Selection */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">From Location *</label>
                    <select
                      value={formData.fromLocation}
                      onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select source</option>
                      {locations
                        .filter((l) => l !== formData.toLocation)
                        .map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                  </div>
                  <div className="flex items-end justify-center pb-2">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">To Location *</label>
                    <select
                      value={formData.toLocation}
                      onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select destination</option>
                      {locations
                        .filter((l) => l !== formData.fromLocation)
                        .map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <div className="border border-border rounded-lg overflow-hidden mb-4">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Product</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-muted-foreground">Available</th>
                          <th className="text-center px-4 py-2 text-xs font-semibold text-muted-foreground">Transfer Qty</th>
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
                              {item.product.stock} {item.product.unit}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.productId, Number(e.target.value))}
                                className="w-20 h-8 px-2 bg-background border border-border rounded text-sm text-center"
                                min="1"
                                max={item.product.stock}
                              />
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
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Add products to transfer</p>
                  </div>
                )}

                {/* Notes */}
                <div>
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
                  disabled={!formData.fromLocation || !formData.toLocation || selectedItems.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Create Transfer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
