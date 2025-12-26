"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RotateCcw,
  Package,
  AlertCircle,
  CheckCircle2,
  X,
  Receipt,
  Minus,
  Plus,
  Trash2,
  Calculator,
  Clock,
  User,
} from "lucide-react";

// Types
interface ReturnItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  maxQuantity: number;
  price: number;
  reason: string;
}

interface OriginalTransaction {
  id: string;
  invoiceNumber: string;
  date: Date;
  customer: { name: string; phone: string } | null;
  items: { id: string; name: string; sku: string; quantity: number; price: number }[];
  total: number;
}

// Mock data for original transactions
const mockTransactions: OriginalTransaction[] = [
  {
    id: "1",
    invoiceNumber: "INV-250424",
    date: new Date(2025, 11, 22, 14, 30),
    customer: { name: "Rahul Sharma", phone: "9876543210" },
    items: [
      { id: "1", name: "Tata Salt 1kg", sku: "SALT001", quantity: 2, price: 28 },
      { id: "2", name: "Amul Butter 500g", sku: "BUTR001", quantity: 1, price: 275 },
      { id: "3", name: "Maggi Noodles 70g", sku: "NOOD001", quantity: 5, price: 14 },
    ],
    total: 426.72,
  },
  {
    id: "2",
    invoiceNumber: "INV-250423",
    date: new Date(2025, 11, 22, 13, 15),
    customer: null,
    items: [
      { id: "6", name: "Coca-Cola 750ml", sku: "BVRG001", quantity: 3, price: 38 },
      { id: "4", name: "Parle-G Biscuits 800g", sku: "BISC001", quantity: 2, price: 85 },
    ],
    total: 363.52,
  },
  {
    id: "3",
    invoiceNumber: "INV-250422",
    date: new Date(2025, 11, 22, 11, 45),
    customer: { name: "Priya Patel", phone: "9123456780" },
    items: [
      { id: "8", name: "Fortune Sunflower Oil 1L", sku: "OIL001", quantity: 2, price: 145 },
      { id: "10", name: "Red Label Tea 500g", sku: "TEA001", quantity: 1, price: 285 },
      { id: "5", name: "Surf Excel 1kg", sku: "DETG001", quantity: 1, price: 195 },
    ],
    total: 806.4,
  },
];

const returnReasons = [
  "Damaged/Defective",
  "Wrong Item",
  "Expired",
  "Customer Changed Mind",
  "Quality Issue",
  "Other",
];

export default function ReturnsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<OriginalTransaction | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [returnCompleted, setReturnCompleted] = useState(false);

  // Search transactions
  const filteredTransactions = searchQuery
    ? mockTransactions.filter(
        (t) =>
          t.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.customer?.phone.includes(searchQuery)
      )
    : [];

  // Select transaction for return
  const handleSelectTransaction = (transaction: OriginalTransaction) => {
    setSelectedTransaction(transaction);
    setReturnItems([]);
    setSearchQuery("");
  };

  // Add item to return
  const addToReturn = (item: OriginalTransaction["items"][0]) => {
    const existing = returnItems.find((r) => r.id === item.id);
    if (existing) {
      if (existing.quantity < existing.maxQuantity) {
        setReturnItems((prev) =>
          prev.map((r) => (r.id === item.id ? { ...r, quantity: r.quantity + 1 } : r))
        );
      }
    } else {
      setReturnItems((prev) => [
        ...prev,
        {
          id: item.id,
          name: item.name,
          sku: item.sku,
          quantity: 1,
          maxQuantity: item.quantity,
          price: item.price,
          reason: "Customer Changed Mind",
        },
      ]);
    }
  };

  // Update return quantity
  const updateReturnQuantity = (id: string, delta: number) => {
    setReturnItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, Math.min(item.maxQuantity, item.quantity + delta));
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Update return reason
  const updateReturnReason = (id: string, reason: string) => {
    setReturnItems((prev) => prev.map((item) => (item.id === id ? { ...item, reason } : item)));
  };

  // Remove from return
  const removeFromReturn = (id: string) => {
    setReturnItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate refund
  const calculateRefund = () => {
    return returnItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Process return
  const processReturn = () => {
    setShowProcessModal(false);
    setReturnCompleted(true);
    setTimeout(() => {
      setReturnCompleted(false);
      setSelectedTransaction(null);
      setReturnItems([]);
    }, 3000);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <RotateCcw className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Process Returns</h1>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Search & Select */}
        <div className="w-96 flex-shrink-0 bg-card border-r border-border flex flex-col">
          {/* Search Invoice */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by invoice # or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Search Results */}
            {filteredTransactions.length > 0 && (
              <div className="mt-3 space-y-2">
                {filteredTransactions.map((txn) => (
                  <button
                    key={txn.id}
                    onClick={() => handleSelectTransaction(txn)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedTransaction?.id === txn.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium text-primary">{txn.invoiceNumber}</span>
                      <span className="text-sm font-bold">₹{txn.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {txn.date.toLocaleDateString("en-IN")}
                      {txn.customer && (
                        <>
                          <span>•</span>
                          <User className="w-3 h-3" />
                          {txn.customer.name}
                        </>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {txn.items.length} items
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Original Bill Items */}
          {selectedTransaction && (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Original Bill Items
              </h3>
              <div className="space-y-2">
                {selectedTransaction.items.map((item) => {
                  const inReturn = returnItems.find((r) => r.id === item.id);
                  const remainingQty = item.quantity - (inReturn?.quantity || 0);

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        inReturn ? "border-warning bg-warning/5" : "border-border bg-background"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.sku}</div>
                        </div>
                        <span className="text-sm font-bold">₹{item.price}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-muted-foreground">
                          Qty: {item.quantity} {inReturn && `(${remainingQty} remaining)`}
                        </div>
                        <button
                          onClick={() => addToReturn(item)}
                          disabled={remainingQty === 0}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          + Add to Return
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!selectedTransaction && (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">Search for an invoice</p>
              <p className="text-xs mt-1">Enter invoice number or customer phone</p>
            </div>
          )}
        </div>

        {/* Right Panel - Return Items */}
        <div className="flex-1 flex flex-col">
          {/* Return Items Header */}
          <div className="flex-shrink-0 h-12 bg-muted/30 border-b border-border flex items-center justify-between px-4">
            <h3 className="font-medium flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-warning" />
              Items to Return
            </h3>
            {returnItems.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {returnItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            )}
          </div>

          {/* Return Items List */}
          <div className="flex-1 overflow-y-auto">
            {returnItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <Package className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">No items selected</p>
                <p className="text-sm">Select items from the original bill to return</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {returnItems.map((item) => (
                  <div key={item.id} className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.sku}</div>
                      </div>
                      <button
                        onClick={() => removeFromReturn(item.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateReturnQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateReturnQuantity(item.id, 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-muted-foreground ml-2">
                          / {item.maxQuantity}
                        </span>
                      </div>
                      <div className="flex-1 text-right">
                        <div className="text-sm font-bold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ₹{item.price} × {item.quantity}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <select
                        value={item.reason}
                        onChange={(e) => updateReturnReason(item.id, e.target.value)}
                        className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {returnReasons.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Refund Summary */}
          {returnItems.length > 0 && (
            <div className="flex-shrink-0 p-4 bg-card border-t border-border">
              <div className="p-4 bg-warning/10 rounded-xl mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-warning" />
                    Total Refund Amount
                  </span>
                  <span className="text-2xl font-bold text-warning">
                    ₹{calculateRefund().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowProcessModal(true)}
                className="w-full h-12 rounded-xl bg-warning text-warning-foreground font-bold flex items-center justify-center gap-2 hover:bg-warning/90 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Process Return
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Process Return Confirmation Modal */}
      <AnimatePresence>
        {showProcessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowProcessModal(false)}
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
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Confirm Return</h2>
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Original Invoice</span>
                    <span className="font-mono font-medium">
                      {selectedTransaction?.invoiceNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items to Return</span>
                    <span>{returnItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
                    <span>Refund Amount</span>
                    <span className="text-warning">₹{calculateRefund().toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  <p>• Stock will be added back to inventory</p>
                  <p>• A return credit note will be generated</p>
                  <p>• Customer will receive refund confirmation</p>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowProcessModal(false)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processReturn}
                  className="flex-1 h-11 rounded-lg bg-warning text-warning-foreground font-medium hover:bg-warning/90 transition-colors"
                >
                  Confirm Return
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {returnCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-success rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 text-white" />
            <span className="text-white font-medium">Return processed successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
