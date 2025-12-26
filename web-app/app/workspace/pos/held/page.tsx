"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Play,
  Trash2,
  Clock,
  User,
  Package,
  X,
  CheckCircle2,
  ShoppingCart,
  Eye,
  Calendar,
  RefreshCcw,
} from "lucide-react";

// Types
interface HeldBillItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

interface HeldBill {
  id: string;
  billNumber: string;
  heldAt: string | Date;
  customer: { name: string; phone: string } | null;
  items: HeldBillItem[];
  totals: {
    subtotal: number;
    grandTotal: number;
    itemCount: number;
  };
  note: string;
  billDiscount: number;
  billDiscountType: "percent" | "amount";
}

export default function HeldBillsPage() {
  const router = useRouter();
  const [heldBills, setHeldBills] = useState<HeldBill[]>([]);
  const [selectedBill, setSelectedBill] = useState<HeldBill | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showResumeSuccess, setShowResumeSuccess] = useState(false);

  // Load held bills from localStorage
  useEffect(() => {
    const loadHeldBills = () => {
      const stored = localStorage.getItem("heldBills");
      if (stored) {
        const bills = JSON.parse(stored);
        setHeldBills(bills);
      }
    };
    
    loadHeldBills();
    
    // Listen for storage changes (in case another tab updates)
    window.addEventListener("storage", loadHeldBills);
    return () => window.removeEventListener("storage", loadHeldBills);
  }, []);

  // Refresh bills
  const refreshBills = () => {
    const stored = localStorage.getItem("heldBills");
    if (stored) {
      setHeldBills(JSON.parse(stored));
    }
  };

  // Calculate time elapsed
  const getTimeElapsed = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const diff = Date.now() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    }
    return `${minutes}m ago`;
  };

  // Resume bill - navigate to POS with items loaded
  const resumeBill = (bill: HeldBill) => {
    // Store the bill to resume in sessionStorage
    sessionStorage.setItem("resumeBill", JSON.stringify(bill));
    
    // Remove from held bills in localStorage
    const updatedBills = heldBills.filter((b) => b.id !== bill.id);
    localStorage.setItem("heldBills", JSON.stringify(updatedBills));
    setHeldBills(updatedBills);
    setSelectedBill(null);
    
    // Navigate to POS
    router.push("/workspace/pos");
  };

  // Delete held bill
  const deleteBill = (id: string) => {
    const updatedBills = heldBills.filter((b) => b.id !== id);
    localStorage.setItem("heldBills", JSON.stringify(updatedBills));
    setHeldBills(updatedBills);
    setShowDeleteConfirm(null);
    if (selectedBill?.id === id) {
      setSelectedBill(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Held Bills</h1>
          {heldBills.length > 0 && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              {heldBills.length} active
            </span>
          )}
        </div>
        <button
          onClick={refreshBills}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Bills List */}
        <div className="w-96 flex-shrink-0 bg-card border-r border-border flex flex-col">
          <div className="flex-shrink-0 p-4 border-b border-border">
            <p className="text-sm text-muted-foreground">
              Bills held for later completion. Click to view details or resume.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {heldBills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ClipboardList className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium">No held bills</p>
                <p className="text-sm mt-1">All bills have been processed</p>
              </div>
            ) : (
              heldBills.map((bill) => (
                <motion.div
                  key={bill.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedBill?.id === bill.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedBill(bill)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-primary">HOLD-{bill.billNumber}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeElapsed(bill.heldAt)}
                    </span>
                  </div>

                  {bill.customer ? (
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{bill.customer.name}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mb-2">Walk-in Customer</div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Package className="w-3 h-3" />
                      {bill.totals?.itemCount || bill.items?.reduce((sum: number, item: HeldBillItem) => sum + item.quantity, 0)} items
                    </div>
                    <span className="font-bold">₹{(bill.totals?.grandTotal || 0).toFixed(2)}</span>
                  </div>

                  {bill.note && (
                    <div className="mt-2 px-2 py-1.5 bg-warning/10 rounded-lg text-xs text-warning">
                      {bill.note}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Bill Details */}
        <div className="flex-1 flex flex-col">
          {selectedBill ? (
            <>
              {/* Bill Header */}
              <div className="flex-shrink-0 p-6 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">HOLD-{selectedBill.billNumber}</h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedBill.heldAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(selectedBill.heldAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Customer Info */}
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {selectedBill.customer?.name || "Walk-in Customer"}
                      </div>
                      {selectedBill.customer && (
                        <div className="text-sm text-muted-foreground">
                          {selectedBill.customer.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedBill.note && (
                  <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="text-sm font-medium text-warning mb-1">Note</div>
                    <div className="text-sm">{selectedBill.note}</div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  Items ({selectedBill.items?.length || 0})
                </h3>
                <div className="space-y-2">
                  {selectedBill.items?.map((item: HeldBillItem) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          ₹{item.price} × {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 p-6 border-t border-border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold">Grand Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{(selectedBill.totals?.grandTotal || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(selectedBill.id)}
                    className="flex-1 h-12 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive font-medium flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Bill
                  </button>
                  <button
                    onClick={() => resumeBill(selectedBill)}
                    className="flex-[2] h-12 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Resume & Continue
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Eye className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a bill to view details</p>
              <p className="text-sm mt-1">Click on any held bill from the list</p>
            </div>
          )}
        </div>
      </div>
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
                    <Trash2 className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Delete Held Bill?</h2>
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-muted-foreground">
                  Are you sure you want to delete this held bill? All items and customer
                  information will be lost.
                </p>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteBill(showDeleteConfirm)}
                  className="flex-1 h-11 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {showResumeSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-success rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 text-white" />
            <span className="text-white font-medium">Bill resumed! Redirecting to POS...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
