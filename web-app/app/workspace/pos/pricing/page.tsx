"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgePercent,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Tag,
  Percent,
  IndianRupee,
  Clock,
  Users,
  Package,
} from "lucide-react";

// Types
interface PriceRule {
  id: string;
  name: string;
  type: "discount" | "markup" | "special";
  value: number;
  valueType: "percent" | "amount";
  appliesTo: "all" | "category" | "product";
  categoryId?: string;
  productIds?: string[];
  startDate: Date | null;
  endDate: Date | null;
  minQuantity: number;
  isActive: boolean;
}

// Mock data
const mockPriceRules: PriceRule[] = [
  { id: "1", name: "Summer Sale 2025", type: "discount", value: 10, valueType: "percent", appliesTo: "all", startDate: new Date(2025, 11, 1), endDate: new Date(2025, 11, 31), minQuantity: 1, isActive: true },
  { id: "2", name: "Dairy Discount", type: "discount", value: 5, valueType: "percent", appliesTo: "category", categoryId: "Dairy", startDate: null, endDate: null, minQuantity: 1, isActive: true },
  { id: "3", name: "Buy 3 Get 15% Off", type: "discount", value: 15, valueType: "percent", appliesTo: "category", categoryId: "Snacks", startDate: null, endDate: null, minQuantity: 3, isActive: true },
  { id: "4", name: "Flat ₹50 Off on Grocery", type: "discount", value: 50, valueType: "amount", appliesTo: "category", categoryId: "Grocery", startDate: null, endDate: null, minQuantity: 5, isActive: false },
  { id: "5", name: "Weekend Special", type: "special", value: 20, valueType: "percent", appliesTo: "all", startDate: new Date(2025, 11, 20), endDate: new Date(2025, 11, 22), minQuantity: 1, isActive: true },
];

const categories = ["Grocery", "Dairy", "Instant Food", "Snacks", "Household", "Beverages", "Bakery", "Personal Care"];

export default function PricingPage() {
  const [priceRules, setPriceRules] = useState<PriceRule[]>(mockPriceRules);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState<PriceRule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<PriceRule>>({
    name: "",
    type: "discount",
    value: 0,
    valueType: "percent",
    appliesTo: "all",
    categoryId: "",
    startDate: null,
    endDate: null,
    minQuantity: 1,
    isActive: true,
  });

  // Filter rules
  const filteredRules = priceRules.filter((rule) =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const activeRules = priceRules.filter((r) => r.isActive).length;
  const discountRules = priceRules.filter((r) => r.type === "discount").length;
  const specialRules = priceRules.filter((r) => r.type === "special").length;

  // Handle form submit
  const handleSubmit = () => {
    if (editingRule) {
      setPriceRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id ? { ...r, ...formData } as PriceRule : r
        )
      );
      setShowSuccess("Price rule updated successfully!");
    } else {
      const newRule: PriceRule = {
        id: Date.now().toString(),
        ...formData,
      } as PriceRule;
      setPriceRules((prev) => [...prev, newRule]);
      setShowSuccess("Price rule added successfully!");
    }

    setShowAddModal(false);
    setEditingRule(null);
    resetForm();
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      type: "discount",
      value: 0,
      valueType: "percent",
      appliesTo: "all",
      categoryId: "",
      startDate: null,
      endDate: null,
      minQuantity: 1,
      isActive: true,
    });
  };

  // Open edit modal
  const openEditModal = (rule: PriceRule) => {
    setEditingRule(rule);
    setFormData(rule);
    setShowAddModal(true);
  };

  // Delete rule
  const deleteRule = (id: string) => {
    setPriceRules((prev) => prev.filter((r) => r.id !== id));
    setShowDeleteConfirm(null);
    setShowSuccess("Price rule deleted successfully!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Toggle active
  const toggleActive = (id: string) => {
    setPriceRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  // Format date range
  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (!start && !end) return "Always Active";
    const format = (d: Date) =>
      d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    if (start && end) return `${format(start)} - ${format(end)}`;
    if (start) return `From ${format(start)}`;
    return `Until ${format(end!)}`;
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <BadgePercent className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Price Management</h1>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingRule(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Price Rule
        </button>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Total Rules</div>
            <div className="text-2xl font-bold text-primary mt-1">{priceRules.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Active Rules</div>
            <div className="text-2xl font-bold text-success mt-1">{activeRules}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">Discount Rules</div>
            <div className="text-2xl font-bold text-warning mt-1">{discountRules}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted border border-border">
            <div className="text-sm text-muted-foreground">Special Offers</div>
            <div className="text-2xl font-bold mt-1">{specialRules}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search price rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Rules List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredRules.map((rule) => (
            <motion.div
              key={rule.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-xl border-2 transition-all ${
                rule.isActive
                  ? "bg-card border-border hover:border-primary/50"
                  : "bg-muted/30 border-muted opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      rule.type === "discount"
                        ? "bg-success/10"
                        : rule.type === "special"
                        ? "bg-warning/10"
                        : "bg-primary/10"
                    }`}
                  >
                    {rule.valueType === "percent" ? (
                      <Percent
                        className={`w-6 h-6 ${
                          rule.type === "discount"
                            ? "text-success"
                            : rule.type === "special"
                            ? "text-warning"
                            : "text-primary"
                        }`}
                      />
                    ) : (
                      <IndianRupee
                        className={`w-6 h-6 ${
                          rule.type === "discount"
                            ? "text-success"
                            : rule.type === "special"
                            ? "text-warning"
                            : "text-primary"
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{rule.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {rule.appliesTo === "all"
                          ? "All Products"
                          : rule.appliesTo === "category"
                          ? rule.categoryId
                          : "Specific Products"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateRange(rule.startDate, rule.endDate)}
                      </span>
                      {rule.minQuantity > 1 && (
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          Min. {rule.minQuantity} items
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {rule.valueType === "percent" ? `${rule.value}%` : `₹${rule.value}`}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">{rule.type}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditModal(rule)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(rule.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => toggleActive(rule.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    rule.isActive
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {rule.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            </motion.div>
          ))}

          {filteredRules.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BadgePercent className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No price rules found</p>
              <p className="text-sm mt-1">Create a new rule to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setEditingRule(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingRule ? "Edit Price Rule" : "Add New Price Rule"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRule(null);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Rule Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Summer Sale 2025"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Rule Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["discount", "markup", "special"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData((prev) => ({ ...prev, type }))}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                          formData.type === type
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Value *</label>
                    <input
                      type="number"
                      value={formData.value || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, value: Number(e.target.value) }))}
                      placeholder="0"
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Value Type</label>
                    <select
                      value={formData.valueType}
                      onChange={(e) => setFormData((prev) => ({ ...prev, valueType: e.target.value as "percent" | "amount" }))}
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="amount">Fixed Amount (₹)</option>
                    </select>
                  </div>
                </div>

                {/* Applies To */}
                <div>
                  <label className="block text-sm font-medium mb-2">Applies To</label>
                  <select
                    value={formData.appliesTo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, appliesTo: e.target.value as "all" | "category" | "product" }))}
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Products</option>
                    <option value="category">Specific Category</option>
                    <option value="product">Specific Products</option>
                  </select>
                </div>

                {formData.appliesTo === "category" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Min Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Quantity</label>
                  <input
                    type="number"
                    value={formData.minQuantity || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, minQuantity: Number(e.target.value) }))}
                    min="1"
                    placeholder="1"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Rule will apply only when quantity meets this minimum
                  </p>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate ? formData.startDate.toISOString().split("T")[0] : ""}
                      onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value ? new Date(e.target.value) : null,
                      }))}
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate ? formData.endDate.toISOString().split("T")[0] : ""}
                      onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value ? new Date(e.target.value) : null,
                      }))}
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="font-medium">Active Rule</span>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRule(null);
                  }}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.value}
                  className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {editingRule ? "Update Rule" : "Add Rule"}
                </button>
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
              className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Delete Price Rule?</h2>
                    <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteRule(showDeleteConfirm)}
                  className="flex-1 h-11 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
                >
                  Delete
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
