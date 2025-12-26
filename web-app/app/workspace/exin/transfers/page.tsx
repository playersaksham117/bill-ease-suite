"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightLeft,
  Search,
  Plus,
  Calendar,
  X,
  Save,
  Landmark,
  IndianRupee,
  CreditCard,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Clock,
  RotateCcw,
} from "lucide-react";

// Types
interface TransferRecord {
  id: string;
  date: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  reference: string;
  notes: string;
  status: "completed" | "pending" | "failed";
}

// Mock data
const mockTransfers: TransferRecord[] = [
  { id: "1", date: "2024-12-23", fromAccount: "HDFC Bank", toAccount: "ICICI Bank", amount: 50000, reference: "TRF-001", notes: "Monthly transfer", status: "completed" },
  { id: "2", date: "2024-12-22", fromAccount: "Cash", toAccount: "HDFC Bank", amount: 25000, reference: "TRF-002", notes: "Cash deposit", status: "completed" },
  { id: "3", date: "2024-12-21", fromAccount: "SBI Bank", toAccount: "Cash", amount: 15000, reference: "TRF-003", notes: "Petty cash withdrawal", status: "completed" },
  { id: "4", date: "2024-12-20", fromAccount: "ICICI Bank", toAccount: "SBI Bank", amount: 100000, reference: "TRF-004", notes: "FD deposit", status: "completed" },
  { id: "5", date: "2024-12-19", fromAccount: "HDFC Bank", toAccount: "Cash", amount: 10000, reference: "TRF-005", notes: "Office expenses", status: "pending" },
  { id: "6", date: "2024-12-18", fromAccount: "Cash", toAccount: "ICICI Bank", amount: 35000, reference: "TRF-006", notes: "Sales deposit", status: "completed" },
];

// Account balances (mock)
const accountBalances = [
  { name: "HDFC Bank", balance: 245000, icon: Landmark, color: "text-blue-500" },
  { name: "ICICI Bank", balance: 128000, icon: Landmark, color: "text-orange-500" },
  { name: "SBI Bank", balance: 185000, icon: Landmark, color: "text-blue-600" },
  { name: "Cash", balance: 35000, icon: IndianRupee, color: "text-green-500" },
  { name: "Credit Card", balance: -15000, icon: CreditCard, color: "text-purple-500" },
];

export default function TransfersPage() {
  const [records, setRecords] = useState<TransferRecord[]>(mockTransfers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TransferRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    fromAccount: "",
    toAccount: "",
    amount: "",
    reference: "",
    notes: "",
  });

  // Filter records
  const filteredRecords = records.filter((record) => {
    return (
      record.fromAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.toAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.reference.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Stats
  const totalTransfers = records.reduce((sum, r) => sum + r.amount, 0);
  const thisMonthTransfers = records
    .filter((r) => r.date.startsWith("2024-12"))
    .reduce((sum, r) => sum + r.amount, 0);
  const pendingTransfers = records
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.amount, 0);
  const totalAccBalance = accountBalances.reduce((sum, a) => sum + a.balance, 0);

  // Reset form
  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      fromAccount: "",
      toAccount: "",
      amount: "",
      reference: "",
      notes: "",
    });
    setEditingRecord(null);
  };

  // Handle submit
  const handleSubmit = () => {
    if (!formData.fromAccount || !formData.toAccount || !formData.amount) return;
    if (formData.fromAccount === formData.toAccount) {
      setShowSuccess("Cannot transfer to the same account!");
      setTimeout(() => setShowSuccess(null), 3000);
      return;
    }

    if (editingRecord) {
      setRecords(
        records.map((r) =>
          r.id === editingRecord.id
            ? { ...r, ...formData, amount: parseFloat(formData.amount) }
            : r
        )
      );
      setShowSuccess("Transfer updated successfully!");
    } else {
      const newRecord: TransferRecord = {
        id: Date.now().toString(),
        date: formData.date,
        fromAccount: formData.fromAccount,
        toAccount: formData.toAccount,
        amount: parseFloat(formData.amount),
        reference: formData.reference || `TRF-${Date.now()}`,
        notes: formData.notes,
        status: "completed",
      };
      setRecords([newRecord, ...records]);
      setShowSuccess("Transfer completed successfully!");
    }

    setShowAddModal(false);
    resetForm();
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Edit record
  const handleEdit = (record: TransferRecord) => {
    setFormData({
      date: record.date,
      fromAccount: record.fromAccount,
      toAccount: record.toAccount,
      amount: record.amount.toString(),
      reference: record.reference,
      notes: record.notes,
    });
    setEditingRecord(record);
    setShowAddModal(true);
  };

  // Delete record
  const handleDelete = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
    setShowSuccess("Transfer record deleted!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "failed":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
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
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Fund Transfers</h1>
            <p className="text-xs text-muted-foreground">Transfer between accounts</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Transfer
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Total Transferred</div>
            <div className="text-2xl font-bold text-primary mt-1">₹{totalTransfers.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">This Month</div>
            <div className="text-2xl font-bold text-success mt-1">₹{thisMonthTransfers.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-warning mt-1">₹{pendingTransfers.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="text-sm text-muted-foreground">Total Balance</div>
            <div className="text-2xl font-bold mt-1">₹{totalAccBalance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Account Balances Quick View */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {accountBalances.map((account) => {
            const Icon = account.icon;
            return (
              <div
                key={account.name}
                className="flex-shrink-0 flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-lg"
              >
                <Icon className={`w-5 h-5 ${account.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{account.name}</p>
                  <p className={`text-sm font-bold ${account.balance >= 0 ? "text-foreground" : "text-destructive"}`}>
                    ₹{account.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-4">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transfers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button className="h-10 px-4 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          This Month
        </button>
      </div>

      {/* Records List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">From</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">To</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Reference</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Notes</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.map((record, idx) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm">{record.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded">
                      {record.fromAccount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ArrowRight className="w-4 h-4 text-muted-foreground inline" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded">
                      {record.toAccount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-right">
                    ₹{record.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{record.reference}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-[150px]">
                    {record.notes || "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEdit(record)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <RotateCcw className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No transfer records found</p>
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-bold">
                  {editingRecord ? "Edit Transfer" : "New Transfer"}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="grid grid-cols-5 gap-4 items-end">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      From Account *
                    </label>
                    <select
                      value={formData.fromAccount}
                      onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select account</option>
                      {accountBalances.map((acc) => (
                        <option key={acc.name} value={acc.name}>
                          {acc.name} (₹{acc.balance.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-center pb-2">
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      To Account *
                    </label>
                    <select
                      value={formData.toAccount}
                      onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select account</option>
                      {accountBalances.map((acc) => (
                        <option key={acc.name} value={acc.name} disabled={acc.name === formData.fromAccount}>
                          {acc.name} (₹{acc.balance.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      className="w-full h-10 pl-8 pr-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="Transaction reference"
                    className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Transfer notes..."
                    rows={3}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 p-4 border-t border-border">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.fromAccount || !formData.toAccount || !formData.amount || formData.fromAccount === formData.toAccount}
                  className="flex-1 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingRecord ? "Update" : "Transfer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
