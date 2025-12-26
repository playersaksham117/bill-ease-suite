"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Banknote,
  Smartphone,
  Wallet,
  Gift,
  IndianRupee,
  GripVertical,
  Settings,
  Eye,
  EyeOff,
  Building,
  QrCode,
} from "lucide-react";

// Types
interface PaymentMode {
  id: string;
  name: string;
  icon: string;
  type: "cash" | "card" | "upi" | "wallet" | "credit" | "voucher" | "bank" | "other";
  isActive: boolean;
  isDefault: boolean;
  requiresReference: boolean;
  referenceLabel?: string;
  opensCashDrawer: boolean;
  printReceipt: boolean;
  order: number;
  color: string;
  transactionCount: number;
  totalAmount: number;
}

// Mock data
const mockPaymentModes: PaymentMode[] = [
  { id: "1", name: "Cash", icon: "banknote", type: "cash", isActive: true, isDefault: true, requiresReference: false, opensCashDrawer: true, printReceipt: true, order: 1, color: "#22c55e", transactionCount: 1250, totalAmount: 845000 },
  { id: "2", name: "Debit Card", icon: "credit-card", type: "card", isActive: true, isDefault: false, requiresReference: true, referenceLabel: "Card Last 4 Digits", opensCashDrawer: false, printReceipt: true, order: 2, color: "#3b82f6", transactionCount: 680, totalAmount: 520000 },
  { id: "3", name: "Credit Card", icon: "credit-card", type: "card", isActive: true, isDefault: false, requiresReference: true, referenceLabel: "Card Last 4 Digits", opensCashDrawer: false, printReceipt: true, order: 3, color: "#6366f1", transactionCount: 420, totalAmount: 385000 },
  { id: "4", name: "UPI - PhonePe", icon: "smartphone", type: "upi", isActive: true, isDefault: false, requiresReference: true, referenceLabel: "UTR Number", opensCashDrawer: false, printReceipt: true, order: 4, color: "#8b5cf6", transactionCount: 890, totalAmount: 425000 },
  { id: "5", name: "UPI - GPay", icon: "smartphone", type: "upi", isActive: true, isDefault: false, requiresReference: true, referenceLabel: "UTR Number", opensCashDrawer: false, printReceipt: true, order: 5, color: "#14b8a6", transactionCount: 720, totalAmount: 365000 },
  { id: "6", name: "Paytm Wallet", icon: "wallet", type: "wallet", isActive: true, isDefault: false, requiresReference: true, referenceLabel: "Transaction ID", opensCashDrawer: false, printReceipt: true, order: 6, color: "#00baf2", transactionCount: 340, totalAmount: 125000 },
  { id: "7", name: "Gift Card", icon: "gift", type: "voucher", isActive: true, isDefault: false, requiresReference: true, referenceLabel: "Gift Card Number", opensCashDrawer: false, printReceipt: true, order: 7, color: "#f59e0b", transactionCount: 85, totalAmount: 42500 },
  { id: "8", name: "Store Credit", icon: "building", type: "credit", isActive: false, isDefault: false, requiresReference: false, opensCashDrawer: false, printReceipt: true, order: 8, color: "#ef4444", transactionCount: 45, totalAmount: 28000 },
];

const paymentTypes = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "upi", label: "UPI", icon: QrCode },
  { value: "wallet", label: "Wallet", icon: Wallet },
  { value: "credit", label: "Credit", icon: Building },
  { value: "voucher", label: "Voucher", icon: Gift },
  { value: "other", label: "Other", icon: IndianRupee },
];

const iconOptions = [
  { value: "banknote", icon: Banknote },
  { value: "credit-card", icon: CreditCard },
  { value: "smartphone", icon: Smartphone },
  { value: "wallet", icon: Wallet },
  { value: "gift", icon: Gift },
  { value: "building", icon: Building },
  { value: "qr-code", icon: QrCode },
];

const colors = [
  "#22c55e", "#3b82f6", "#6366f1", "#8b5cf6", "#14b8a6",
  "#00baf2", "#f59e0b", "#ef4444", "#ec4899", "#f97316",
];

export default function PaymentsPage() {
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>(mockPaymentModes);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMode, setEditingMode] = useState<PaymentMode | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    icon: "banknote",
    type: "cash" as PaymentMode["type"],
    isActive: true,
    isDefault: false,
    requiresReference: false,
    referenceLabel: "",
    opensCashDrawer: false,
    printReceipt: true,
    color: "#22c55e",
  });

  // Get icon component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "banknote": return Banknote;
      case "credit-card": return CreditCard;
      case "smartphone": return Smartphone;
      case "wallet": return Wallet;
      case "gift": return Gift;
      case "building": return Building;
      case "qr-code": return QrCode;
      default: return IndianRupee;
    }
  };

  // Stats
  const totalTransactions = paymentModes.reduce((sum, p) => sum + p.transactionCount, 0);
  const totalAmount = paymentModes.reduce((sum, p) => sum + p.totalAmount, 0);
  const activeCount = paymentModes.filter((p) => p.isActive).length;

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      icon: "banknote",
      type: "cash",
      isActive: true,
      isDefault: false,
      requiresReference: false,
      referenceLabel: "",
      opensCashDrawer: false,
      printReceipt: true,
      color: "#22c55e",
    });
  };

  // Open edit modal
  const openEditModal = (mode: PaymentMode) => {
    setEditingMode(mode);
    setFormData({
      name: mode.name,
      icon: mode.icon,
      type: mode.type,
      isActive: mode.isActive,
      isDefault: mode.isDefault,
      requiresReference: mode.requiresReference,
      referenceLabel: mode.referenceLabel || "",
      opensCashDrawer: mode.opensCashDrawer,
      printReceipt: mode.printReceipt,
      color: mode.color,
    });
    setShowAddModal(true);
  };

  // Handle submit
  const handleSubmit = () => {
    if (editingMode) {
      setPaymentModes((prev) =>
        prev.map((p) => {
          if (p.id === editingMode.id) {
            return {
              ...p,
              ...formData,
            };
          }
          // If setting as default, unset others
          if (formData.isDefault && p.id !== editingMode.id) {
            return { ...p, isDefault: false };
          }
          return p;
        })
      );
      setShowSuccess("Payment mode updated!");
    } else {
      const newMode: PaymentMode = {
        id: Date.now().toString(),
        ...formData,
        order: paymentModes.length + 1,
        transactionCount: 0,
        totalAmount: 0,
      };

      setPaymentModes((prev) => {
        if (formData.isDefault) {
          return [...prev.map((p) => ({ ...p, isDefault: false })), newMode];
        }
        return [...prev, newMode];
      });
      setShowSuccess("Payment mode added!");
    }

    setShowAddModal(false);
    setEditingMode(null);
    resetForm();
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Delete payment mode
  const deletePaymentMode = (id: string) => {
    setPaymentModes((prev) => prev.filter((p) => p.id !== id));
    setShowDeleteConfirm(null);
    setShowSuccess("Payment mode deleted!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Toggle active
  const toggleActive = (id: string) => {
    setPaymentModes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Set default
  const setDefault = (id: string) => {
    setPaymentModes((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.id === id,
      }))
    );
    setShowSuccess("Default payment mode updated!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <CreditCard className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Payment Modes</h1>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingMode(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Payment Mode
        </button>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Total Modes</div>
            <div className="text-2xl font-bold text-primary mt-1">{paymentModes.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-success mt-1">{activeCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">Total Transactions</div>
            <div className="text-2xl font-bold text-warning mt-1">{totalTransactions.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted border border-border">
            <div className="text-sm text-muted-foreground">Total Amount</div>
            <div className="text-2xl font-bold mt-1">₹{(totalAmount / 100000).toFixed(1)}L</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {paymentModes
            .sort((a, b) => a.order - b.order)
            .map((mode) => {
              const IconComponent = getIcon(mode.icon);

              return (
                <motion.div
                  key={mode.id}
                  layout
                  className={`p-5 rounded-xl bg-card border transition-all ${
                    mode.isDefault ? "border-primary" : "border-border"
                  } ${!mode.isActive ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-1 rounded cursor-grab text-muted-foreground hover:text-foreground">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${mode.color}20` }}
                      >
                        <IconComponent
                          className="w-6 h-6"
                          style={{ color: mode.color }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold">{mode.name}</h3>
                          {mode.isDefault && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                              Default
                            </span>
                          )}
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted capitalize">
                            {mode.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{mode.transactionCount.toLocaleString()} transactions</span>
                          <span>₹{mode.totalAmount.toLocaleString()}</span>
                          {mode.requiresReference && (
                            <span className="text-xs">Requires: {mode.referenceLabel}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Features */}
                      <div className="flex items-center gap-1 mr-4">
                        {mode.opensCashDrawer && (
                          <span className="p-1.5 rounded bg-muted" title="Opens Cash Drawer">
                            <Banknote className="w-4 h-4 text-muted-foreground" />
                          </span>
                        )}
                        {mode.printReceipt && (
                          <span className="p-1.5 rounded bg-muted" title="Prints Receipt">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                          </span>
                        )}
                      </div>

                      {!mode.isDefault && mode.isActive && (
                        <button
                          onClick={() => setDefault(mode.id)}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => toggleActive(mode.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          mode.isActive
                            ? "hover:bg-warning/10 text-warning"
                            : "hover:bg-success/10 text-success"
                        }`}
                        title={mode.isActive ? "Disable" : "Enable"}
                      >
                        {mode.isActive ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(mode)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Edit2 className="w-5 h-5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(mode.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

          {/* Empty State */}
          {paymentModes.length === 0 && (
            <div className="p-12 rounded-2xl bg-card border border-border text-center">
              <CreditCard className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Payment Modes</h3>
              <p className="text-muted-foreground mb-6">
                Add payment modes to accept customer payments.
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Payment Mode
              </button>
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
              setEditingMode(null);
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
                  {editingMode ? "Edit Payment Mode" : "Add Payment Mode"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMode(null);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Cash, Credit Card, UPI"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {paymentTypes.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            type: value as PaymentMode["type"],
                          }))
                        }
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          formData.type === value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            formData.type === value
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <div className="flex gap-2">
                    {iconOptions.map(({ value, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, icon: value }))
                        }
                        className={`w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center ${
                          formData.icon === value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            formData.icon === value
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, color }))
                        }
                        className={`w-10 h-10 rounded-lg transition-all ${
                          formData.color === color
                            ? "ring-2 ring-offset-2 ring-primary"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Reference */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.requiresReference}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          requiresReference: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="font-medium">Requires Reference Number</span>
                  </label>
                  {formData.requiresReference && (
                    <input
                      type="text"
                      value={formData.referenceLabel}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          referenceLabel: e.target.value,
                        }))
                      }
                      placeholder="e.g., Card Last 4 Digits, UTR Number"
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.opensCashDrawer}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          opensCashDrawer: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="font-medium">Opens Cash Drawer</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.printReceipt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          printReceipt: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="font-medium">Print Receipt</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isDefault: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="font-medium">Set as Default</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="font-medium">Active</span>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMode(null);
                  }}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name}
                  className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {editingMode ? "Update" : "Add Payment Mode"}
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
                    <h2 className="text-xl font-bold">Delete Payment Mode?</h2>
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone
                    </p>
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
                  onClick={() => deletePaymentMode(showDeleteConfirm)}
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
